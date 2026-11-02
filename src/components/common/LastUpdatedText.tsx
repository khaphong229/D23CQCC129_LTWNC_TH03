import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { formatDate } from '../../utils/date';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function LastUpdatedText({
  timestamp = '',
}: {
  timestamp?: string;
}) {
  if (!timestamp) {
    return null;
  }

  return (
    <Text style={styles.text}>
      Cập nhật lần cuối: {formatDate(timestamp, true)}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    ...typography.small,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
});

