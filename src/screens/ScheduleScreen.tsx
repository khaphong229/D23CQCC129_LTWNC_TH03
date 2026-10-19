import React, { useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useStudy } from '../context/StudyContext';
import { RootStackParamList } from '../types/study';
import { EmptyState } from '../components/EmptyState';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const DAYS = ['Tất cả', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

export const ScheduleScreen = () => {
  const { schedules } = useStudy();
  const navigation = useNavigation<NavigationProp>();
  const [selectedDay, setSelectedDay] = useState('Tất cả');

  const filteredSchedules =
    selectedDay === 'Tất cả'
      ? schedules
      : schedules.filter(item => item.day === selectedDay);

  return (
    <View style={styles.container}>
      <View style={styles.filterWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {DAYS.map(day => (
            <TouchableOpacity
              key={day}
              style={[
                styles.filterButton,
                selectedDay === day && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedDay(day)}>
              <Text
                style={[
                  styles.filterText,
                  selectedDay === day && styles.filterTextActive,
                ]}>
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredSchedules}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate('ScheduleDetail', { schedule: item })
            }>
            <Text style={styles.courseName}>{item.courseName}</Text>
            <Text style={styles.info}>
              Thời gian: {item.day} ({item.time})
            </Text>
            <Text style={styles.info}>Phòng học: {item.room}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <EmptyState message="Không có lịch học trong ngày này." />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  filterWrapper: {
    marginBottom: 12,
  },
  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#2563EB',
  },
  filterText: {
    fontSize: 14,
    color: '#374151',
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  courseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  info: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 2,
  },
});
