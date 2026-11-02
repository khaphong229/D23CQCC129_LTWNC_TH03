import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

interface Props {
  status?: 'todo' | 'done';
  onToggle: () => void;
}

export default function StatusToggle({ status = 'todo', onToggle }: Props) {
  const isDone = status === 'done';

  return (
    <TouchableOpacity
      style={[styles.btn, isDone ? styles.btnDone : styles.btnTodo]}
      onPress={onToggle}
      accessibilityLabel={
        isDone ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu đã hoàn thành'
      }>
      <Ionicons
        name={isDone ? 'checkbox' : 'square-outline'}
        size={18}
        color={isDone ? colors.success : colors.primary}
      />
      <Text style={[styles.text, isDone ? styles.textDone : styles.textTodo]}>
        {isDone ? 'Đã xong' : 'Chưa xong'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    minHeight: 44,
    minWidth: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.xs,
    borderWidth: 1,
  },
  btnTodo: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  btnDone: {
    borderColor: colors.success,
    backgroundColor: colors.surface,
  },
  text: {
    ...typography.small,
    fontWeight: 'bold',
    marginLeft: spacing.xs,
  },
  textTodo: {
    color: colors.primary,
  },
  textDone: {
    color: colors.success,
  },
});

