import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111827',
        paddingHorizontal: 16,
        paddingTop: 48,
    },

    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#F3E7C3',
        marginBottom: 20,
        letterSpacing: 0.5,

        textShadowColor: '#000000',
        textShadowOffset: {
            width: 0,
            height: 2,
        },
        textShadowRadius: 4,
    },

    addButton: {
        backgroundColor: '#26384D',
        paddingVertical: 14,
        paddingHorizontal: 18,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 18,

        borderWidth: 1,
        borderColor: '#8D7957',

        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.35,
        shadowRadius: 5,
        elevation: 4,
    },

    addButtonText: {
        color: '#E8D7AA',
        fontSize: 15,
        fontWeight: '700',
        letterSpacing: 0.8,
    },

    card: {
        backgroundColor: '#1B2736',
        padding: 17,
        borderRadius: 5,
        marginBottom: 12,

        borderWidth: 1,
        borderColor: '#35465A',

        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.35,
        shadowRadius: 6,
        elevation: 4,
    },

    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#E9EDF2',
        letterSpacing: 0.3,
    },

    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    cardContent: {
        flex: 1,
        paddingRight: 10,
    },

    deleteButton: {
        backgroundColor: '#302126',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 4,
        marginLeft: 12,

        borderWidth: 1,
        borderColor: '#74464B',
    },

    deleteButtonText: {
        color: '#D98B8B',
        fontSize: 13,
        fontWeight: '700',
    },

    noteContainer: {
        backgroundColor: '#182333',
        marginTop: 15,
        padding: 18,
        borderRadius: 5,
        width: '94%',

        borderWidth: 1,
        borderColor: '#3A4B60',

        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 5,
    },

    noteTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#F0E2BD',
        marginBottom: 13,
        letterSpacing: 0.4,
    },

    noteTitleInput: {
        height: 48,
        backgroundColor: '#101923',
        borderWidth: 1,
        borderColor: '#465A70',
        borderRadius: 4,
        paddingHorizontal: 13,
        fontSize: 15,
        color: '#E9EDF2',
        marginBottom: 12,
    },

    textArea: {
        height: 150,
        backgroundColor: '#101923',
        borderWidth: 1,
        borderColor: '#465A70',
        borderRadius: 4,
        padding: 14,
        fontSize: 15,
        color: '#E9EDF2',

        textAlignVertical: 'top',
    },

    button: {
        marginTop: 13,
        backgroundColor: '#536F8C',
        paddingVertical: 14,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',

        borderWidth: 1,
        borderColor: '#7890AA',

        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 4,
    },

    buttonText: {
        color: '#F4E9CB',
        fontSize: 15,
        fontWeight: '700',
        letterSpacing: 0.5,
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(4, 9, 16, 0.78)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },

    modalContainer: {
        width: '100%',
        backgroundColor: '#182333',
        borderRadius: 6,
        padding: 21,

        borderWidth: 1,
        borderColor: '#7B6B4E',

        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.5,
        shadowRadius: 12,
        elevation: 10,
    },

    modalTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#F0E2BD',
        marginBottom: 20,
        letterSpacing: 0.4,
    },

    inputLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#B8C5D4',
        marginBottom: 7,
        letterSpacing: 0.3,
    },

    input: {
        height: 49,
        backgroundColor: '#101923',
        borderWidth: 1,
        borderColor: '#465A70',
        borderRadius: 4,
        paddingHorizontal: 14,
        fontSize: 15,
        color: '#E9EDF2',
        marginBottom: 18,
    },

    modalButtons: {
        flexDirection: 'row',
        gap: 10,
    },

    cancelButton: {
        flex: 1,
        backgroundColor: '#202B38',
        paddingVertical: 13,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',

        borderWidth: 1,
        borderColor: '#465363',
    },

    cancelButtonText: {
        color: '#AEB9C6',
        fontSize: 15,
        fontWeight: '700',
    },

    createButton: {
        flex: 1,
        backgroundColor: '#536F8C',
        paddingVertical: 13,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',

        borderWidth: 1,
        borderColor: '#7890AA',

        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },

    createButtonText: {
        color: '#F4E9CB',
        fontSize: 15,
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
        backgroundColor: '#101923',
        borderWidth: 1,
        borderColor: '#35465A',
        borderRadius: 4,
        padding: 13,
        marginBottom: 9,
    },

    noteText: {
        fontSize: 14,
        lineHeight: 21,
        color: '#C7D0DA',
        marginBottom: 10,
    },

    deleteNoteButton: {
        alignSelf: 'flex-end',
        backgroundColor: '#302126',
        paddingVertical: 7,
        paddingHorizontal: 11,
        borderRadius: 4,

        borderWidth: 1,
        borderColor: '#74464B',
    },

    deleteNoteButtonText: {
        color: '#D98B8B',
        fontSize: 12,
        fontWeight: '700',
    },

    updateNoteButton: {
        alignSelf: 'flex-end',
        backgroundColor: '#1D3440',
        paddingVertical: 7,
        paddingHorizontal: 11,
        borderRadius: 4,

        borderWidth: 1,
        borderColor: '#4C8295',
    },

    updateNoteButtonText: {
        color: '#8FC6D4',
        fontSize: 12,
        fontWeight: '700',
    },

    cardOptionsContainer: {
        width: '88%',
        backgroundColor: '#182333',
        borderRadius: 6,
        padding: 21,

        borderWidth: 1,
        borderColor: '#7B6B4E',

        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.5,
        shadowRadius: 12,
        elevation: 8,
    },

    cardOptionsTitle: {
        fontSize: 19,
        fontWeight: '700',
        color: '#F0E2BD',
        marginBottom: 18,
        letterSpacing: 0.4,
    },

    optionButton: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#35465A',
    },

    optionButtonText: {
        fontSize: 15,
        color: '#D5DDE5',
        fontWeight: '600',
    },

    cancelOptionButton: {
        marginTop: 14,
        paddingVertical: 12,
        alignItems: 'center',
    },

    cancelOptionButtonText: {
        fontSize: 15,
        color: '#8793A0',
        fontWeight: '600',
    },
});

