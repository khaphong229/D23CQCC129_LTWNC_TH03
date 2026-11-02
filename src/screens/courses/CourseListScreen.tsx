import React, { useState } from 'react';
import { FlatList } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import EmptyState from '../../components/common/EmptyState';
import SearchBar from '../../components/common/SearchBar';
import FilterChips from '../../components/common/FilterChips';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import CourseCard from '../../components/course/CourseCard';
import { useAppData } from '../../context/AppDataContext';
import { useSync } from '../../context/SyncContext';
import ROUTES from '../../navigation/routes';

const SEMESTERS = ['Tất cả', 'HK1 2026-2027', 'HK2 2026-2027'];

export default function CourseListScreen({ navigation }: { navigation: any }) {
  const { courses, coursesQuery } = useAppData();
  const { isOnline } = useSync();
  const [kw, setKw] = useState('');
  const [sem, setSem] = useState('Tất cả');

  if (coursesQuery.loading && courses.length === 0) {
    return (
      <ScreenContainer>
        <LoadingView />
      </ScreenContainer>
    );
  }

  if (coursesQuery.error && courses.length === 0) {
    return (
      <ScreenContainer>
        <ErrorView
          message={coursesQuery.error}
          onRetry={coursesQuery.refresh}
        />
      </ScreenContainer>
    );
  }

  const list = (courses || []).filter(item => {
    const matchName = (item.name || '')
      .toLowerCase()
      .includes(kw.trim().toLowerCase());
    const matchSem = sem === 'Tất cả' ? true : item.semester === sem;
    return matchName && matchSem;
  });

  return (
    <ScreenContainer>
      {!isOnline ? (
        <LastUpdatedText timestamp={coursesQuery.lastUpdated} />
      ) : null}

      <SearchBar
        value={kw}
        onChangeText={setKw}
        placeholder="Tìm môn học theo tên..."
      />

      <FilterChips options={SEMESTERS} selected={sem} onSelect={setSem} />

      <FlatList
        data={list}
        keyExtractor={item => String(item.id)}
        refreshing={coursesQuery.refreshing}
        onRefresh={coursesQuery.refresh}
        renderItem={({ item }) => (
          <CourseCard
            course={item}
            onPress={() =>
              navigation.navigate(ROUTES.COURSE_DETAIL, { id: item.id })
            }
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title="Không tìm thấy môn học phù hợp"
            description="Thử từ khóa hoặc học kỳ khác"
          />
        }
      />
    </ScreenContainer>
  );
}

