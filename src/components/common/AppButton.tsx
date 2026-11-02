import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
}

export default function AppButton({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
}: Props) {
  const isOutline = variant === 'outline';
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.btn,
        isOutline ? styles.btnOutline : styles.btnPrimary,
        isDisabled ? styles.btnDisabled : null,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      accessibilityLabel={title}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={isOutline ? colors.primary : colors.surface}
        />
      ) : (
        <Text
          style={[
            styles.text,
            isOutline ? styles.textOutline : styles.textPrimary,
          ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimary: {
    backgroundColor: colors.primary,
  },
  btnOutline: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  text: {
    ...typography.body,
    fontWeight: 'bold',
  },
  textPrimary: {
    color: colors.surface,
  },
  textOutline: {
    color: colors.primary,
  },
});

