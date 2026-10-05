import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
        maxHeight: 300,
    },
    notesListContent: {
        paddingBottom: 10,
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
