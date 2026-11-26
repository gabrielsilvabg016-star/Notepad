import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 48,
    },

    background: {
        flex:1,
        width:"100%",
    },

    image:{
        height:"100%",
        width:"100%",
    },

    overlay:{
        flex:1,
        backgroundColor: 'rgba(7, 13, 22, 0.70)',
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

    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    userEmail: {
        color: '#B8C5D4',
        fontSize: 13,
        flex: 1,
        marginRight: 12,
    },

    signOutButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#465363',
        borderRadius: 4,
    },

    signOutText: {
        color: '#B8C5D4',
        fontSize: 13,
        fontWeight: '700',
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

    cardIconContainer: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        borderRadius: 5,
        backgroundColor: '#101923',
        borderWidth: 1,
        borderColor: '#465A70',
    },

    cardIcon: {
        fontSize: 23,
    },

    iconPicker: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 18,
    },

    iconChoice: {
        flex: 1,
        minHeight: 68,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#465363',
        backgroundColor: '#101923',
    },

    iconChoiceSelected: {
        borderColor: '#D5B875',
        backgroundColor: '#26384D',
    },

    iconChoiceGlyph: {
        fontSize: 21,
        marginBottom: 4,
    },

    iconChoiceLabel: {
        color: '#D5DDE5',
        fontSize: 11,
        fontWeight: '600',
    },

    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    cardContent: {
        flex: 1,
        paddingRight: 10,
        flexDirection: 'row',
        alignItems: 'center',
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
        padding: 20,
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
        marginBottom: 16,
        letterSpacing: 0.4,
    },

    noteTypeHint: {
        color: '#9CA3AF',
        fontSize: 12,
        marginTop: -9,
        marginBottom: 12,
    },

    dateInputGroup: {
        marginBottom: 12,
    },

    notesList: {
        marginBottom: 18,
        maxHeight: 300,
    },

    notesListContent: {
        paddingBottom: 12,
    },

    noteItem: {
        backgroundColor: '#101923',
        borderWidth: 1,
        borderColor: '#35465A',
        borderRadius: 4,
        padding: 16,
        marginBottom: 12,
    },

    noteRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },

    noteImagePlaceholder: {
        width: 88,
        height: 88,
        minHeight: 88,
        marginRight: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#60758A',
        backgroundColor: '#182333',
    },

    noteImageGlyph: {
        color: '#B8C5D4',
        fontSize: 20,
        lineHeight: 22,
    },

    noteImageLabel: {
        color: '#9CA3AF',
        fontSize: 10,
    },

    noteContent: {
        flex: 1,
    },

    noteDate: {
        color: '#9CA3AF',
        fontSize: 12,
        marginBottom: 8,
    },

    noteText: {
        fontSize: 14,
        lineHeight: 21,
        color: '#C7D0DA',
        marginBottom: 12,
    },

    checklistItems: {
        marginBottom: 10,
    },

    checklistItem: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 36,
        paddingVertical: 5,
    },

    checklistCheck: {
        color: '#D5DDE5',
        fontSize: 20,
        marginRight: 10,
    },

    checklistItemText: {
        flex: 1,
        color: '#C7D0DA',
        fontSize: 14,
        lineHeight: 20,
    },

    checklistItemChecked: {
        color: '#8794A3',
        textDecorationLine: 'line-through',
    },

    noteActions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
        gap: 10,
        marginTop: 8,
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

    noteTitleInput: {
        height: 56,
        backgroundColor: '#101923',
        borderWidth: 1,
        borderColor: '#465A70',
        borderRadius: 4,
        paddingHorizontal: 13,
        fontSize: 15,
        color: '#E9EDF2',
        marginBottom: 12,
    },

    noteComposerRow: {
        flexDirection: 'row',
        alignItems: 'stretch',
        gap: 14,
    },

    noteComposerFields: {
        flex: 1,
        gap: 12,
    },

    noteTitleInputInRow: {
        flex: 1,
    },

    textAreaInRow: {
        flex: 1,
        minHeight: 96,
        padding: 12,
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

    imagePickerButton: {
        width: 88,
        height: 88,
        marginBottom: 6,
        borderRadius: 4,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#60758A',
        backgroundColor: '#101923',
        overflow: 'hidden',
    },

    imagePickerPlaceholder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    imagePickerGlyph: {
        color: '#D5DDE5',
        fontSize: 22,
    },

    imagePickerText: {
        color: '#B8C5D4',
        fontSize: 11,
        fontWeight: '600',
    },

    selectedNoteImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },

    imagePickerHint: {
        color: '#9CA3AF',
        fontSize: 11,
        marginBottom: 12,
    },

    button: {
        marginTop: 16,
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

    authContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: 'transparent',
    },

    authCard: {
        width: '100%',
        maxWidth: 420,
        alignSelf: 'center',
        backgroundColor: '#182333',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#7B6B4E',
        padding: 22,
    },

    authTitle: {
        color: '#F3E7C3',
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 8,
        textAlign: 'center',
    },

    authHeading: {
        color: '#F0E2BD',
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 20,
        textAlign: 'center',
    },

    authInput: {
        height: 49,
        backgroundColor: '#101923',
        borderWidth: 1,
        borderColor: '#465A70',
        borderRadius: 4,
        paddingHorizontal: 14,
        fontSize: 15,
        color: '#E9EDF2',
        marginBottom: 14,
    },

    authError: {
        color: '#F0A5A5',
        fontSize: 14,
        marginBottom: 14,
    },

    authSubmitButton: {
        backgroundColor: '#536F8C',
        minHeight: 48,
        paddingVertical: 13,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#7890AA',
    },

    authDisabledButton: {
        opacity: 0.65,
    },

    authSubmitText: {
        color: '#F4E9CB',
        fontSize: 15,
        fontWeight: '700',
    },

    authToggleButton: {
        paddingVertical: 16,
        alignItems: 'center',
    },

    authToggleText: {
        color: '#B8C5D4',
        fontSize: 14,
    },
});
