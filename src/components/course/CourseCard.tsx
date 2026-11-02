import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Course } from '../../types/study';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

interface Props {
  course: Course;
  onPress: () => void;
}

function CourseCard({ course, onPress }: Props) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      accessibilityLabel={'Môn học ' + (course?.name || '')}>
      <View style={styles.row}>
        <Text style={styles.code}>{course?.code}</Text>
        <Text style={styles.credits}>{course?.credits} tín chỉ</Text>
      </View>
      <Text style={styles.name}>{course?.name}</Text>
      <Text style={styles.sub}>Giảng viên: {course?.lecturer}</Text>
      {course?.semester ? (
        <Text style={styles.sub}>Học kỳ: {course?.semester}</Text>
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
    marginBottom: spacing.xs,
  },
  code: {
    ...typography.small,
    color: colors.primary,
    fontWeight: 'bold',
  },
  credits: {
    ...typography.small,
    color: colors.textMuted,
  },
  name: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  sub: {
    ...typography.body,
    color: colors.textMuted,
  },
});

export default memo(CourseCard);

