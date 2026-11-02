import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

type ChipOption = string | { value: any; label: string };

interface Props {
  options: ChipOption[];
  selected: any;
  onSelect: (val: any) => void;
}

export default function FilterChips({
  options = [],
  selected,
  onSelect,
}: Props) {
  return (
    <View style={styles.wrapper}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {options.map(opt => {
          const val = typeof opt === 'object' ? opt.value : opt;
          const label = typeof opt === 'object' ? opt.label : opt;
          const active = selected === val;
          return (
            <TouchableOpacity
              key={String(val)}
              style={[styles.chip, active ? styles.chipActive : null]}
              onPress={() => onSelect(val)}
              accessibilityLabel={'Lọc ' + label}>
              <Text style={[styles.text, active ? styles.textActive : null]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,
  },
  chip: {
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.chipBg,
    borderRadius: spacing.sm,
    marginRight: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: colors.primary,
  },
  text: {
    ...typography.body,
    color: colors.text,
  },
  textActive: {
    color: colors.surface,
    fontWeight: 'bold',
  },
});

