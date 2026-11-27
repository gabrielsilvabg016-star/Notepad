import { GoogleGenAI, Type, Schema } from '@google/genai';

// Substitua pela sua chave ou use variáveis de ambiente (ex: process.env.EXPO_PUBLIC_GEMINI_API_KEY)
const ai = new GoogleGenAI({
    apiKey: "Chave aqui"
});

export interface NotaExtraida {
    titulo: string;
    descricao: string;
    dataInicio: string; // Formato dd/mm/aaaa
}

const notaSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        titulo: {
            type: Type.STRING,
            description: 'O título principal ou assunto da nota.',
        },
        descricao: {
            type: Type.STRING,
            description: 'Os detalhes ou descrição completa contida na nota.',
        },
        dataInicio: {
            type: Type.STRING,
            description: 'A data principal da nota estritamente no formato dd/mm/aaaa (sem horário).',
        },
    },
    required: ['titulo', 'descricao', 'dataInicio'],
};

export async function analisarNotaComGemini(textoDaNota: string): Promise<NotaExtraida> {
    const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Extraia o título, a descrição e a data (no formato dd/mm/aaaa, ignore horários) da seguinte nota:\n\n"${textoDaNota}"`,
        config: {
            responseMimeType: 'application/json',
            responseSchema: notaSchema,
            temperature: 0.1,
        },
    });

    if (!response.text) {
        throw new Error('O Gemini não retornou uma resposta válida.');
    }

    return JSON.parse(response.text) as NotaExtraida;
}