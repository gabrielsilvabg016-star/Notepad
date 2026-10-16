
import NetInfo from '@react-native-community/netinfo';
import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    setDoc,
} from 'firebase/firestore';

import { auth, db } from './firebase';

import {
    getPendingOperations,
    removePendingOperation,
    setCardCloudId,
    setNoteCloudId,
    getLocalCardCloudId,
    getLocalNote,
    hasPendingEntity,
    getLocalCardByCloudId,
    getLocalNoteByCloudId,
    upsertSyncedCard,
    upsertSyncedNote,
    deleteSyncedCard,
    deleteSyncedNote,
    type SyncOperation,
} from '../database/dbsqlite';

type CardDocument = {
    titulo: string;
};

type NoteDocument = {
    titulo: string;
    descricao: string;
    cardCloudId: string;
};

let running = false;

function requireUser(userId: string) {
    const currentUser = auth.currentUser;

    if (!currentUser || currentUser.uid !== userId) {
        throw new Error('Usuário não autenticado ou sessão alterada.');
    }
}

function userCollection(userId: string, entity: 'cards' | 'notes') {
    return collection(db, 'users', userId, entity);
}

async function processOperation(
    operation: SyncOperation,
    userId: string,
) {
    requireUser(userId);

    const { entity, local_id: localId, cloud_id: cloudId } = operation;

    const payload = operation.payload
        ? JSON.parse(operation.payload) as Record<string, unknown>
        : {};

    const cloudRef = cloudId
        ? doc(userCollection(userId, entity), cloudId)
        : null;

    if (operation.operation === 'delete') {
        // Uma exclusão de registro que nunca chegou ao servidor
        // não precisa criar um documento remoto.
        if (cloudRef) await deleteDoc(cloudRef);

        if (entity === 'cards' && cloudId) {
            await deleteSyncedCard(cloudId, userId);
        } else if (entity === 'notes' && cloudId) {
            await deleteSyncedNote(cloudId, userId);
        }

        await removePendingOperation(operation.id);
        return;
    }

    if (entity === 'cards') {
        const titulo = String(payload.titulo ?? '');

        if (!cloudRef) {
            throw new Error('Card sem cloud_id; é necessária uma migração.');
        }

        await setDoc(cloudRef, {
            titulo,
            userId,
            updatedAt: new Date().toISOString(),
        }, { merge: true });

        await setCardCloudId(localId, cloudRef.id, userId);
        await removePendingOperation(operation.id);
        return;
    }

    // Notas precisam de um card existente no Firestore.
    const cardId = Number(payload.cardId);

    const localNote = await getLocalNote(localId, userId);
    const cardCloudId =
        localNote?.cardCloudId ??
        await getLocalCardCloudId(cardId, userId);

    if (!cardCloudId) {
        // Não removemos a operação. Ela poderá ser processada
        // depois que o card correspondente for sincronizado.
        throw new Error('Aguardando sincronização do card da nota.');
    }

    if (!cloudRef) {
        throw new Error('Nota sem cloud_id; é necessária uma migração.');
    }

    const noteDocument: NoteDocument = {
        titulo: String(payload.titulo ?? localNote?.titulo ?? ''),
        descricao: String(payload.descricao ?? localNote?.descricao ?? ''),
        cardCloudId,
    };

    await setDoc(cloudRef, {
        ...noteDocument,
        userId,
        updatedAt: new Date().toISOString(),
    }, { merge: true });

    await setNoteCloudId(localId, cloudRef.id, cardCloudId, userId);
    await removePendingOperation(operation.id);
}

export async function syncPendingChanges(userId: string) {
    if (running) return;

    requireUser(userId);

    const network = await NetInfo.fetch();

    if (!network.isConnected || network.isInternetReachable === false) {
        return;
    }

    running = true;

    try {
        const operations = await getPendingOperations(userId);

        for (const operation of operations) {
            requireUser(userId);

            try {
                await processOperation(operation, userId);
            } catch (error) {
                // Mantém a operação na fila para tentar novamente.
                // Não avança sobre a operação que falhou: a ordem importa.
                console.warn('Falha ao sincronizar operação:', error);
                break;
            }
        }
    } finally {
        running = false;
    }
}

export async function pullFromFirestore(userId: string) {
    requireUser(userId);

    const network = await NetInfo.fetch();

    if (!network.isConnected || network.isInternetReachable === false) {
        return;
    }

    // Primeiro sincroniza os cards, para resolver as referências das notas.
    const cardsSnapshot = await getDocs(userCollection(userId, 'cards'));

    for (const item of cardsSnapshot.docs) {
        requireUser(userId);

        if (await hasPendingEntity('cards', item.id, userId)) continue;

        const data = item.data() as CardDocument;

        const local = await getLocalCardByCloudId(item.id, userId);

        if (!local) {
            await upsertSyncedCard(item.id, data.titulo, userId);
        } else {
            await upsertSyncedCard(item.id, data.titulo, userId);
        }
    }

    const notesSnapshot = await getDocs(userCollection(userId, 'notes'));

    for (const item of notesSnapshot.docs) {
        requireUser(userId);

        if (await hasPendingEntity('notes', item.id, userId)) continue;

        const data = item.data() as Partial<NoteDocument>;

        if (!data.cardCloudId || typeof data.titulo !== 'string' ||
            typeof data.descricao !== 'string') {
            continue;
        }

        await upsertSyncedNote(
            item.id,
            data.cardCloudId,
            data.titulo,
            data.descricao,
            userId,
        );
    }
}

export async function syncNow(userId: string) {
    requireUser(userId);

    await syncPendingChanges(userId);
    await pullFromFirestore(userId);
}

export function startSyncOnReconnect(userId: string) {
    requireUser(userId);

    return NetInfo.addEventListener((state) => {
        if (state.isConnected && state.isInternetReachable !== false) {
            void syncNow(userId);
        }
    });
}
