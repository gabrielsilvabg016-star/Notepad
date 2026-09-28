import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Modal, Keyboard, KeyboardAvoidingView } from 'react-native';

import {
  startDB, createCard, getCards, updateCard, deleteCard,
  createNote, getNotesByCard, updateNote, deleteNote
} from "./src/db";

type Card = {
  id: number,
  titulo: string,
};

type Note = {
  id: number,
  descricao: string,
  cardId: number,
};

export default function App() {

  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [modalNewCard, setModalNewCard] = useState(false);
  const [descricao, setDescricao] = useState('');
  const [titulo, setTitulo] = useState('');

  useEffect(() => {
    async function load() {
      try {
        await startDB();

        const data = await getCards();
        setCards(data);
      } catch (error) {
        console.error("Erro:", error);
      }
    }

    load()
  }, []);

  function handleNote(cardId: number) {
    setSelectedCardId(cardId);
    setDescricao('');
  }

  async function handleSaveNote() {
    if (!descricao.trim() || selectedCardId === null) {
      return;
    }

    await createNote(selectedCardId, descricao);

    setDescricao('');
    setSelectedCardId(null);
  }

  async function handleCreateCard() {
    if (!titulo.trim()) {
      return;
    }

    try {
      await createCard(titulo);

      const data = await getCards();

      setCards(data);
      setTitulo('');
      setModalNewCard(false);

    } catch (error) {
      console.error("Erro: ", error);
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
              textAlignVertical="top" />

            <TouchableOpacity style={styles.button}
              onPress={handleSaveNote}>
              <Text style={styles.buttonText}>
                Salvar Nota
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <Modal
          visible={modalNewCard}
          transparent
          animationType="fade"
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

  noteContainer: {
    backgroundColor: '#FFFFFF',
    marginTop: 15,
    padding: 18,
    borderRadius: 16,

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
});