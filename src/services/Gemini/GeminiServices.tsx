import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import * as Calendar from 'expo-calendar/legacy';
import { NotaExtraida } from './gemini';

interface CalendarModalProps {
  visible: boolean;
  nota: NotaExtraida | null;
  onClose: () => void;
}

// Função auxiliar para converter "dd/mm/aaaa" em objeto Date
function parseDataBR(dataStr: string): Date | null {
  const partes = dataStr.trim().split('/');
  if (partes.length !== 3) return null;

  const dia = parseInt(partes[0], 10);
  const mes = parseInt(partes[1], 10) - 1; // Mês no JS começa em 0
  const ano = parseInt(partes[2], 10);

  const data = new Date(ano, mes, dia, 0, 0, 0);
  if (
    data.getFullYear() !== ano ||
    data.getMonth() !== mes ||
    data.getDate() !== dia
  ) {
    return null;
  }
  return data;
}

// Função para obter o ID do calendário padrão no Android
async function getCalendarioAndroidId(): Promise<string> {
  const { status } = await Calendar.requestCalendarPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Permissão de acesso ao calendário negada.');
  }

  const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
  
  // Busca o calendário principal do Android ou o primeiro editável
  const defaultCalendar =
    calendars.find((cal) => cal.isPrimary && cal.allowsModifications) ||
    calendars.find((cal) => cal.allowsModifications);

  if (!defaultCalendar) {
    throw new Error('Nenhum calendário editável encontrado no dispositivo.');
  }

  return defaultCalendar.id;
}

export async function criarEventoNoCalendario(
  nota: NotaExtraida,
  dataTerminoStr?: string
): Promise<void> {
  const startDate = parseDataBR(nota.dataInicio);
  if (!startDate) {
    throw new Error(`Data inicial inválida: ${nota.dataInicio}`);
  }

  let endDate: Date;

  if (dataTerminoStr) {
    const parsedEnd = parseDataBR(dataTerminoStr);
    if (!parsedEnd) {
      throw new Error('Data de término inválida. Use o formato dd/mm/aaaa.');
    }
    if (parsedEnd < startDate) {
      throw new Error('A data de término não pode ser anterior à data de início.');
    }
    // Para eventos de dia inteiro (allDay) no Android, o endDate é exclusivo (meia-noite do dia seguinte)
    endDate = new Date(parsedEnd);
    endDate.setDate(endDate.getDate() + 1);
  } else {
    // Evento de 1 dia inteiro
    endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);
  }

  const calendarId = await getCalendarioAndroidId();

  await Calendar.createEventAsync(calendarId, {
    title: nota.titulo,
    notes: nota.descricao,
    startDate,
    endDate,
    allDay: true,
    timeZone: 'America/Sao_Paulo',
  });
}

// Componente Modal que gerencia o fluxo de pergunta
export const NotaCalendarioModal: React.FC<CalendarModalProps> = ({
  visible,
  nota,
  onClose,
}) => {
  const [temTermino, setTemTermino] = useState<boolean | null>(null);
  const [dataTermino, setDataTermino] = useState('');
  const [salvando, setSalvando] = useState(false);

  const resetarEFechar = () => {
    setTemTermino(null);
    setDataTermino('');
    setSalvando(false);
    onClose();
  };

  const handleSalvarEvento = async (comTermino: boolean) => {
    if (!nota) return;

    try {
      setSalvando(true);
      await criarEventoNoCalendario(nota, comTermino ? dataTermino : undefined);
      Alert.alert('Sucesso', 'Evento adicionado ao calendário do Android!');
      resetarEFechar();
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível criar o evento.');
      setSalvando(false);
    }
  };

  if (!nota) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={resetarEFechar}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.tituloModal}>Salvar no Calendário</Text>
          
          <View style={styles.resumoBox}>
            <Text style={styles.labelResumo}>Título: <Text style={styles.valorResumo}>{nota.titulo}</Text></Text>
            <Text style={styles.labelResumo}>Início: <Text style={styles.valorResumo}>{nota.dataInicio}</Text></Text>
            <Text style={styles.labelResumo}>Descrição: <Text style={styles.valorResumo}>{nota.descricao}</Text></Text>
          </View>

          {temTermino === null && (
            <>
              <Text style={styles.pergunta}>Esta nota possui um dia de término?</Text>
              <View style={styles.botoesRow}>
                <TouchableOpacity
                  style={[styles.botao, styles.botaoSecundario]}
                  disabled={salvando}
                  onPress={() => handleSalvarEvento(false)}
                >
                  <Text style={styles.textoBotaoSecundario}>Não (Apenas 1 dia)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.botao, styles.botaoPrimario]}
                  disabled={salvando}
                  onPress={() => setTemTermino(true)}
                >
                  <Text style={styles.textoBotaoPrimario}>Sim</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {temTermino === true && (
            <>
              <Text style={styles.pergunta}>Qual é o dia de término? (dd/mm/aaaa)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 25/12/2026"
                value={dataTermino}
                onChangeText={setDataTermino}
                keyboardType={Platform.OS === 'android' ? 'numeric' : 'numbers-and-punctuation'}
                maxLength={10}
              />
              <View style={styles.botoesRow}>
                <TouchableOpacity
                  style={[styles.botao, styles.botaoSecundario]}
                  disabled={salvando}
                  onPress={() => setTemTermino(null)}
                >
                  <Text style={styles.textoBotaoSecundario}>Voltar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.botao, styles.botaoPrimario]}
                  disabled={salvando}
                  onPress={() => handleSalvarEvento(true)}
                >
                  <Text style={styles.textoBotaoPrimario}>
                    {salvando ? 'Salvando...' : 'Confirmar'}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          <TouchableOpacity style={styles.botaoCancelar} onPress={resetarEFechar}>
            <Text style={styles.textoCancelar}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  tituloModal: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1A1A1A',
  },
  resumoBox: {
    backgroundColor: '#F4F6F8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  labelResumo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 4,
  },
  valorResumo: {
    fontWeight: 'normal',
    color: '#1A1A1A',
  },
  pergunta: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 16,
  },
  botoesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  botao: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  botaoPrimario: {
    backgroundColor: '#2563EB',
  },
  botaoSecundario: {
    backgroundColor: '#E5E7EB',
  },
  textoBotaoPrimario: {
    color: '#FFF',
    fontWeight: '600',
  },
  textoBotaoSecundario: {
    color: '#1F2937',
    fontWeight: '600',
  },
  botaoCancelar: {
    marginTop: 14,
    alignItems: 'center',
  },
  textoCancelar: {
    color: '#DC2626',
    fontSize: 14,
  },
});