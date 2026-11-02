import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import AppButton from '../../components/common/AppButton';
import { useAppData } from '../../context/AppDataContext';
import { GradeRecord } from '../../types/study';
import { toScale4 } from '../../utils/gpa';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function GradeDetailScreen({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) {
  const { id } = route.params || {};
  const { getGradeDetail, courses } = useAppData();

  const [item, setItem] = useState<GradeRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setErr('');
    try {
      const res = await getGradeDetail(id);
      if (!res) {
        setErr('Không tìm thấy chi tiết điểm');
      } else {
        const c =
          res.course ||
          (courses || []).find(x => Number(x.id) === Number(res.courseId));
        const merged = { ...res, course: c || null };
        setItem(merged);
        navigation.setOptions({
          title: c?.name || 'Chi tiết kết quả học tập',
        });
      }
    } catch (e: any) {
      setErr(e?.message || 'Lỗi tải chi tiết điểm');
    } finally {
      setLoading(false);
    }
  }, [id, getGradeDetail, courses, navigation]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <ScreenContainer>
        <LoadingView />
      </ScreenContainer>
    );
  }

  if (err || !item) {
    return (
      <ScreenContainer>
        <ErrorView message={err || 'Không có dữ liệu'} onRetry={loadData} />
      </ScreenContainer>
    );
  }

  const courseName = item.course?.name || 'Môn học #' + item.courseId;
  const credits = item.course?.credits || 3;

  return (
    <ScreenContainer>
      <View style={styles.card}>
        <Text style={styles.title}>{courseName}</Text>
        <Text style={styles.info}>Học kỳ: {item.semester}</Text>
        <Text style={styles.info}>Số tín chỉ: {credits}</Text>
        <Text style={styles.info}>Điểm chuyên cần (10%): {item.attendance}</Text>
        <Text style={styles.info}>Điểm giữa kỳ (30%): {item.midterm}</Text>
        <Text style={styles.info}>Điểm cuối kỳ (60%): {item.final}</Text>
        <Text style={styles.info}>Điểm tổng kết (Hệ 10): {item.total}</Text>
        <Text style={styles.info}>
          Điểm quy đổi (Hệ 4): {toScale4(item.total)} ({item.letter})
        </Text>
      </View>

      <AppButton
        title="Quay lại"
        variant="outline"
        onPress={() => navigation.goBack()}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  info: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.xs,
  },
});

