import { db } from "../services/firebase";

import {
    collection,
    addDoc,
    onSnapshot,
    query,
    where,
    doc,
    updateDoc,
    deleteDoc,
    getDocs,
} from "firebase/firestore";

import { Alert } from "react-native";

export type CardIcon = "star" | "checklist" | "calendar";

export type Card = {
    id: string;
    titulo: string;
    icon: CardIcon;
    iconeUrl?: string;
};

export type Note = {
    id: string;
    card_id: string;
    titulo: string;
    descricao: string;
    data: Date | null;
    imagemUrl?: string;
};

const cardCollectionRef = collection(db, "Cards");
const noteCollectionRef = collection(db, "Notes");


// ==============================
// CREATE
// ==============================

export const criarCards = async (
    titulo: string,
    userId: string,
    icon: CardIcon,
    iconeUrl?: string,
) => {
    await addDoc(cardCollectionRef, {
        titulo,
        userId,
        icon,
        iconeUrl: iconeUrl || "",
    });
};

export const criarNotes = async (
    userId: string,
    cardId: string,
    titulo: string,
    descricao: string,
    data: Date | null,
    imagemUrl?: string
) => {
    await addDoc(noteCollectionRef, {
        descricao,
        userId,
        card_id: cardId,
        titulo,
        data,
        imagemUrl: imagemUrl || ""
    });
};

// ==============================
// READ 
// ==============================

export const observarCards = (
    userId: string,
    callback: (cards: Card[]) => void
) => {

    const q = query(
        cardCollectionRef,
        where("userId", "==", userId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {

        const listaCards: Card[] = snapshot.docs.map((documento) => ({
            id: documento.id,
            titulo: documento.data().titulo,
            icon: documento.data().icon || "star",
            iconeUrl: documento.data().iconeUrl || ""
        }));

        callback(listaCards);
    });

    return unsubscribe;
};

export const observarNotesPorCard = (
    userId: string,
    cardId: string,
    callback: (notes: Note[]) => void
) => {
    const q = query(noteCollectionRef, where("userId", "==", userId), where("card_id", "==", cardId));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const listaNotes: Note[] = snapshot.docs.map((documento) => ({
            id: documento.id,
            card_id: documento.data().card_id,
            titulo: documento.data().titulo,
            descricao: documento.data().descricao,
            data: documento.data().data?.toDate() || null,
            imagemUrl: documento.data().imagemUrl || ""
        }));

        callback(listaNotes);
    })

    return unsubscribe;
}

// ==============================
// UPDATE
// ==============================

export const atualizarCards = async (
    cardId: string,
    titulo?: string,
    iconeUrl?: string
) => {

    const cardRef = doc(db, "Cards", cardId);

    const dadosAtualizados: {
        titulo?: string;
        iconeUrl?: string;
    } = {};

    if (titulo !== undefined) {
        dadosAtualizados.titulo = titulo;
    }

    if (iconeUrl !== undefined) {
        dadosAtualizados.iconeUrl = iconeUrl;
    }

    await updateDoc(cardRef, dadosAtualizados);
};


export const atualizarNotes = async (
    noteId: string,
    dados: {
        titulo?: string;
        descricao?: string;
        data?: Date | null;
        imagemUrl?: string;
        card_id?: string;
    }
) => {

    const noteRef = doc(db, "Notes", noteId);

    await updateDoc(noteRef, dados);
};

// ==============================
// DELETE
// ==============================

export const excluirCards = async (
    cardId: string
) => {

    const q = query(noteCollectionRef, where("card_id", "==", cardId));
    const snapshot = await getDocs(q);

    if(!snapshot.empty){
        throw new Error(
            "Remova as Notas desse Card para removelo"
        );
    }

    const cardRef = doc(db, "Cards", cardId);
    await deleteDoc(cardRef);

    Alert.alert("Card excluido");
};

export const excluirNotes = async (
    noteId: string
) => {

    const noteRef = doc(db, "Notes", noteId);

    await deleteDoc(noteRef);
};

// ==============================
// IMGBB
// ==============================

export const atualizarImagemCard = async(id: string, iconeUrl: string) => {
    const cardRef = doc(db, 'Cards', id);
    await updateDoc(cardRef, {iconeUrl});
};

export const atualizarImagemNote = async(id: string, imagemUrl: string) => {
    const noteRef = doc(db, 'Notes', id);
    await updateDoc(noteRef, {imagemUrl});
};