import { useState } from "react";

import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "../services/firebase";
import { styles } from "../../styles";

function getAuthErrorMessage(error: unknown) {
  const code =
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
      ? error.code
      : null;

  switch (code) {
    case "auth/email-already-in-use":
      return "Este e-mail já possui uma conta.";
    case "auth/invalid-email":
      return "Digite um endereço de e-mail válido.";
    case "auth/weak-password":
      return "A senha deve ter pelo menos 6 caracteres.";
    case "auth/invalid-credential":
      return "E-mail ou senha incorretos.";
    case "auth/network-request-failed":
      return "Falha de conexão. Verifique sua internet e tente novamente.";
    default:
      return error instanceof Error
        ? error.message
        : "Não foi possível autenticar. Tente novamente.";
  }
}

export function AuthScreen() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    const normalizedEmail = email.trim();
    if (!normalizedEmail || !password) {
      setErrorMessage("Preencha o e-mail e a senha.");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, normalizedEmail, password);
      } else {
        await signInWithEmailAndPassword(auth, normalizedEmail, password);
      }
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  function toggleMode() {
    setIsRegistering((registering) => !registering);
    setErrorMessage("");
  }

  return (
    <View style={styles.authContainer}>
      <View style={styles.authCard}>
        <Text style={styles.authTitle}>NotePad</Text>
        <Text style={styles.authHeading}>
          {isRegistering ? "Criar conta" : "Entrar"}
        </Text>

        <TextInput
          style={styles.authInput}
          placeholder="E-mail"
          placeholderTextColor="#9CA3AF"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
          accessibilityLabel="E-mail"
        />
        <TextInput
          style={styles.authInput}
          placeholder="Senha"
          placeholderTextColor="#9CA3AF"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoComplete={isRegistering ? "new-password" : "current-password"}
          textContentType={isRegistering ? "newPassword" : "password"}
          accessibilityLabel="Senha"
          onSubmitEditing={handleSubmit}
          returnKeyType="done"
        />

        {errorMessage ? (
          <Text style={styles.authError} accessibilityRole="alert">
            {errorMessage}
          </Text>
        ) : null}

        <TouchableOpacity
          style={[styles.authSubmitButton, isSubmitting && styles.authDisabledButton]}
          onPress={handleSubmit}
          disabled={isSubmitting}
          accessibilityRole="button"
        >
          {isSubmitting ? (
            <ActivityIndicator color="#F4E9CB" />
          ) : (
            <Text style={styles.authSubmitText}>
              {isRegistering ? "Criar conta" : "Entrar"}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.authToggleButton}
          onPress={toggleMode}
          disabled={isSubmitting}
        >
          <Text style={styles.authToggleText}>
            {isRegistering
              ? "Já tem uma conta? Entrar"
              : "Não tem uma conta? Cadastre-se"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
