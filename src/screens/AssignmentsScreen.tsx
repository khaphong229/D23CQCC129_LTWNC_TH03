import React, { useState } from 'react';
import {
  FlatList,
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

export const AssignmentsScreen = () => {
  const { assignments, toggleAssignment } = useStudy();
  const navigation = useNavigation<NavigationProp>();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const filteredAssignments = assignments.filter(item => {
    if (filter === 'pending') {
      return !item.completed;
    }
    if (filter === 'completed') {
      return item.completed;
    }
    return true;
  });

  return (
    <View style={styles.container}>
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'all' && styles.filterButtonActive,
          ]}
          onPress={() => setFilter('all')}>
          <Text
            style={[
              styles.filterText,
              filter === 'all' && styles.filterTextActive,
            ]}>
            Tất cả
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'pending' && styles.filterButtonActive,
          ]}
          onPress={() => setFilter('pending')}>
          <Text
            style={[
              styles.filterText,
              filter === 'pending' && styles.filterTextActive,
            ]}>
            Chưa hoàn thành
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'completed' && styles.filterButtonActive,
          ]}
          onPress={() => setFilter('completed')}>
          <Text
            style={[
              styles.filterText,
              filter === 'completed' && styles.filterTextActive,
            ]}>
            Đã hoàn thành
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredAssignments}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate('AssignmentDetail', {
                assignmentId: item.id,
              })
            }>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.info}>Môn học: {item.courseName}</Text>
            <Text style={styles.info}>Hạn nộp: {item.dueDate}</Text>

            <View style={styles.footer}>
              <Text
                style={[
                  styles.statusText,
                  item.completed ? styles.completed : styles.pending,
                ]}>
                {item.completed ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
              </Text>

              <TouchableOpacity
                style={styles.toggleButton}
                onPress={() => toggleAssignment(item.id)}>
                <Text style={styles.toggleButtonText}>Đổi trạng thái</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<EmptyState message="Không có bài tập nào." />}
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
  filterRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#2563EB',
  },
  filterText: {
    fontSize: 13,
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
  title: {
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  completed: {
    color: '#16A34A',
  },
  pending: {
    color: '#DC2626',
  },
  toggleButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  toggleButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
