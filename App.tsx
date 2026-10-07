import { useState, useEffect } from "react";
import {
  Text, View, TextInput, TouchableOpacity,
  FlatList, Modal, KeyboardAvoidingView,
  TouchableWithoutFeedback, Alert, ScrollView,
  ImageBackground,
} from 'react-native';

import Animated, {
  FadeIn, FadeOut, ZoomIn, ZoomOut,
  SlideInUp, SlideOutDown,
  SlideInRight,
  SlideOutLeft,
} from 'react-native-reanimated';

import {
  startDB, createCard, getCards, updateCard, deleteCard,
  createNote, getNotesByCard, updateNote, deleteNote, getNoteCount
} from "./src/database";

import { styles } from "./styles";

type Card = {
  id: number,
  titulo: string,
};

type Note = {
  id: number,
  cardId: number,
  titulo: string,
  descricao: string,
};

export default function App() {

  const [cards, setCards] = useState<Card[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [editedCard, setEditedCard] = useState<Card | null>(null);
  const [notaEditandoId, setNotaEditandoId] = useState<number | null>(null);
  const [editandoNota, setEditandoNota] = useState(false);
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

  async function loadNotes(cardId: number) {
    try {
      const data = await getNotesByCard(cardId);
      setNotes(data);
    } catch (error) {
      Alert.alert("Erro", "" + error);
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
    setDescricao('');
    setTitulo('');
    setEditandoNota(false);
    setNotaEditandoId(null);

    await loadNotes(cardId);
    setSelectedCardId(cardId);
  }

  async function handleSaveNote() {
    if (!descricao.trim() || selectedCardId === null || !titulo.trim()) {
      return;
    }

    try {
      if (editandoNota && notaEditandoId !== null) {
        await updateNote(notaEditandoId, descricao, titulo);
        await loadNotes(selectedCardId);

        setDescricao('');
        setTitulo('');
        setEditandoNota(false);
        setNotaEditandoId(null);

        Alert.alert("Sucesso!", "Nota editada");

        return;
      }

      await createNote(selectedCardId, descricao, titulo);

      await loadNotes(selectedCardId);

      setDescricao('');
      setTitulo('');

    } catch (error) {
      Alert.alert("Erro", "" + error);
      console.error("ERRO:", error);
    }
  }

  async function handleDeleteNote(id: number) {
    if (!selectedCardId) {
      return;
    }

    try {
      await deleteNote(id);
      await loadNotes(selectedCardId);
    } catch (error) {
      Alert.alert("Erro", "" + error);
      console.error("Erro: ", error);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="height">
      <ImageBackground
        source={require('./assets/thinkFast.jpg')}
        style={styles.background}
        resizeMode="cover">
        <View style={styles.overlay}>
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
                  </View>
                </View>
              )}
            />

            {/*Notas*/}
            <Modal
              visible={selectedCardId !== null}
              transparent
              animationType="none"
              onRequestClose={() => setSelectedCardId(null)}
            >
              <Animated.View
                entering={FadeIn.duration(200)}
                exiting={FadeOut.duration(150)}
                style={styles.modalOverlay}>

                <TouchableWithoutFeedback onPress={() => setSelectedCardId(null)}>
                  <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', width: '100%' }}>

                    <TouchableWithoutFeedback>
                      <Animated.View
                        entering={ZoomIn.duration(250)}
                        exiting={ZoomOut.duration(180)}
                        style={styles.noteContainer}>

                        <Text style={styles.noteTitle}>
                          Notas
                        </Text>

                        {/* Notas existentes */}
                        <ScrollView style={styles.notesList}
                          contentContainerStyle={styles.notesListContent}
                          showsVerticalScrollIndicator={true}>
                          {notes.map((note) => (
                            <View key={note.id} style={styles.noteItem}>
                              <Text style={styles.noteTitle}>
                                {note.titulo}
                              </Text>
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
                                onPress={() => {
                                  setEditandoNota(true)
                                  setNotaEditandoId(note.id);
                                  setDescricao(note.descricao)
                                  setTitulo(note.titulo)
                                }}
                              >
                                <Text style={styles.updateNoteButtonText}>
                                  Editar
                                </Text>
                              </TouchableOpacity>
                            </View>
                          ))}
                        </ScrollView>

                        {/* Nova nota */}
                        <TextInput
                          style={styles.noteTitleInput}
                          placeholder="Titulo para a Nota"
                          placeholderTextColor="#999"
                          value={titulo}
                          onChangeText={setTitulo}
                        />

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
                            {editandoNota ? "Salvar Edição" : "Salvar Nota"}
                          </Text>
                        </TouchableOpacity>

                      </Animated.View>
                    </TouchableWithoutFeedback>
                  </View>
                </TouchableWithoutFeedback>
              </Animated.View>
            </Modal>

            {/*Criar Card*/}
            <Modal
              visible={modalNewCard}
              transparent
              animationType="none"
              onRequestClose={() => setModalNewCard(false)}
            >
              <View style={styles.modalOverlay}>

                <Animated.View
                  entering={SlideInUp.duration(300).damping(80)}
                  exiting={SlideOutDown.duration(200)}
                  style={styles.modalContainer}>
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
                </Animated.View>
              </View>
            </Modal>

            {/*Opções de longPress*/}
            <Modal
              visible={modalOptions}
              transparent
              animationType="none"
              onRequestClose={() => setModalOptions(false)}
            >
              <View style={styles.modalOverlay}>
                <Animated.View
                  entering={SlideInUp.duration(300)}
                  exiting={SlideOutDown.duration(180)}
                  style={styles.cardOptionsContainer}>
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

                  <TouchableOpacity style={styles.optionButton} onPress={async () => {
                    if (!editedCard) {
                      return;
                    }

                    await handleDeleteCard(editedCard.id);

                    setModalOptions(false);
                    setEditedCard(null);
                  }}>
                    <Text style={styles.optionButtonText}>
                      ❌ Excluir
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.cancelOptionButton}
                    onPress={() => setModalOptions(false)}>
                    <Text style={styles.cancelOptionButtonText}>
                      Cancelar
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            </Modal>

            <Modal
              visible={modalEditor}
              transparent
              animationType="none"
              onRequestClose={() => setModalEditor(false)}
            >
              <View style={styles.modalOverlay}>

                <Animated.View
                  entering={SlideInRight.duration(300)}
                  exiting={SlideOutLeft.duration(180)}
                  style={styles.modalContainer}>

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
                </Animated.View>
              </View>
            </Modal>
          </View>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}