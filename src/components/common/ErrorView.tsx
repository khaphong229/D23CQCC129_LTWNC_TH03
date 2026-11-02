import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppButton from './AppButton';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

interface Props {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorView({
  message = 'Đã xảy ra lỗi khi tải dữ liệu',
  onRetry,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>!</Text>
      <Text style={styles.text}>{message}</Text>
      {onRetry ? (
        <AppButton title="Thử lại" onPress={onRetry} variant="primary" />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  icon: {
    ...typography.h2,
    color: colors.danger,
    marginBottom: spacing.xs,
  },
  text: {
    ...typography.body,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
});

