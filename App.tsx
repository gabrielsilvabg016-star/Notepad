import { useState, useEffect } from "react";

import {
  ActivityIndicator, Image, Text, View, TextInput, TouchableOpacity,
  FlatList, Modal, KeyboardAvoidingView,
  TouchableWithoutFeedback, Alert, ScrollView,
  ImageBackground,
} from 'react-native';

import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import * as ImagePicker from "expo-image-picker";

import Animated, {
  FadeIn, FadeOut, ZoomIn, ZoomOut,
  SlideInUp, SlideOutDown,
  SlideInRight,
  SlideOutLeft,
} from 'react-native-reanimated';

import { AuthScreen } from "./src/components/AuthScreen";
import { CardIconPicker } from "./src/components/CardIconPicker";

import { styles } from "./styles";
import { auth } from "./src/services/firebase";
import { enviarImagemImgBB } from "./src/services/imgbb";

import { observarCards, criarCards, criarNotes,
  atualizarCards, atualizarNotes, excluirNotes, excluirCards,
  observarNotesPorCard, type CardIcon,
  atualizarImagemNote
 } from "./src/database/firestore";

type Card = {
  id: string,
  titulo: string,
  icon: CardIcon,
};

type Note = {
  id: string,
  card_id: string,
  titulo: string,
  descricao: string,
  imagemUrl?: string,
  data: Date | null,
};

const cardIconGlyphs: Record<CardIcon, string> = {
  star: "⭐",
  checklist: "✅",
  calendar: "📅",
};

function formatDateInput(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);

  if (digits.length > 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
  }

  if (digits.length > 2) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }

  return digits;
}

function formatDateForInput(date: Date | null) {
  if (!date) {
    return "";
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).padStart(4, "0");

  return `${day}/${month}/${year}`;
}

function parseNoteDate(value: string): Date | null | undefined {
  if (!value.trim()) {
    return null;
  }

  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) {
    return undefined;
  }

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  if (year < 1) {
    return undefined;
  }

  const date = new Date(0);
  date.setFullYear(year, month - 1, day);
  date.setHours(0, 0, 0, 0);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return undefined;
  }

  return date;
}

