import React from 'react';
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
import { CourseItem } from '../components/CourseItem';
import { EmptyState } from '../components/EmptyState';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen = () => {
  const { student, courses, assignments } = useStudy();
  const navigation = useNavigation<NavigationProp>();

  const upcomingAssignments = assignments.filter(item => !item.completed);

  return (
    <View style={styles.container}>
      <View style={styles.profileBox}>
        <Text style={styles.studentName}>{student.fullName}</Text>
        <Text style={styles.studentId}>Mã SV: {student.studentId}</Text>
      </View>

      <Text style={styles.sectionTitle}>Môn học đang học</Text>
      <View style={styles.listSection}>
        <FlatList
          data={courses}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <CourseItem
              course={item}
              onPress={() =>
                navigation.navigate('CourseDetail', { course: item })
              }
            />
          )}
          ListEmptyComponent={<EmptyState message="Không có môn học nào." />}
        />
      </View>

      <Text style={styles.sectionTitle}>Bài tập sắp đến hạn</Text>
      <View style={styles.listSection}>
        <FlatList
          data={upcomingAssignments}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.assignmentCard}
              onPress={() =>
                navigation.navigate('AssignmentDetail', {
                  assignmentId: item.id,
                })
              }>
              <Text style={styles.assignmentTitle}>{item.title}</Text>
              <Text style={styles.assignmentSub}>
                Môn: {item.courseName} | Hạn nộp: {item.dueDate}
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <EmptyState message="Không có bài tập sắp đến hạn." />
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  profileBox: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  studentId: {
    fontSize: 14,
    color: '#E0E7FF',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  listSection: {
    flex: 1,
    marginBottom: 12,
  },
  assignmentCard: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  assignmentTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111827',
  },
  assignmentSub: {
    fontSize: 13,
    color: '#4B5563',
    marginTop: 4,
  },
});
