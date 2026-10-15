import React, { useState } from "react";
import {
    View, Text, TextInput, TouchableOpacity, Pressable, StyleSheet, ActivityIndicator,
    Alert, KeyboardAvoidingView, Platform, ScrollView, Modal
} from 'react-native'

import { Ionicons } from "@expo/vector-icons";


export default function Login() {

    const [registerVisible, setRegisterVisible] = useState(false);
    const [recoverVisible, setRecoverVisible] = useState(false);

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Cabeçalho */}
                    <View style={styles.header}>
                        <View style={styles.logo}>
                            <Ionicons name="lock-closed-outline" size={32} color="#FFFFFF" />
                        </View>

                        <Text style={styles.title}>Bem-vindo de volta</Text>

                        <Text style={styles.subtitle}>
                            Entre na sua conta para continuar.
                        </Text>
                    </View>

                    {/* Card de login */}
                    <View style={styles.card}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>E-mail</Text>

                            <View style={styles.inputContainer}>
                                <Ionicons
                                    name="mail-outline"
                                    size={20}
                                    color="#94A3B8"
                                />

                                <TextInput
                                    placeholder="voce@exemplo.com"
                                    placeholderTextColor="#64748B"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    autoComplete="email"
                                    textContentType="emailAddress"
                                    style={styles.input}
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <View style={styles.passwordHeader}>
                                <Text style={styles.label}>Senha</Text>

                                <Pressable onPress={() => setRecoverVisible(true)}>
                                    <Text style={styles.link}>Esqueceu a senha?</Text>
                                </Pressable>
                            </View>

                            <View style={styles.inputContainer}>
                                <Ionicons
                                    name="lock-closed-outline"
                                    size={20}
                                    color="#94A3B8"
                                />

                                <TextInput
                                    placeholder="Digite sua senha"
                                    placeholderTextColor="#64748B"
                                    secureTextEntry
                                    autoComplete="current-password"
                                    textContentType="password"
                                    style={styles.input}
                                />
                            </View>
                        </View>

                        <Pressable
                            onPress={() => { }}
                            style={({ pressed }) => [
                                styles.primaryButton,
                                pressed && styles.buttonPressed,
                            ]}
                        >
                            <Text style={styles.primaryButtonText}>Entrar na minha conta</Text>
                            <Ionicons name="arrow-forward" size={19} color="#FFFFFF" />
                        </Pressable>

                        <View style={styles.dividerContainer}>
                            <View style={styles.divider} />
                            <Text style={styles.dividerText}>OU</Text>
                            <View style={styles.divider} />
                        </View>

                        <View style={styles.registerContainer}>
                            <Text style={styles.footerText}>Ainda não tem uma conta? </Text>

                            <Pressable onPress={() => setRegisterVisible(true)}>
                                <Text style={styles.link}>Criar conta</Text>
                            </Pressable>
                        </View>
                    </View>

                    <Text style={styles.copyright}>
                        © 2026 · Todos os direitos reservados.
                    </Text>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Modal de cadastro */}
            <Modal
                visible={registerVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setRegisterVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : undefined}
                        style={styles.modalKeyboard}
                    >
                        <View style={styles.modalCard}>
                            <Pressable
                                onPress={() => setRegisterVisible(false)}
                                style={styles.closeButton}
                                hitSlop={10}
                            >
                                <Ionicons name="close" size={24} color="#94A3B8" />
                            </Pressable>

                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                keyboardShouldPersistTaps="handled"
                            >
                                <View style={styles.modalIcon}>
                                    <Ionicons
                                        name="person-add-outline"
                                        size={25}
                                        color="#A78BFA"
                                    />
                                </View>

                                <Text style={styles.modalTitle}>Criar uma conta</Text>

                                <Text style={styles.modalSubtitle}>
                                    Preencha seus dados para começar.
                                </Text>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Nome completo</Text>

                                    <View style={styles.inputContainer}>
                                        <Ionicons
                                            name="person-outline"
                                            size={20}
                                            color="#94A3B8"
                                        />

                                        <TextInput
                                            placeholder="Seu nome"
                                            placeholderTextColor="#64748B"
                                            autoComplete="name"
                                            style={styles.input}
                                        />
                                    </View>
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>E-mail</Text>

                                    <View style={styles.inputContainer}>
                                        <Ionicons
                                            name="mail-outline"
                                            size={20}
                                            color="#94A3B8"
                                        />

                                        <TextInput
                                            placeholder="voce@exemplo.com"
                                            placeholderTextColor="#64748B"
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            autoComplete="email"
                                            style={styles.input}
                                        />
                                    </View>
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Senha</Text>

                                    <View style={styles.inputContainer}>
                                        <Ionicons
                                            name="lock-closed-outline"
                                            size={20}
                                            color="#94A3B8"
                                        />

                                        <TextInput
                                            placeholder="Crie uma senha"
                                            placeholderTextColor="#64748B"
                                            secureTextEntry
                                            autoComplete="new-password"
                                            style={styles.input}
                                        />
                                    </View>
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Confirmar senha</Text>

                                    <View style={styles.inputContainer}>
                                        <Ionicons
                                            name="shield-checkmark-outline"
                                            size={20}
                                            color="#94A3B8"
                                        />

                                        <TextInput
                                            placeholder="Digite a senha novamente"
                                            placeholderTextColor="#64748B"
                                            secureTextEntry
                                            autoComplete="new-password"
                                            style={styles.input}
                                        />
                                    </View>
                                </View>

                                <Pressable
                                    onPress={() => { }}
                                    style={({ pressed }) => [
                                        styles.primaryButton,
                                        pressed && styles.buttonPressed,
                                    ]}
                                >
                                    <Text style={styles.primaryButtonText}>
                                        Criar minha conta
                                    </Text>
                                </Pressable>

                                <View style={styles.modalFooter}>
                                    <Text style={styles.footerText}>Já tem uma conta? </Text>

                                    <Pressable onPress={() => setRegisterVisible(false)}>
                                        <Text style={styles.link}>Fazer login</Text>
                                    </Pressable>
                                </View>
                            </ScrollView>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </Modal>

            {/* Modal de recuperação de senha */}
            <Modal
                visible={recoverVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setRecoverVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : undefined}
                        style={styles.modalKeyboard}
                    >
                        <View style={styles.modalCard}>
                            <Pressable
                                onPress={() => setRecoverVisible(false)}
                                style={styles.closeButton}
                                hitSlop={10}
                            >
                                <Ionicons name="close" size={24} color="#94A3B8" />
                            </Pressable>

                            <View style={styles.modalIcon}>
                                <Ionicons
                                    name="mail-unread-outline"
                                    size={25}
                                    color="#A78BFA"
                                />
                            </View>

                            <Text style={styles.modalTitle}>Recuperar senha</Text>

                            <Text style={styles.modalSubtitle}>
                                Informe o e-mail associado à sua conta para recuperar seu acesso.
                            </Text>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>E-mail cadastrado</Text>

                                <View style={styles.inputContainer}>
                                    <Ionicons
                                        name="mail-outline"
                                        size={20}
                                        color="#94A3B8"
                                    />

                                    <TextInput
                                        placeholder="voce@exemplo.com"
                                        placeholderTextColor="#64748B"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        autoComplete="email"
                                        style={styles.input}
                                    />
                                </View>
                            </View>

                            <Pressable
                                onPress={() => { }}
                                style={({ pressed }) => [
                                    styles.primaryButton,
                                    pressed && styles.buttonPressed,
                                ]}
                            >
                                <Text style={styles.primaryButtonText}>Recuperar acesso</Text>
                                <Ionicons name="arrow-forward" size={19} color="#FFFFFF" />
                            </Pressable>

                            <Pressable
                                onPress={() => setRecoverVisible(false)}
                                style={styles.backButton}
                            >
                                <Ionicons name="arrow-back" size={17} color="#94A3B8" />
                                <Text style={styles.backButtonText}>Voltar para o login</Text>
                            </Pressable>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#020617",
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    header: {
        alignItems: "center",
        marginBottom: 32,
    },
    logo: {
        width: 64,
        height: 64,
        borderRadius: 20,
        backgroundColor: "#4F46E5",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 24,
    },
    title: {
        color: "#FFFFFF",
        fontSize: 28,
        fontWeight: "700",
        textAlign: "center",
        letterSpacing: -0.6,
    },
    subtitle: {
        color: "#94A3B8",
        fontSize: 14,
        marginTop: 10,
        textAlign: "center",
    },
    card: {
        width: "100%",
        maxWidth: 440,
        alignSelf: "center",
        backgroundColor: "#0F172A",
        borderWidth: 1,
        borderColor: "#1E293B",
        borderRadius: 24,
        padding: 24,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        color: "#E2E8F0",
        fontSize: 13,
        fontWeight: "600",
        marginBottom: 9,
    },
    passwordHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 9,
    },
    inputContainer: {
        minHeight: 52,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#020617",
        borderWidth: 1,
        borderColor: "#334155",
        borderRadius: 12,
        paddingHorizontal: 14,
        gap: 10,
    },
    input: {
        flex: 1,
        color: "#FFFFFF",
        fontSize: 14,
        paddingVertical: 14,
    },
    link: {
        color: "#A78BFA",
        fontSize: 12,
        fontWeight: "600",
    },
    primaryButton: {
        minHeight: 52,
        backgroundColor: "#4F46E5",
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        paddingHorizontal: 16,
        marginTop: 4,
    },
    primaryButtonText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "700",
    },
    buttonPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.99 }],
    },
    dividerContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        marginVertical: 26,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: "#1E293B",
    },
    dividerText: {
        color: "#64748B",
        fontSize: 11,
        fontWeight: "600",
    },
    registerContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
    },
    footerText: {
        color: "#94A3B8",
        fontSize: 13,
    },
    copyright: {
        color: "#475569",
        textAlign: "center",
        fontSize: 11,
        marginTop: 24,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.78)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    modalKeyboard: {
        width: "100%",
        maxWidth: 440,
        maxHeight: "90%",
        justifyContent: "center",
    },
    modalCard: {
        backgroundColor: "#0F172A",
        borderRadius: 24,
        borderWidth: 1,
        borderColor: "#334155",
        padding: 24,
        overflow: "hidden",
    },
    closeButton: {
        position: "absolute",
        top: 16,
        right: 16,
        zIndex: 1,
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: "#1E293B",
        alignItems: "center",
        justifyContent: "center",
    },
    modalIcon: {
        width: 50,
        height: 50,
        borderRadius: 15,
        backgroundColor: "rgba(99, 102, 241, 0.15)",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
    },
    modalTitle: {
        color: "#FFFFFF",
        fontSize: 24,
        fontWeight: "700",
        letterSpacing: -0.4,
        marginBottom: 10,
        paddingRight: 24,
    },
    modalSubtitle: {
        color: "#94A3B8",
        fontSize: 13,
        lineHeight: 20,
        marginBottom: 24,
    },
    modalFooter: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        marginTop: 22,
    },
    backButton: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        marginTop: 24,
        paddingVertical: 8,
    },
    backButtonText: {
        color: "#94A3B8",
        fontSize: 13,
        fontWeight: "500",
    },
});