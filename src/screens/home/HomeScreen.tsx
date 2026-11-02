import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import EmptyState from '../../components/common/EmptyState';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import AppButton from '../../components/common/AppButton';
import CourseCard from '../../components/course/CourseCard';
import AssignmentItem from '../../components/assignment/AssignmentItem';
import { useAppData } from '../../context/AppDataContext';
import { useSync } from '../../context/SyncContext';
import { daysLeft } from '../../utils/date';
import ROUTES from '../../navigation/routes';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function HomeScreen({ navigation }: { navigation: any }) {
  const {
    student,
    courses,
    assignments,
    studentQuery,
    coursesQuery,
    assignmentsQuery,
    toggleAssignmentStatus,
    refreshAll,
  } = useAppData();
  const { isOnline, pendingCount, syncing, syncNow, isPendingItem } = useSync();

  const isLoading =
    (studentQuery.loading || coursesQuery.loading || assignmentsQuery.loading) &&
    !student &&
    courses.length === 0;
  const errMsg =
    studentQuery.error || coursesQuery.error || assignmentsQuery.error;
  const isRefreshing =
    studentQuery.refreshing ||
    coursesQuery.refreshing ||
    assignmentsQuery.refreshing;

  if (isLoading) {
    return (
      <ScreenContainer>
        <LoadingView />
      </ScreenContainer>
    );
  }

  if (errMsg && !student && courses.length === 0) {
    return (
      <ScreenContainer>
        <ErrorView message={errMsg} onRetry={refreshAll} />
      </ScreenContainer>
    );
  }

  const upcomingList = (assignments || []).filter(item => {
    if (item.status === 'done') {
      return false;
    }
    const left = daysLeft(item.dueDate);
    return left >= 0 && left <= 7;
  });

  return (
    <ScreenContainer>
      <FlatList
        data={courses}
        keyExtractor={item => String(item.id)}
        refreshing={isRefreshing}
        onRefresh={refreshAll}
        ListHeaderComponent={
          <View>
            {!isOnline ? (
              <LastUpdatedText
                timestamp={
                  coursesQuery.lastUpdated || studentQuery.lastUpdated
                }
              />
            ) : null}

            <View style={styles.profileBox}>
              <Text style={styles.studentName}>
                {student?.fullName || 'Sinh viên'}
              </Text>
              <Text style={styles.studentSub}>
                Mã SV: {student?.studentCode || '---'} | Lớp:{' '}
                {student?.className || '---'}
              </Text>
              <Text style={styles.syncInfo}>
                Thay đổi chưa đồng bộ: {pendingCount}
              </Text>
              {pendingCount > 0 && isOnline ? (
                <View style={styles.syncBtnWrap}>
                  <AppButton
                    title="Đồng bộ ngay"
                    variant="outline"
                    loading={syncing}
                    onPress={syncNow}
                  />
                </View>
              ) : null}
            </View>

            <Text style={styles.sectionTitle}>
              Bài tập đến hạn trong 7 ngày tới
            </Text>
            {upcomingList.length === 0 ? (
              <EmptyState title="Không có bài tập đến hạn trong 7 ngày tới" />
            ) : (
              upcomingList.map(item => (
                <AssignmentItem
                  key={String(item.id)}
                  assignment={item}
                  pending={isPendingItem('assignment', item.id)}
                  onToggleStatus={toggleAssignmentStatus}
                  onPress={() =>
                    navigation.navigate(ROUTES.ASSIGNMENT_DETAIL, {
                      id: item.id,
                    })
                  }
                />
              ))
            )}

            <Text style={styles.sectionTitle}>Môn đang học</Text>
          </View>
        }
        renderItem={({ item }) => (
          <CourseCard
            course={item}
            onPress={() =>
              navigation.navigate(ROUTES.COURSE_DETAIL, { id: item.id })
            }
          />
        )}
        ListEmptyComponent={<EmptyState title="Chưa có môn học nào" />}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  profileBox: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: spacing.sm,
    marginBottom: spacing.lg,
  },
  studentName: {
    ...typography.h2,
    color: colors.surface,
  },
  studentSub: {
    ...typography.body,
    color: colors.surface,
    marginTop: spacing.xs,
  },
  syncInfo: {
    ...typography.small,
    color: colors.surface,
    marginTop: spacing.sm,
    fontWeight: 'bold',
  },
  syncBtnWrap: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
});