export default function App() {

  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [cards, setCards] = useState<Card[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [editedCard, setEditedCard] = useState<Card | null>(null);
  const [notaEditandoId, setNotaEditandoId] = useState<string | null>(null);
  const [editandoNota, setEditandoNota] = useState(false);
  const [modalNewCard, setModalNewCard] = useState(false);
  const [modalOptions, setModalOptions] = useState(false);
  const [modalEditor, setModalEditor] = useState(false);
  const [descricao, setDescricao] = useState('');
  const [titulo, setTitulo] = useState('');
  const [dataNota, setDataNota] = useState('');
  const [selectedCardIcon, setSelectedCardIcon] = useState<CardIcon | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (authenticatedUser) => {
      setUser(authenticatedUser);
      setIsAuthLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!user) {
      setCards([]);
      setNotes([]);
      return;
    }

    setCards([]);
    return observarCards(user.uid, setCards);
  }, [user]);

  useEffect(() => {
    if (!user || !selectedCardId) {
      setNotes([]);
      return;
    }

    return observarNotesPorCard(user.uid, selectedCardId, setNotes);
  }, [user, selectedCardId]);

  if (isAuthLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#8B6F47" />
      </View>
    );
  }

  if (!user) {
    return (
      <ImageBackground
        source={require("./assets/bg-crystal.png")}
        style={styles.background}
        resizeMode="cover"
        imageStyle={styles.image}
      >
        <View style={styles.overlay}>
          <AuthScreen />
        </View>
      </ImageBackground>
    );
  }

  function handleLongPress(card: Card) {
    setEditedCard(card);
    setModalOptions(true);
  }

  async function handleCreateCard() {
    if (!user || !titulo.trim() || !selectedCardIcon) {
      if (!selectedCardIcon) {
        Alert.alert("Ícone obrigatório", "Escolha um ícone para o card.");
      }
      return;
    }

    try {
      await criarCards(titulo, user.uid, selectedCardIcon);
      setTitulo('');
      setSelectedCardIcon(null);
      setModalNewCard(false);

    } catch (error) {
      Alert.alert("Erro", "Não foi possível criar o card. Tente novamente.");
      console.error("Erro ao criar card:", error);
    }
  }

  async function handleDeleteCard(id: string) {
    try {
      await excluirCards(id);
      Alert.alert("Sucesso!", "Card deletado do banco de dados.");
    } catch (error) {
      Alert.alert("ERRO", "" + error);
      console.error("Erro: ", error);
    }
  }

  async function handleUpdateCard(id: string, titulo: string) {
    if (titulo.trim() === "") {
      Alert.alert("Erro", "O titulo não pode estar vazio");
      return;
    }

    try {
      await atualizarCards(id, titulo);
      setTitulo("");
    } catch (error) {
      Alert.alert("ERRO:", "" + error);
      console.error("ERRO: ", error);
    }
  }

  async function handleNote(cardId: string) {
    setDescricao('');
    setTitulo('');
    setDataNota('');
    setEditandoNota(false);
    setNotaEditandoId(null);

    setSelectedCardId(cardId);
  }

  async function handlePickNoteImage( noteId: string) {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [8, 9],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled) {
        const image = result.assets[0];
        if (!image.base64) {
          Alert.alert("Erro", "Não foi possível carregar a imagem selecionada.");
          console.log("Erro ao carregar a imagem");
          return;
        }
        
        const imageUrl = await enviarImagemImgBB(image.base64);

        await atualizarImagemNote(noteId, imageUrl);
        Alert.alert("Imagem atualizada");
      }
      return;
    } catch (error) {
      Alert.alert("Erro", "Não foi possível abrir a galeria.");
      console.error("Erro ao selecionar imagem:", error);
    }
  }

  async function handleSaveNote() {
    if (
      !user ||
      !descricao.trim() ||
      selectedCardId === null ||
      !titulo.trim()
    ) {
      return;
    }

    const noteDate = parseNoteDate(dataNota);
    if (noteDate === undefined) {
      Alert.alert(
        "Data inválida",
        "Digite uma data válida no formato dd/mm/aaaa.",
      );
      return;
    }

    try {
      if (editandoNota && notaEditandoId !== null) {
        await atualizarNotes(notaEditandoId, {
          descricao,
          titulo,
          data: noteDate,
        });
        setDescricao('');
        setTitulo('');
        setDataNota('');
        setEditandoNota(false);
        setNotaEditandoId(null);

        Alert.alert("Sucesso!", "Nota editada");

        return;
      }

      await criarNotes(user.uid, selectedCardId, titulo, descricao, noteDate);

      setDescricao('');
      setTitulo('');
      setDataNota('');

    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar a nota ou sua imagem.");
      console.error("ERRO:", error);
    }
  }

  async function handleDeleteNote(id: string) {
    if (!selectedCardId) {
      return;
    }

    try {
      await excluirNotes(id);
    } catch (error) {
      Alert.alert("Erro", "" + error);
      console.error("Erro: ", error);
    }
  }

  async function handleSignOut() {
    try {
      await signOut(auth);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível sair da conta. Tente novamente.");
      console.error("Erro ao sair:", error);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="height">
      <ImageBackground
        source={require('./assets/bg-crystal.png')}
        style={styles.background}
        resizeMode="cover"
        imageStyle={styles.image}>
        <View style={styles.overlay}>
          <View style={styles.container}>
            <Text style={styles.title}>NotePad</Text>
            <View style={styles.headerRow}>
              <Text style={styles.userEmail} numberOfLines={1}>
                {user.email ?? "E-mail não disponível"}
              </Text>
              <TouchableOpacity
                style={styles.signOutButton}
                onPress={handleSignOut}
                accessibilityRole="button"
                accessibilityLabel="Sair da conta"
              >
                <Text style={styles.signOutText}>Sair</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                setSelectedCardIcon(null);
                setModalNewCard(true);
              }}
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
                      <View style={styles.cardIconContainer}>
                        <Text style={styles.cardIcon}>
                          {cardIconGlyphs[item.icon ?? "star"]}
                        </Text>
                      </View>
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

                            {/*imagem*/}
                                <View style={styles.noteImagePlaceholder}>
                                  <TouchableOpacity
                                  style={styles.imagePickerButton}
                                  onPress={() => handlePickNoteImage(note.id)}
                                  accessibilityRole="button"
                                  accessibilityLabel="Selecionar imagem da galeria para a nota"
                                  >
                                    {note.imagemUrl ? (
                                      <Image
                                        source={{ uri: note.imagemUrl }}
                                        style={styles.selectedNoteImage}
                                      />
                                    ) : (
                                      <>
                                        <Text style={styles.noteImageGlyph}>▧</Text>
                                        <Text style={styles.noteImageLabel}>Sem imagem</Text>
                                      </>
                                    )}
                                  </TouchableOpacity>
                                </View>
                              
                              <View style={styles.noteRow}>
                                <View style={styles.noteContent}>
                                  <Text style={styles.noteTitle}>{note.titulo}</Text>
                                  {note.data ? (
                                    <Text style={styles.noteDate}>
                                      Data: {formatDateForInput(note.data)}
                                    </Text>
                                  ) : null}
                                  <Text style={styles.noteText}>{note.descricao}</Text>
                                  <View style={styles.noteActions}>
                                    <TouchableOpacity
                                      style={styles.deleteNoteButton}
                                      onPress={() => { handleDeleteNote(note.id) }}
                                    >
                                      <Text style={styles.deleteNoteButtonText}>Excluir</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                      style={styles.updateNoteButton}
                                      onPress={() => {
                                        setEditandoNota(true);
                                        setNotaEditandoId(note.id);
                                        setDescricao(note.descricao);
                                        setTitulo(note.titulo);
                                        setDataNota(formatDateForInput(note.data));
                                        
                                      }}
                                    >
                                      <Text style={styles.updateNoteButtonText}>Editar</Text>
                                    </TouchableOpacity>

                                    {/*Gemini aqui*/}
                                    <TouchableOpacity
                                      style={styles.updateNoteButton}
                                      disabled
                                      accessibilityRole="button"
                                      accessibilityLabel="Calendario I.A"
                                    >
                                      <Text style={styles.updateNoteButtonText}>
                                        Calendario I.A
                                      </Text>
                                    </TouchableOpacity>


                                  </View>
                                </View>
                              </View>
                            </View>
                          ))}
                        </ScrollView>

                        {/* Nova nota */}
                        <View style={styles.noteComposerRow}>
                          <View style={styles.noteComposerFields}>
                            <TextInput
                              style={[styles.noteTitleInput]}
                              placeholder="Titulo para a Nota"
                              placeholderTextColor="#999"
                              value={titulo}
                              onChangeText={setTitulo}
                            />
                            <TextInput
                              style={[styles.noteTitleInput]}
                              placeholder="Data (dd/mm/aaaa)"
                              placeholderTextColor="#999"
                              value={dataNota}
                              onChangeText={(value) => setDataNota(formatDateInput(value))}
                              keyboardType="numeric"
                              maxLength={10}
                              accessibilityLabel="Data, dia, mês e ano"
                            />
                            <TextInput
                              style={[styles.textArea, styles.textAreaInRow]}
                              placeholder="Digite sua nota..."
                              placeholderTextColor="#999"
                              value={descricao}
                              onChangeText={setDescricao}
                              multiline
                              textAlignVertical="top"
                            />
                          </View>
                        </View>

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
              onRequestClose={() => {
                setModalNewCard(false);
                setSelectedCardIcon(null);
              }}
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

                  <Text style={styles.inputLabel}>Ícone do card</Text>
                  <CardIconPicker
                    selectedIcon={selectedCardIcon}
                    onSelect={setSelectedCardIcon}
                  />

                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => {
                        setModalNewCard(false);
                        setSelectedCardIcon(null);
                      }}
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