import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

interface Props {
  gpa?: number;
  totalCredits?: number;
}

export default function GpaSummary({ gpa = 0, totalCredits = 0 }: Props) {
  const formattedGpa = Number(gpa || 0).toFixed(2);

  return (
    <View style={styles.box}>
      <View style={styles.col}>
        <Text style={styles.label}>GPA tích lũy (Hệ 4)</Text>
        <Text style={styles.val}>{formattedGpa}</Text>
      </View>
      <View style={styles.col}>
        <Text style={styles.label}>Tín chỉ tích lũy</Text>
        <Text style={styles.val}>{totalCredits}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.sm,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  col: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    ...typography.small,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  val: {
    ...typography.h2,
    color: colors.primary,
  },
});

