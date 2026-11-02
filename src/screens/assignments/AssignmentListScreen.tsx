import React, { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import EmptyState from '../../components/common/EmptyState';
import FilterChips from '../../components/common/FilterChips';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import AppButton from '../../components/common/AppButton';
import AssignmentItem from '../../components/assignment/AssignmentItem';
import { useAppData } from '../../context/AppDataContext';
import { useSync } from '../../context/SyncContext';
import { isOverdue } from '../../utils/date';
import ROUTES from '../../navigation/routes';
import spacing from '../../theme/spacing';

const FILTERS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'todo', label: 'Chưa xong' },
  { value: 'done', label: 'Đã xong' },
  { value: 'overdue', label: 'Quá hạn' },
];

export default function AssignmentListScreen({
  navigation,
}: {
  navigation: any;
}) {
  const { assignments, courses, assignmentsQuery, toggleAssignmentStatus } =
    useAppData();
  const { isOnline, isPendingItem } = useSync();
  const [cat, setCat] = useState('all');

  if (assignmentsQuery.loading && assignments.length === 0) {
    return (
      <ScreenContainer>
        <LoadingView />
      </ScreenContainer>
    );
  }

  if (assignmentsQuery.error && assignments.length === 0) {
    return (
      <ScreenContainer>
        <ErrorView
          message={assignmentsQuery.error}
          onRetry={assignmentsQuery.refresh}
        />
      </ScreenContainer>
    );
  }

  const list = (assignments || [])
    .map(item => {
      if (item.course) {
        return item;
      }
      const c = (courses || []).find(
        x => Number(x.id) === Number(item.courseId),
      );
      return { ...item, course: c || null };
    })
    .filter(item => {
      if (cat === 'todo') {
        return item.status !== 'done';
      }
      if (cat === 'done') {
        return item.status === 'done';
      }
      if (cat === 'overdue') {
        return isOverdue(item.dueDate, item.status);
      }
      return true;
    });

  return (
    <ScreenContainer>
      {!isOnline ? (
        <LastUpdatedText timestamp={assignmentsQuery.lastUpdated} />
      ) : null}

      <View style={styles.topRow}>
        <AppButton
          title="+ Thêm bài tập mới"
          onPress={() => navigation.navigate(ROUTES.ASSIGNMENT_FORM)}
        />
      </View>

      <FilterChips options={FILTERS} selected={cat} onSelect={setCat} />

      <FlatList
        data={list}
        keyExtractor={item => String(item.id)}
        refreshing={assignmentsQuery.refreshing}
        onRefresh={assignmentsQuery.refresh}
        renderItem={({ item }) => (
          <AssignmentItem
            assignment={item}
            pending={isPendingItem('assignment', item.id)}
            onToggleStatus={toggleAssignmentStatus}
            onPress={() =>
              navigation.navigate(ROUTES.ASSIGNMENT_DETAIL, { id: item.id })
            }
          />
        )}
        ListEmptyComponent={
          <EmptyState title="Không có bài tập nào trong mục này" />
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topRow: {
    marginBottom: spacing.md,
  },
});

