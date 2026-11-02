import React, { useState } from 'react';
import { FlatList } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import EmptyState from '../../components/common/EmptyState';
import FilterChips from '../../components/common/FilterChips';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import GpaSummary from '../../components/grade/GpaSummary';
import GradeRow from '../../components/grade/GradeRow';
import { useAppData } from '../../context/AppDataContext';
import { useSync } from '../../context/SyncContext';
import { calcGpa } from '../../utils/gpa';
import ROUTES from '../../navigation/routes';

const SEMESTERS = ['Tất cả', 'HK1 2026-2027', 'HK2 2026-2027'];

export default function GradeListScreen({ navigation }: { navigation: any }) {
  const { grades, courses, gradesQuery } = useAppData();
  const { isOnline } = useSync();
  const [sem, setSem] = useState('Tất cả');

  if (gradesQuery.loading && grades.length === 0) {
    return (
      <ScreenContainer>
        <LoadingView />
      </ScreenContainer>
    );
  }

  if (gradesQuery.error && grades.length === 0) {
    return (
      <ScreenContainer>
        <ErrorView message={gradesQuery.error} onRetry={gradesQuery.refresh} />
      </ScreenContainer>
    );
  }

  const list = (grades || [])
    .map(item => {
      if (item.course) {
        return item;
      }
      const c = (courses || []).find(
        x => Number(x.id) === Number(item.courseId),
      );
      return { ...item, course: c || null };
    })
    .filter(item => (sem === 'Tất cả' ? true : item.semester === sem));

  const { gpa, totalCredits } = calcGpa(list, courses);

  return (
    <ScreenContainer>
      {!isOnline ? (
        <LastUpdatedText timestamp={gradesQuery.lastUpdated} />
      ) : null}

      <GpaSummary gpa={gpa} totalCredits={totalCredits} />

      <FilterChips options={SEMESTERS} selected={sem} onSelect={setSem} />

      <FlatList
        data={list}
        keyExtractor={item => String(item.id)}
        refreshing={gradesQuery.refreshing}
        onRefresh={gradesQuery.refresh}
        renderItem={({ item }) => (
          <GradeRow
            grade={item}
            onPress={() =>
              navigation.navigate(ROUTES.GRADE_DETAIL, { id: item.id })
            }
          />
        )}
        ListEmptyComponent={
          <EmptyState title="Không có kết quả học tập trong học kỳ này" />
        }
      />
    </ScreenContainer>
  );
}

