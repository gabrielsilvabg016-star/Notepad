import * as SQLite from 'expo-sqlite';
import * as Crypto from 'expo-crypto';

const dbPromise = SQLite.openDatabaseAsync('notepad.db');

export type Card = {
    id: Number;
    titulo: string;
    cloud_id: string | null;
};

export type Note = {
    id: number;
    cardId: number;
    descricao: string;
    titulo: string;
    cloud_id: string | null;
    cardCloudId: string | null;
};

export type SyncOperation = {
    id: number;
    entity: 'cards' | 'notes';
    local_id: number;
    operation: 'create' | 'update' | 'delete';
    cloud_id: string;
    payload: string | null;
    user_id: string;
};

type QueueInput = {
    entity: 'cards' | 'notes';
    localId: number;
    operation: 'create' | 'update' | 'delete';
    cloudId: string;
    userId: string;
    payload: object | null;
};

export async function startDB() {
    const db = await dbPromise;

    await db.execAsync(`
    PRAGMA foreign_keys = ON;
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    card_id INTEGER NOT NULL,
    descricao TEXT NOT NULL,
    titulo TEXT NOT NULL,
    FOREIGN KEY (card_id)
        REFERENCES cards(id)
        ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS sync_queue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entity TEXT NOT NULL,
    local_id INTEGER NOT NULL,
    operation TEXT NOT NULL,
    cloud_id TEXT NOT NULL,
    payload TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
`);

    ////////////
    //MIGRAÇÃO//
    ////////////

    const migrateColumns = async (table: string, columns: { name: string; sql: string }[],) => {
        const existing = await db.getAllAsync<{ name: string }>(
            `PRAGMA table_info(${table})`,
        );

        const names = new Set(existing.map((column) => column.name));

        for (const column of columns) {
            if (!names.has(column.name)) {
                await db.execAsync(
                    `ALTER TABLE ${table} ADD COLUMN ${column.name} ${column.sql}`,
                );
            }
        }
    };

    await migrateColumns('cards', [
        { name: 'cloud_id', sql: 'TEXT' },
        { name: 'user_id', sql: "TEXT NOT NULL DEFAULT ''" },
    ]);

    await migrateColumns('notes', [
        { name: 'cloud_id', sql: 'TEXT' },
        { name: 'card_cloud_id', sql: 'TEXT' },
        { name: 'user_id', sql: "TEXT NOT NULL DEFAULT ''" },
    ]);

    await migrateColumns('sync_queue', [
        { name: 'user_id', sql: "TEXT NOT NULL DEFAULT ''" },
    ]);

    await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_cards_user
        ON cards(user_id);
        
    CREATE INDEX IF NOT EXISTS idx_notes_user_card
        ON notes(user_id, card_id);
        
    CREATE INDEX IF NOT EXISTS idx_sync_queue_user
        ON sync_queue(user_id, id);`);
}

async function enqueue(db: SQLite.SQLiteDatabase, input: QueueInput) {
    await db.runAsync(`
        INSERT INTO sync_queue (entity, local_id, operation, cloud_id, payload, user_id)
        VALUES (?, ?, ?, ?, ?, ?)`,
        input.entity,
        input.localId,
        input.operation,
        input.cloudId,
        input.payload === null ? null : JSON.stringify(input.payload),
        input.userId,
    );
}

/////////
//CARDS//
/////////

export async function createCard(titulo: string, userId: string) {
    const db = await dbPromise;
    const cloudId = Crypto.randomUUID();

    let localId = 0;

    await db.withExclusiveTransactionAsync(async (tx) => {
        const result = await tx.runAsync(
            `INSERT INTO cards (titulo, cloud_id, user_id) VALUES (?, ?,  ?)`,
            titulo, cloudId, userId,
        );

        localId = result.lastInsertRowId;

        await enqueue(tx, {
            entity: 'cards',
            localId,
            operation: 'create',
            cloudId,
            userId,
            payload: { titulo },
        });
    });

    return localId;
}

export async function getCards(userId: string) {
    const db = await dbPromise;

    return db.getAllAsync<Card>(
        `SELECT id, titulo, cloud_id
        FROM cards
        WHERE user_id = ?
        ORDER BY id DESC`,
        userId,
    );
}

export async function updateCard(id: number, titulo: string, userId: string) {
    const db = await dbPromise;

    await db.withExclusiveTransactionAsync(async (tx) => {
        const card = await tx.getFirstAsync<Card>(
            `SELECT id, titulo, cloud_id
            FROM cards WHERE id = ? AND user_id = ?`,
            id, userId,
        );

        if (!card) throw new Error('Card não encontrado.');

        await tx.runAsync(
            `UPDATE cards SET titulo = ? WHERE id = ? AND user_id = ?`,
            titulo, id, userId,
        );

        await enqueue(tx, {
            entity: 'cards',
            localId: id,
            operation: 'update',
            cloudId: card.cloud_id ?? Crypto.randomUUID(),
            userId,
            payload: { titulo },
        });
    });
}

export async function deleteCard(id: number, userId: string) {
    const db = await dbPromise;

    await db.withExclusiveTransactionAsync(async (tx) => {
        const card = await tx.getFirstAsync<Card>(
            `SELECT id, titulo, cloud_id
            FROM cards WHERE id = ? AND user_id = ?`,
            id, userId,
        );

        if (!card) return;

        const notes = await tx.getAllAsync<Note>(
            `SELECT id, card_id AS cardId, descricao, titulo, cloud_id,
            card_cloud_id AS cardCloudId
            FROM notes WHERE card_id = ? AND user_id = ?`,
            id, userId,
        );

        for (const note of notes) {
            await enqueue(tx, {
                entity: 'notes',
                localId: note.id,
                operation: 'delete',
                cloudId: note.cloud_id ?? '',
                userId,
                payload: null,
            });
        }

        await enqueue(tx, {
            entity: 'cards',
            localId: id,
            operation: 'delete',
            cloudId: card.cloud_id ?? '',
            userId,
            payload: null,
        });

        await tx.runAsync(
            `DELETE FROM cards WHERE id = ? AND user_id = ?`,
            id, userId,
        );
    });
}

/////////
//NOTES//
/////////

export async function createNote(
    cardId: number,
    descricao: string,
    titulo: string,
    userId: string,
) {
    const db = await dbPromise;
    const cloudId = Crypto.randomUUID();

    let localId = 0;

    await db.withExclusiveTransactionAsync(async (tx) => {
        const card = await tx.getFirstAsync<{ id: number }>(
            'SELECT id FROM cards WHERE id = ? AND user_id = ?',
            cardId,
            userId,
        );

        if (!card) throw new Error('Card não encontrado.');

        const result = await tx.runAsync(
            `INSERT INTO notes
        (card_id, descricao, titulo, cloud_id, user_id)
       VALUES (?, ?, ?, ?, ?)`,
            cardId,
            descricao,
            titulo,
            cloudId,
            userId,
        );

        localId = result.lastInsertRowId;

        await enqueue(tx, {
            entity: 'notes',
            localId,
            operation: 'create',
            cloudId,
            userId,
            payload: { cardId, descricao, titulo },
        });
    });

    return localId;
}

export async function getNotesByCard(cardId: number, userId: string) {
    const db = await dbPromise;

    return db.getAllAsync<Note>(
        `SELECT n.id, n.card_id AS cardId, n.descricao, n.titulo,
            n.cloud_id, c.cloud_id AS cardCloudId
     FROM notes n
     INNER JOIN cards c ON c.id = n.card_id
     WHERE n.card_id = ?
       AND n.user_id = ?
       AND c.user_id = ?
     ORDER BY n.id DESC`,
        cardId,
        userId,
        userId,
    );
}

export async function updateNote(
    id: number,
    descricao: string,
    titulo: string,
    userId: string,
) {
    const db = await dbPromise;

    await db.withExclusiveTransactionAsync(async (tx) => {
        const note = await tx.getFirstAsync<Note>(
            `SELECT id, card_id AS cardId, descricao, titulo,
              cloud_id, card_cloud_id AS cardCloudId
       FROM notes WHERE id = ? AND user_id = ?`,
            id,
            userId,
        );

        if (!note) throw new Error('Nota não encontrada.');

        await tx.runAsync(
            `UPDATE notes SET descricao = ?, titulo = ?
       WHERE id = ? AND user_id = ?`,
            descricao,
            titulo,
            id,
            userId,
        );

        await enqueue(tx, {
            entity: 'notes',
            localId: id,
            operation: 'update',
            cloudId: note.cloud_id ?? '',
            userId,
            payload: {
                descricao,
                titulo,
                cardId: note.cardId,
            },
        });
    });
}

export async function deleteNote(id: number, userId: string) {
    const db = await dbPromise;

    await db.withExclusiveTransactionAsync(async (tx) => {
        const note = await tx.getFirstAsync<Note>(
            `SELECT id, card_id AS cardId, descricao, titulo,
              cloud_id, card_cloud_id AS cardCloudId
       FROM notes WHERE id = ? AND user_id = ?`,
            id,
            userId,
        );

        if (!note) return;

        await enqueue(tx, {
            entity: 'notes',
            localId: id,
            operation: 'delete',
            cloudId: note.cloud_id ?? '',
            userId,
            payload: null,
        });

        await tx.runAsync(
            'DELETE FROM notes WHERE id = ? AND user_id = ?',
            id,
            userId,
        );
    });
}

export async function getNoteCount(cardId: number, userId: string) {
    const db = await dbPromise;

    const result = await db.getFirstAsync<{ count: number }>(
        `SELECT COUNT(*) AS count FROM notes
     WHERE card_id = ? AND user_id = ?`,
        cardId,
        userId,
    );

    return result?.count ?? 0;
}

// Funções usadas pelo serviço de sincronização.

export async function getPendingOperations(userId: string) {
    const db = await dbPromise;

    return db.getAllAsync<SyncOperation>(
        `SELECT id, entity, local_id, operation, cloud_id, payload,
            user_id
     FROM sync_queue
     WHERE user_id = ?
     ORDER BY id ASC`,
        userId,
    );
}

export async function removePendingOperation(id: number) {
    const db = await dbPromise;
    await db.runAsync('DELETE FROM sync_queue WHERE id = ?', id);
}

export async function setCardCloudId(
    localId: number,
    cloudId: string,
    userId: string,
) {
    const db = await dbPromise;

    await db.runAsync(
        `UPDATE cards SET cloud_id = ?
     WHERE id = ? AND user_id = ?`,
        cloudId,
        localId,
        userId,
    );
}

export async function setNoteCloudId(
    localId: number,
    cloudId: string,
    cardCloudId: string,
    userId: string,
) {
    const db = await dbPromise;

    await db.runAsync(
        `UPDATE notes SET cloud_id = ?, card_cloud_id = ?
     WHERE id = ? AND user_id = ?`,
        cloudId,
        cardCloudId,
        localId,
        userId,
    );
}

export async function getLocalCardCloudId(
    localId: number,
    userId: string,
) {
    const db = await dbPromise;

    const row = await db.getFirstAsync<{ cloud_id: string | null }>(
        `SELECT cloud_id FROM cards WHERE id = ? AND user_id = ?`,
        localId,
        userId,
    );

    return row?.cloud_id ?? null;
}

export async function getLocalNote(
    localId: number,
    userId: string,
) {
    const db = await dbPromise;

    return db.getFirstAsync<Note>(
        `SELECT n.id, n.card_id AS cardId, n.descricao, n.titulo,
            n.cloud_id, c.cloud_id AS cardCloudId
     FROM notes n
     INNER JOIN cards c ON c.id = n.card_id
     WHERE n.id = ? AND n.user_id = ? AND c.user_id = ?`,
        localId,
        userId,
        userId,
    );
}

export async function getLocalCardByCloudId(
    cloudId: string,
    userId: string,
) {
    const db = await dbPromise;

    return db.getFirstAsync<Card>(
        `SELECT id, titulo, cloud_id FROM cards
     WHERE cloud_id = ? AND user_id = ?`,
        cloudId,
        userId,
    );
}

export async function getLocalNoteByCloudId(
    cloudId: string,
    userId: string,
) {
    const db = await dbPromise;

    return db.getFirstAsync<Note>(
        `SELECT id, card_id AS cardId, descricao, titulo,
            cloud_id, card_cloud_id AS cardCloudId
     FROM notes WHERE cloud_id = ? AND user_id = ?`,
        cloudId,
        userId,
    );
}

export async function hasPendingEntity(
    entity: 'cards' | 'notes',
    cloudId: string,
    userId: string,
) {
    const db = await dbPromise;

    const row = await db.getFirstAsync<{ id: number }>(
        `SELECT id FROM sync_queue
     WHERE entity = ? AND cloud_id = ? AND user_id = ?
     LIMIT 1`,
        entity,
        cloudId,
        userId,
    );

    return !!row;
}

export async function upsertSyncedCard(
    cloudId: string,
    titulo: string,
    userId: string,
) {
    const db = await dbPromise;

    await db.withExclusiveTransactionAsync(async (tx) => {
        const existing = await tx.getFirstAsync<{ id: number }>(
            'SELECT id FROM cards WHERE cloud_id = ? AND user_id = ?',
            cloudId,
            userId,
        );

        if (existing) {
            await tx.runAsync(
                'UPDATE cards SET titulo = ? WHERE id = ?',
                titulo,
                existing.id,
            );
        } else {
            await tx.runAsync(
                'INSERT INTO cards (titulo, cloud_id, user_id) VALUES (?, ?, ?)',
                titulo,
                cloudId,
                userId,
            );
        }
    });
}

export async function upsertSyncedNote(
    cloudId: string,
    cardCloudId: string,
    titulo: string,
    descricao: string,
    userId: string,
) {
    const db = await dbPromise;

    await db.withExclusiveTransactionAsync(async (tx) => {
        const card = await tx.getFirstAsync<{ id: number }>(
            'SELECT id FROM cards WHERE cloud_id = ? AND user_id = ?',
            cardCloudId,
            userId,
        );

        // O card deve ser sincronizado antes da nota.
        if (!card) return;

        const existing = await tx.getFirstAsync<{ id: number }>(
            'SELECT id FROM notes WHERE cloud_id = ? AND user_id = ?',
            cloudId,
            userId,
        );

        if (existing) {
            await tx.runAsync(
                `UPDATE notes SET card_id = ?, card_cloud_id = ?,
         titulo = ?, descricao = ? WHERE id = ?`,
                card.id,
                cardCloudId,
                titulo,
                descricao,
                existing.id,
            );
        } else {
            await tx.runAsync(
                `INSERT INTO notes
         (card_id, card_cloud_id, titulo, descricao, cloud_id, user_id)
         VALUES (?, ?, ?, ?, ?, ?)`,
                card.id,
                cardCloudId,
                titulo,
                descricao,
                cloudId,
                userId,
            );
        }
    });
}

export async function deleteSyncedCard(
    cloudId: string,
    userId: string,
) {
    const db = await dbPromise;

    await db.runAsync(
        'DELETE FROM cards WHERE cloud_id = ? AND user_id = ?',
        cloudId,
        userId,
    );
}

export async function deleteSyncedNote(
    cloudId: string,
    userId: string,
) {
    const db = await dbPromise;

    await db.runAsync(
        'DELETE FROM notes WHERE cloud_id = ? AND user_id = ?',
        cloudId,
        userId,
    );
}