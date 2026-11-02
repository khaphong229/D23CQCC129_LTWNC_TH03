import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SessionItem } from '../../types/study';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

interface Props {
  session: SessionItem;
  onPress: () => void;
}

function SessionCard({ session, onPress }: Props) {
  const courseName =
    session?.course?.name || 'Môn học #' + session?.courseId;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      accessibilityLabel={'Buổi học ' + courseName}>
      <Text style={styles.name}>{courseName}</Text>
      <Text style={styles.info}>
        Thời gian: {session?.startTime} - {session?.endTime}
      </Text>
      <Text style={styles.info}>Phòng học: {session?.room}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
    minHeight: 44,
  },
  name: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  info: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
});

export default memo(SessionCard);

