import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import FormInput from '../../components/common/FormInput';
import FilterChips from '../../components/common/FilterChips';
import AppButton from '../../components/common/AppButton';
import { useAppData } from '../../context/AppDataContext';
import { validateAssignment } from '../../utils/validators';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

function toIsoDate(val: string): string {
  const s = (val || '').trim();
  const parts = s.split('/');
  if (parts.length === 3) {
    const d = new Date(
      Number(parts[2]),
      Number(parts[1]) - 1,
      Number(parts[0]),
      23,
      59,
      0,
    );
    if (!isNaN(d.getTime())) {
      return d.toISOString();
    }
  }
  const d2 = new Date(s);
  if (!isNaN(d2.getTime())) {
    return d2.toISOString();
  }
  return s;
}

export default function AssignmentFormScreen({
  navigation,
}: {
  navigation: any;
}) {
  const { courses, addAssignment } = useAppData();
  const firstCourseId = courses && courses.length > 0 ? courses[0].id : 1;

  const [courseId, setCourseId] = useState<number | string>(firstCourseId);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('2026-11-20');
  const [desc, setDesc] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const courseOpts = (courses || []).map(c => ({
    value: c.id,
    label: c.name,
  }));

  const handleSave = async () => {
    const form = {
      courseId,
      title,
      dueDate,
      description: desc,
    };
    const err = validateAssignment(form);
    if (Object.keys(err).length > 0) {
      setErrors(err);
      return;
    }

    setErrors({});
    setSaving(true);
    try {
      await addAssignment({
        courseId,
        title,
        dueDate: toIsoDate(dueDate),
        description: desc,
      });
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Lỗi', e?.message || 'Không thể thêm bài tập mới');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenContainer scroll>
      <Text style={styles.label}>Chọn môn học</Text>
      <FilterChips
        options={courseOpts}
        selected={courseId}
        onSelect={setCourseId}
      />
      {errors.courseId ? (
        <Text style={styles.errText}>{errors.courseId}</Text>
      ) : null}

      <FormInput
        label="Tiêu đề bài tập"
        value={title}
        onChangeText={setTitle}
        placeholder="Nhập tiêu đề bài tập..."
        error={errors.title}
      />

      <FormInput
        label="Hạn nộp (YYYY-MM-DD hoặc DD/MM/YYYY)"
        value={dueDate}
        onChangeText={setDueDate}
        placeholder="Ví dụ: 2026-11-20"
        error={errors.dueDate}
      />

      <FormInput
        label="Mô tả chi tiết"
        value={desc}
        onChangeText={setDesc}
        placeholder="Nhập nội dung bài tập..."
      />

      <View style={styles.btnGroup}>
        <AppButton
          title="Lưu bài tập"
          onPress={handleSave}
          loading={saving}
        />
        <View style={styles.spacer} />
        <AppButton
          title="Hủy"
          variant="outline"
          onPress={() => navigation.goBack()}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  label: {
    ...typography.body,
    color: colors.text,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  errText: {
    ...typography.small,
    color: colors.danger,
    marginBottom: spacing.sm,
  },
  btnGroup: {
    marginTop: spacing.sm,
  },
  spacer: {
    height: spacing.sm,
  },
});

