import * as SQLite from 'expo-sqlite';

const dbPromise = SQLite.openDatabaseAsync('notepad.db');

export async function startDB() {
const db = await dbPromise;

await db.execAsync(`
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS cards (
id INTEGER PRIMARY KEY AUTOINCREMENT,
titulo TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS notes (
id INTEGER PRIMARY KEY AUTOINCREMENT,
card_id INTEGER NOT NULL,
descricao TEXT NOT NULL,
FOREIGN KEY (card_id)
REFERENCES cards(id)
ON DELETE CASCADE
);
`);
}

/////////
//CARDS//
/////////

export async function createCard(titulo: string) {
const db = await dbPromise;

const result = await db.runAsync(
"INSERT INTO cards (titulo) VALUES (?)",
titulo
);

return result.lastInsertRowId;
}

export async function getCards() {
const db = await dbPromise;

return await db.getAllAsync<{
id: number;
titulo: string;
}>(
"SELECT id, titulo FROM cards ORDER BY id DESC"
);
}

export async function updateCard(id: number, titulo: string) {
const db = await dbPromise;

await db.runAsync(
"UPDATE cards SET titulo = ? WHERE id = ?",
titulo,
id
);
}

export async function deleteCard(id: number) {
const db = await dbPromise;

await db.runAsync(
"DELETE FROM cards WHERE id = ?",
id
);
}

/////////
//NOTES//
/////////

export async function createNote(
cardId: number,
descricao: string
) {
const db = await dbPromise;

const result = await db.runAsync(
"INSERT INTO notes (card_id, descricao) VALUES (?, ?)",
cardId,
descricao
);

return result.lastInsertRowId;
}

export async function getNotesByCard(cardId: number) {
const db = await dbPromise;

return await db.getAllAsync<{
id: number;
cardId: number;
descricao: string;
}>(
`
SELECT id, card_id AS cardId, descricao
FROM notes
WHERE card_id = ?
ORDER BY id DESC
`,
cardId
);
}

export async function updateNote(
id: number,
descricao: string
) {
const db = await dbPromise;

await db.runAsync(
"UPDATE notes SET descricao = ? WHERE id = ?",
descricao,
id
);
}

export async function deleteNote(id: number) {
const db = await dbPromise;

await db.runAsync(
"DELETE FROM notes WHERE id = ?",
id
);
}