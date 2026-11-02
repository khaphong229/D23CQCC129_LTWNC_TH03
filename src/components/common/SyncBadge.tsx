import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function SyncBadge({ pending = false }: { pending?: boolean }) {
  if (!pending) {
    return null;
  }

  return (
    <View style={styles.badge}>
      <Text style={styles.text}>Chưa đồng bộ</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: colors.warningBg,
    borderWidth: 1,
    borderColor: colors.warning,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.xs,
    alignSelf: 'flex-start',
  },
  text: {
    ...typography.small,
    color: colors.warning,
    fontWeight: 'bold',
  },
});

