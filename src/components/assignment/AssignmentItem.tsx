import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import StatusToggle from './StatusToggle';
import SyncBadge from '../common/SyncBadge';
import { Assignment } from '../../types/study';
import { formatDate, isOverdue } from '../../utils/date';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

interface Props {
  assignment: Assignment;
  pending?: boolean;
  onPress: () => void;
  onToggleStatus?: (item: Assignment) => void;
}

function AssignmentItem({
  assignment,
  pending = false,
  onPress,
  onToggleStatus,
}: Props) {
  const courseName =
    assignment?.course?.name || 'Môn học #' + assignment?.courseId;
  const overdue = isOverdue(assignment?.dueDate, assignment?.status);

  return (
    <TouchableOpacity
      style={[styles.card, overdue ? styles.cardOverdue : null]}
      onPress={onPress}
      accessibilityLabel={'Bài tập ' + (assignment?.title || '')}>
      <View style={styles.header}>
        <Text style={styles.title}>{assignment?.title}</Text>
        <SyncBadge pending={pending} />
      </View>

      <Text style={styles.info}>Môn: {courseName}</Text>
      <Text style={[styles.info, overdue ? styles.overdueText : null]}>
        Hạn nộp: {formatDate(assignment?.dueDate)}
        {overdue ? ' (Quá hạn)' : ''}
      </Text>

      <View style={styles.footer}>
        <StatusToggle
          status={assignment?.status}
          onToggle={() => onToggleStatus && onToggleStatus(assignment)}
        />
      </View>
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
  cardOverdue: {
    borderColor: colors.danger,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.h3,
    color: colors.text,
    flex: 1,
    marginRight: spacing.sm,
  },
  info: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  overdueText: {
    color: colors.danger,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.sm,
  },
});

export default memo(AssignmentItem);

