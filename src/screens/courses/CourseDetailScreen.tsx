import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import EmptyState from '../../components/common/EmptyState';
import AppButton from '../../components/common/AppButton';
import SessionCard from '../../components/schedule/SessionCard';
import AssignmentItem from '../../components/assignment/AssignmentItem';
import { useAppData } from '../../context/AppDataContext';
import { useSync } from '../../context/SyncContext';
import { Course } from '../../types/study';
import ROUTES from '../../navigation/routes';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function CourseDetailScreen({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) {
  const { id } = route.params || {};
  const {
    getCourseDetail,
    sessions,
    assignments,
    toggleAssignmentStatus,
  } = useAppData();
  const { isPendingItem } = useSync();

  const [item, setItem] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setErr('');
    try {
      const res = await getCourseDetail(id);
      if (!res) {
        setErr('Không tìm thấy thông tin môn học');
      } else {
        setItem(res);
        navigation.setOptions({ title: res.name || 'Chi tiết môn học' });
      }
    } catch (e: any) {
      setErr(e?.message || 'Lỗi tải chi tiết môn học');
    } finally {
      setLoading(false);
    }
  }, [id, getCourseDetail, navigation]);

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

  const courseSessions = (sessions || []).filter(
    s => Number(s.courseId) === Number(item.id),
  );
  const courseAssignments = (assignments || []).filter(
    a => Number(a.courseId) === Number(item.id),
  );

  return (
    <ScreenContainer scroll>
      <View style={styles.card}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.info}>Mã môn học: {item.code}</Text>
        <Text style={styles.info}>Số tín chỉ: {item.credits}</Text>
        <Text style={styles.info}>Giảng viên: {item.lecturer}</Text>
        <Text style={styles.info}>Học kỳ: {item.semester}</Text>
        <Text style={styles.info}>Mô tả: {item.description}</Text>
      </View>

      <Text style={styles.sectionTitle}>Lịch học của môn</Text>
      {courseSessions.length === 0 ? (
        <EmptyState title="Chưa có lịch học cho môn này" />
      ) : (
        courseSessions.map(s => (
          <SessionCard
            key={String(s.id)}
            session={{ ...s, course: item }}
            onPress={() => {}}
          />
        ))
      )}

      <Text style={styles.sectionTitle}>Bài tập của môn</Text>
      {courseAssignments.length === 0 ? (
        <EmptyState title="Chưa có bài tập cho môn này" />
      ) : (
        courseAssignments.map(a => (
          <AssignmentItem
            key={String(a.id)}
            assignment={{ ...a, course: item }}
            pending={isPendingItem('assignment', a.id)}
            onToggleStatus={toggleAssignmentStatus}
            onPress={() =>
              navigation.navigate(ROUTES.ASSIGNMENT_DETAIL, { id: a.id })
            }
          />
        ))
      )}

      <View style={styles.btnWrap}>
        <AppButton
          title="Quay lại"
          variant="outline"
          onPress={() => navigation.goBack()}
        />
      </View>
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
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  btnWrap: {
    marginTop: spacing.md,
  },
});

