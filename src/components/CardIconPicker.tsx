//seleciona o ícone do cartão

import { Text, TouchableOpacity, View } from "react-native";
import type { CardIcon } from "../database/firestore";
import { styles } from "../../styles";

const iconOptions: { value: CardIcon; glyph: string; label: string }[] = [
  { value: "star", glyph: "⭐", label: "Estrela" },
  { value: "checklist", glyph: "✅", label: "Checklist" },
  { value: "calendar", glyph: "📅", label: "Calendário" },
];

type Props = {
  selectedIcon: CardIcon | null;
  onSelect: (icon: CardIcon) => void;
};

export function CardIconPicker({ selectedIcon, onSelect }: Props) {
  return (
    <View style={styles.iconPicker}>
      {iconOptions.map((option) => {
        const selected = selectedIcon === option.value;
        return (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.iconChoice,
              selected && styles.iconChoiceSelected,
            ]}
            onPress={() => onSelect(option.value)}
            accessibilityRole="button"
            accessibilityLabel={`Ícone ${option.label}`}
            accessibilityState={{ selected }}
          >
            <Text style={styles.iconChoiceGlyph}>{option.glyph}</Text>
            <Text style={styles.iconChoiceLabel}>{option.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
