import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import AppButton from '../../components/common/AppButton';
import { useAppData } from '../../context/AppDataContext';
import { SessionItem } from '../../types/study';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function SessionDetailScreen({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) {
  const { id } = route.params || {};
  const { getSessionDetail, courses } = useAppData();

  const [item, setItem] = useState<SessionItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setErr('');
    try {
      const res = await getSessionDetail(id);
      if (!res) {
        setErr('Không tìm thấy thông tin buổi học');
      } else {
        const c =
          res.course ||
          (courses || []).find(x => Number(x.id) === Number(res.courseId));
        const merged = { ...res, course: c || null };
        setItem(merged);
        navigation.setOptions({
          title: c?.name || 'Chi tiết buổi học',
        });
      }
    } catch (e: any) {
      setErr(e?.message || 'Lỗi tải chi tiết buổi học');
    } finally {
      setLoading(false);
    }
  }, [id, getSessionDetail, courses, navigation]);

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

  const dayLabel =
    Number(item.dayOfWeek) === 8 ? 'Chủ nhật' : 'Thứ ' + item.dayOfWeek;

  return (
    <ScreenContainer>
      <View style={styles.card}>
        <Text style={styles.title}>
          {item.course?.name || 'Môn học #' + item.courseId}
        </Text>
        <Text style={styles.info}>Ngày học: {dayLabel}</Text>
        <Text style={styles.info}>
          Khung giờ: {item.startTime} - {item.endTime}
        </Text>
        <Text style={styles.info}>Phòng học: {item.room}</Text>
        <Text style={styles.info}>
          Ghi chú: {item.note || 'Không có ghi chú'}
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

