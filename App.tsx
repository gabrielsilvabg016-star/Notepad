import React, { useState, useEffect } from "react";
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  FlatList, Modal, KeyboardAvoidingView,
  Pressable, TouchableWithoutFeedback, Alert
} from 'react-native';

import {
  startDB, createCard, getCards, updateCard, deleteCard,
  createNote, getNotesByCard, updateNote, deleteNote, getNoteCount
} from "./src/database";

type Card = {
  id: number,
  titulo: string,
};

type Note = {
  id: number,
  cardId: number,
  descricao: string,
};

export default function App() {

  const [cards, setCards] = useState<Card[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [editedCard, setEditedCard] = useState<Card | null>(null);
  const [modalNewCard, setModalNewCard] = useState(false);
  const [modalOptions, setModalOptions] = useState(false);
  const [modalEditor, setModalEditor] = useState(false);
  const [descricao, setDescricao] = useState('');
  const [titulo, setTitulo] = useState('');

  useEffect(() => {
    async function load() {
      try {
        await startDB();
        await loadCards();
      } catch (error) {
        console.error("Erro:", error);
      }
    }

    load()
  }, []);

  function handleLongPress(card: Card) {
    setEditedCard(card);
    setModalOptions(true);
  }

  async function loadCards() {
    try {

      const data = await getCards();
      setCards(data);
    } catch (error) {
      Alert.alert("Erro", "" + error);
      console.error("ERRO:", error);
    }
  }

  async function loadNotes(cardId: number){
    try{
      const data = await getNotesByCard(cardId);
      setNotes(data);
    }catch(error){
      Alert.alert("Erro", ""+error);
      console.error("ERRO: ", error);
    }
  }

  async function handleCreateCard() {
    if (!titulo.trim()) {
      return;
    }

    try {
      await createCard(titulo);
      await loadCards();

      setTitulo('');
      setModalNewCard(false);

    } catch (error) {
      console.error("Erro: ", error);
    }
  }

  async function handleDeleteCard(id: number) {
    try {
      const counter = await getNoteCount(id);

      if (counter > 0) {
        Alert.alert("AVISO!", "Para deletar um card delete as notas anexadas a ele.");
        return;
      }

      await deleteCard(id);
      await loadCards();
      Alert.alert("Sucesso!", "Card deletado do banco de dados.");
    } catch (error) {
      Alert.alert("ERRO", "" + error);
      console.error("Erro: ", error);
    }
  }

  async function handleUpdateCard(id: number, titulo: string) {
    if (titulo.trim() === "") {
      Alert.alert("Erro", "O titulo não pode estar vazio");
      return;
    }

    try {
      await updateCard(id, titulo);
      setTitulo("");
      await loadCards();
    } catch (error) {
      Alert.alert("ERRO:", "" + error);
      console.error("ERRO: ", error);
    }
  }

  async function handleNote(cardId: number) {
    setSelectedCardId(cardId);
    setDescricao('');

    await loadNotes(cardId);
  }

  async function handleSaveNote() {
    if (!descricao.trim() || selectedCardId === null) {
      return;
    }

    try{
      await createNote(selectedCardId, descricao);

      await loadNotes(selectedCardId);

      setDescricao('');
      
    }catch(error){
      Alert.alert("Erro", ""+error);
      console.error("ERRO:", error);
    }
  }

  async function handleDeleteNote(id: number) {
    if(!selectedCardId){
      return;
    }

    try {
      await deleteNote(id);
      await loadNotes(selectedCardId);

      Alert.alert("Sucesso!", "Nota deletada do banco de dados.");
    } catch (error) {
      Alert.alert("Erro", "" + error);
      console.error("Erro: ", error);
    }
  }

  async function handleUpdateNote(id: number, descricao: string) {
    if(!selectedCardId){
      return;
    }

    try{
      await updateNote(id, descricao);
      await loadNotes(selectedCardId);
      setDescricao("");
      Alert.alert("Sucesso!", "Nota editada");
    }catch(error){
      Alert.alert("Erro", ""+error);
      console.error("ERRO: ", error);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="height">
      <View style={styles.container}>
        <Text style={styles.title}>NotePad</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalNewCard(true)}
        >
          <Text style={styles.addButtonText}>+ Novo Card</Text>
        </TouchableOpacity>

        <FlatList
          data={cards}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardRow}>
                <TouchableOpacity style={styles.cardContent}
                  onPress={() => handleNote(item.id)}
                  onLongPress={() => handleLongPress(item)}
                  delayLongPress={500}>
                  <Text style={styles.cardTitle}>
                    {item.titulo}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => { handleDeleteCard(item.id) }}>
                  <Text style={styles.deleteButtonText}>❌</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />

        <Modal
          visible={selectedCardId !== null}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectedCardId(null)}
        >
          <TouchableWithoutFeedback onPress={() => setSelectedCardId(null)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.noteContainer}>

                  <Text style={styles.noteTitle}>
                    Notas
                  </Text>

                  {/* Notas existentes */}
                  <View style={styles.notesList}>
                    {notes.map((note) => (
                      <View key={note.id} style={styles.noteItem}>
                        <Text style={styles.noteText}>
                          {note.descricao}
                        </Text>

                        <TouchableOpacity
                          style={styles.deleteNoteButton}
                          onPress={() => { handleDeleteNote(note.id) }}
                        >
                          <Text style={styles.deleteNoteButtonText}>
                            Excluir
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                          style={styles.updateNoteButton}
                          onPress={() => {handleUpdateNote(note.id, note.descricao)}}
                        >
                          <Text style={styles.updateNoteButtonText}>
                            Editar
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>

                  {/* Nova nota */}
                  <TextInput
                    style={styles.textArea}
                    placeholder="Digite sua nota..."
                    placeholderTextColor="#999"
                    value={descricao}
                    onChangeText={setDescricao}
                    multiline
                    textAlignVertical="top"
                  />

                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                      handleSaveNote();
                    }}
                  >
                    <Text style={styles.buttonText}>
                      Salvar Nota
                    </Text>
                  </TouchableOpacity>

                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <Modal
          visible={modalNewCard}
          transparent
          animationType="slide"
          onRequestClose={() => setModalNewCard(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Novo Card</Text>

              <Text style={styles.inputLabel}>Título</Text>

              <TextInput
                style={styles.input}
                placeholder="Dê um título para o card..."
                placeholderTextColor="#9CA3AF"
                value={titulo}
                onChangeText={setTitulo}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setModalNewCard(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.createButton}
                  onPress={handleCreateCard}
                >
                  <Text style={styles.createButtonText}>Criar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          visible={modalOptions}
          transparent
          animationType="fade"
          onRequestClose={() => setModalOptions(false)}
        >
          <Pressable style={styles.cardOptionsContainer}
            onPress={(event) => event.stopPropagation()}
          >
            <Text style={styles.cardOptionsTitle}>
              {editedCard?.titulo}
            </Text>

            <TouchableOpacity style={styles.optionButton}
              onPress={() => {
                if (editedCard) {
                  setTitulo(editedCard.titulo);
                  setModalOptions(false);
                  setModalEditor(true);
                }
              }}
            >
              <Text style={styles.optionButtonText}>
                ✏️ Editar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelOptionButton}
              onPress={() => setModalOptions(false)}>
              <Text style={styles.cancelOptionButtonText}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </Pressable>
        </Modal>

        <Modal
          visible={modalEditor}
          transparent
          animationType="slide"
          onRequestClose={() => setModalEditor(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>

              <Text style={styles.modalTitle}>Editar Card</Text>

              <Text style={styles.inputLabel}>Titulo</Text>

              <TextInput
                style={styles.input}
                placeholder="Digite o novo Titulo..."
                placeholderTextColor="#9CA3AF"
                value={titulo}
                onChangeText={setTitulo}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.cancelButton}
                  onPress={() => setModalEditor(false)}>
                  <Text style={styles.cancelButtonText}>
                    Cancelar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.createButton}
                  onPress={async () => {
                    if (!editedCard) {
                      return;
                    }

                    await handleUpdateCard(editedCard.id, titulo);

                    setModalEditor(false);
                    setEditedCard(null);
                  }}>
                  <Text style={styles.createButtonText}>
                    Salvar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 20,
    paddingTop: 60,
  },

  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 20,
  },

  addButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,

    shadowColor: '#4F46E5',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },

  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },

  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  cardContent: {
    flex: 1,
  },

  deleteButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 12,
  },

  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  noteContainer: {
    backgroundColor: '#FFFFFF',
    marginTop: 15,
    padding: 18,
    borderRadius: 16,
    width: '90%',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },

  noteTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
  },

  textArea: {
    height: 150,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#111827',
  },

  button: {
    marginTop: 12,
    backgroundColor: '#4F46E5',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#4F46E5',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  modalContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 20,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 7,
  },

  input: {
    height: 50,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#111827',
    marginBottom: 20,
  },

  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },

  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  cancelButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '700',
  },

  createButton: {
    flex: 1,
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  notesList: {
    marginBottom: 15,
  },

  noteItem: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },

  noteText: {
    fontSize: 15,
    color: '#374151',
    marginBottom: 10,
  },

  deleteNoteButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#EF4444',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
  },

  deleteNoteButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  updateNoteButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#08d52e',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
  },

  updateNoteButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  cardOptionsContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },

  cardOptionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 20,
  },

  optionButton: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  optionButtonText: {
    fontSize: 16,
    color: "#111827",
  },

  cancelOptionButton: {
    marginTop: 15,
    paddingVertical: 12,
    alignItems: "center",
  },

  cancelOptionButtonText: {
    fontSize: 16,
    color: "#6B7280",
  },
});
