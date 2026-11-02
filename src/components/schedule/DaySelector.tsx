import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

const DAYS = [
  { val: 2, label: 'Thứ 2' },
  { val: 3, label: 'Thứ 3' },
  { val: 4, label: 'Thứ 4' },
  { val: 5, label: 'Thứ 5' },
  { val: 6, label: 'Thứ 6' },
  { val: 7, label: 'Thứ 7' },
  { val: 8, label: 'Chủ nhật' },
];

interface Props {
  selectedDay?: number;
  onSelectDay: (day: number) => void;
}

export default function DaySelector({ selectedDay = 2, onSelectDay }: Props) {
  return (
    <View style={styles.wrapper}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {DAYS.map(d => {
          const active = Number(selectedDay) === d.val;
          return (
            <TouchableOpacity
              key={d.val}
              style={[styles.btn, active ? styles.btnActive : null]}
              onPress={() => onSelectDay(d.val)}
              accessibilityLabel={'Chọn ' + d.label}>
              <Text style={[styles.text, active ? styles.textActive : null]}>
                {d.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,
  },
  btn: {
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.chipBg,
    borderRadius: spacing.sm,
    marginRight: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnActive: {
    backgroundColor: colors.primary,
  },
  text: {
    ...typography.body,
    color: colors.text,
  },
  textActive: {
    color: colors.surface,
    fontWeight: 'bold',
  },
});

