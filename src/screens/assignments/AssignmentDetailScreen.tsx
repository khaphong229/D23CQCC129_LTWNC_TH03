import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import AppButton from '../../components/common/AppButton';
import SyncBadge from '../../components/common/SyncBadge';
import StatusToggle from '../../components/assignment/StatusToggle';
import { useAppData } from '../../context/AppDataContext';
import { useSync } from '../../context/SyncContext';
import { Assignment } from '../../types/study';
import { formatDate, isOverdue } from '../../utils/date';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function AssignmentDetailScreen({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) {
  const { id } = route.params || {};
  const {
    getAssignmentDetail,
    assignments,
    courses,
    toggleAssignmentStatus,
  } = useAppData();
  const { isPendingItem } = useSync();

  const [item, setItem] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setErr('');
    try {
      const res = await getAssignmentDetail(id);
      if (!res) {
        setErr('Không tìm thấy bài tập');
      } else {
        const c =
          res.course ||
          (courses || []).find(x => Number(x.id) === Number(res.courseId));
        const merged = { ...res, course: c || null };
        setItem(merged);
        navigation.setOptions({ title: res.title || 'Chi tiết bài tập' });
      }
    } catch (e: any) {
      setErr(e?.message || 'Lỗi tải chi tiết bài tập');
    } finally {
      setLoading(false);
    }
  }, [id, getAssignmentDetail, courses, navigation]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const liveItem =
    (assignments || []).find(a => String(a.id) === String(id)) || item;

  if (loading && !liveItem) {
    return (
      <ScreenContainer>
        <LoadingView />
      </ScreenContainer>
    );
  }

  if (err && !liveItem) {
    return (
      <ScreenContainer>
        <ErrorView message={err} onRetry={loadData} />
      </ScreenContainer>
    );
  }

  if (!liveItem) {
    return (
      <ScreenContainer>
        <ErrorView message="Không tìm thấy bài tập" onRetry={loadData} />
      </ScreenContainer>
    );
  }

  const cObj =
    liveItem.course ||
    (courses || []).find(x => Number(x.id) === Number(liveItem.courseId));
  const overdue = isOverdue(liveItem.dueDate, liveItem.status);

  return (
    <ScreenContainer>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>{liveItem.title}</Text>
          <SyncBadge pending={isPendingItem('assignment', liveItem.id)} />
        </View>

        <Text style={styles.info}>
          Môn học: {cObj?.name || 'Môn học #' + liveItem.courseId}
        </Text>
        <Text style={[styles.info, overdue ? styles.overdue : null]}>
          Hạn nộp: {formatDate(liveItem.dueDate)}
          {overdue ? ' (Quá hạn)' : ''}
        </Text>
        <Text style={styles.info}>
          Trạng thái: {liveItem.status === 'done' ? 'Đã xong' : 'Chưa xong'}
        </Text>
        <Text style={styles.info}>
          Mô tả: {liveItem.description || 'Không có mô tả'}
        </Text>

        <View style={styles.toggleWrap}>
          <StatusToggle
            status={liveItem.status}
            onToggle={() => toggleAssignmentStatus(liveItem)}
          />
        </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    flex: 1,
    marginRight: spacing.sm,
  },
  info: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  overdue: {
    color: colors.danger,
    fontWeight: 'bold',
  },
  toggleWrap: {
    marginTop: spacing.md,
    alignSelf: 'flex-start',
  },
});

