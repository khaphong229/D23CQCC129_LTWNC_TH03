import React, { useState } from 'react';
import { FlatList } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import EmptyState from '../../components/common/EmptyState';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import DaySelector from '../../components/schedule/DaySelector';
import SessionCard from '../../components/schedule/SessionCard';
import { useAppData } from '../../context/AppDataContext';
import { useSync } from '../../context/SyncContext';
import ROUTES from '../../navigation/routes';

function getTodayDayOfWeek(): number {
  const d = new Date().getDay();
  return d === 0 ? 8 : d + 1;
}

export default function ScheduleScreen({ navigation }: { navigation: any }) {
  const { sessions, courses, sessionsQuery } = useAppData();
  const { isOnline } = useSync();
  const [day, setDay] = useState(getTodayDayOfWeek());

  if (sessionsQuery.loading && sessions.length === 0) {
    return (
      <ScreenContainer>
        <LoadingView />
      </ScreenContainer>
    );
  }

  if (sessionsQuery.error && sessions.length === 0) {
    return (
      <ScreenContainer>
        <ErrorView
          message={sessionsQuery.error}
          onRetry={sessionsQuery.refresh}
        />
      </ScreenContainer>
    );
  }

  const list = (sessions || [])
    .filter(item => Number(item.dayOfWeek) === Number(day))
    .map(item => {
      if (item.course) {
        return item;
      }
      const found = (courses || []).find(
        c => Number(c.id) === Number(item.courseId),
      );
      return { ...item, course: found || null };
    });

  return (
    <ScreenContainer>
      {!isOnline ? (
        <LastUpdatedText timestamp={sessionsQuery.lastUpdated} />
      ) : null}

      <DaySelector selectedDay={day} onSelectDay={setDay} />

      <FlatList
        data={list}
        keyExtractor={item => String(item.id)}
        refreshing={sessionsQuery.refreshing}
        onRefresh={sessionsQuery.refresh}
        renderItem={({ item }) => (
          <SessionCard
            session={item}
            onPress={() =>
              navigation.navigate(ROUTES.SESSION_DETAIL, { id: item.id })
            }
          />
        )}
        ListEmptyComponent={
          <EmptyState title="Không có buổi học nào trong ngày này" />
        }
      />
    </ScreenContainer>
  );
}

