import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GradeRecord } from '../../types/study';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

interface Props {
  grade: GradeRecord;
  onPress: () => void;
}

function GradeRow({ grade, onPress }: Props) {
  const courseName = grade?.course?.name || 'Môn học #' + grade?.courseId;
  const credits = grade?.course?.credits || 3;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      accessibilityLabel={'Điểm môn ' + courseName}>
      <View style={styles.row}>
        <Text style={styles.name}>{courseName}</Text>
        <Text style={styles.letter}>{grade?.letter}</Text>
      </View>
      <Text style={styles.info}>
        Số tín chỉ: {credits} | Điểm tổng kết: {grade?.total}
      </Text>
      {grade?.semester ? (
        <Text style={styles.info}>Học kỳ: {grade?.semester}</Text>
      ) : null}
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  name: {
    ...typography.h3,
    color: colors.text,
    flex: 1,
    marginRight: spacing.sm,
  },
  letter: {
    ...typography.h3,
    color: colors.primary,
  },
  info: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
});

export default memo(GradeRow);

