import react, {useState, useEffect, use} from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native';

import { startDB, createCard, getCards, updateCard, deleteCard,
  createNote, getNotesByCard, updateNote, deleteNote} from "./src/db";

type Card = {
  id: number,
  titulo: string,
}

type Note = {
  id: number,
  descricao: string,
  cardId: number,
}

export default function App() {

  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<number|null>(null);
  const [descricao, setDescricao] = useState('');
  const [titulo, setTitulo] = useState('');

  useEffect(()=>{
    async function load(){
      await startDB();

      const data = await getCards();
      setCards(data);
    }

    load()
  }, []);

  async function handleNote(cardId: number){
    setSelectedCardId(cardId);
    setDescricao('');
  }

  async function handleSaveNote(){
    if(!descricao.trim() || selectedCardId === null){
      return;
    }

    await createNote(selectedCardId, descricao);

    setDescricao('');
    setSelectedCardId(null);
  }

  return(
    <View style={styles.container}>
      <Text style={styles.title}>Meus Cards</Text>

      <FlatList
        data={cards}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({item}) => (
          <TouchableOpacity style={styles.card}
          onPress={() => handleNote(item.id)}>
            <Text style={styles.cardTitle}>
              {item.titulo}
            </Text>
          </TouchableOpacity>
          )}
        />

        {selectedCardId !== null && (
          <View style={styles.noteContainer}>
            <Text style={styles.noteTitle}>
              Nova Nota
            </Text>

            <TextInput style={styles.textArea}
            placeholder="Digite sua nota..."
            placeholderTextColor="#999"
            value={descricao}
            onChangeText={setDescricao}
            multiline
            textAlignVertical="top"/>

            <TouchableOpacity style={styles.button}
            onPress={handleSaveNote}>
              <Text style={styles.buttonText}>
                Salvar Nota
              </Text>
            </TouchableOpacity>
            </View>
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },

  noteContainer: {
    marginTop: 20,
  },

  noteTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  textArea: {
    height: 150,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
  },

  button: {
    marginTop: 10,
    backgroundColor: '#4F46E5',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});