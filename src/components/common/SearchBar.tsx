import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

interface Props {
  value?: string;
  onChangeText: (val: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value = '',
  onChangeText,
  placeholder = 'Tìm kiếm...',
}: Props) {
  return (
    <View style={styles.wrapper}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        accessibilityLabel={placeholder}
      />
      {value ? (
        <TouchableOpacity
          style={styles.clearBtn}
          onPress={() => onChangeText('')}
          accessibilityLabel="Xóa tìm kiếm">
          <Text style={styles.clearText}>X</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  input: {
    flex: 1,
    minHeight: 44,
    ...typography.body,
    color: colors.text,
  },
  clearBtn: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearText: {
    ...typography.body,
    color: colors.textMuted,
    fontWeight: 'bold',
  },
});

