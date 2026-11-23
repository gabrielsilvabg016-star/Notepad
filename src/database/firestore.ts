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
    getDocs
 } from "firebase/firestore";

 //cada card pode ter uma imagem
 export type Card = {
    id: string;
    titulo: string;
    imagemUrl?: string;
 }

//cada note pode ter um icone já pre definido,
//utilizado pela I.A para saber oque botar no calendario
 export type Note = {
    id: string;
    card_id: string;
    titulo: string;
    descricao: string;
    data: Date;
    iconeUrl?: string;
 }

 const cardCollectionRef = collection(db, 'Cards');
 const noteCollectionRef = collection(db, 'Notes');

 export const criarCards = async(
    titulo: string,
    userId: string
 ) => {
    await addDoc(cardCollectionRef,{
        titulo: titulo,
        userId: userId,
        imagemUrl: ''
    });
 };

 export const observarCards = (
    userId: string,
    callback: (cards: Card[]) => void) => {

        const q = query(cardCollectionRef,
            where('userId', '==', userId));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const listaCards: Card[] = snapshot.docs.map((documento) => ({
                id: documento.id,
                titulo:documento.data().titulo,
                imagemUrl: documento.data().imagemUrl || ''
            }));
            callback(listaCards);
        });
        return unsubscribe;
    }

export const observarNotes = (
    userId: string,
    callback: (notes: Note[]) => void
) => {
    const q = query(
        noteCollectionRef,
        where('userId', '==', userId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const listaNotes: Note[] = snapshot.docs.map((documento) => ({
            id: documento.id,
            card_id: documento.data().card_id,
            titulo: documento.data().titulo,
            descricao: documento.data().descricao,
            data: documento.data().data,
            iconeUrl: documento.data().iconeUrl || ''
        }));
        callback(listaNotes);
    });
    return unsubscribe;
};