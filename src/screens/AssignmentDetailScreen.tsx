import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useStudy } from '../context/StudyContext';
import { RootStackParamList } from '../types/study';

type Props = NativeStackScreenProps<RootStackParamList, 'AssignmentDetail'>;

export const AssignmentDetailScreen: React.FC<Props> = ({
  route,
  navigation,
}) => {
  const { assignmentId } = route.params;
  const { assignments, toggleAssignment } = useStudy();

  const assignment = assignments.find(item => item.id === assignmentId);

  if (!assignment) {
    return (
      <View style={styles.container}>
        <Text>Không tìm thấy bài tập.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{assignment.title}</Text>
        <Text style={styles.info}>Môn học: {assignment.courseName}</Text>
        <Text style={styles.info}>Hạn nộp: {assignment.dueDate}</Text>
        <Text style={styles.info}>
          Trạng thái:{' '}
          {assignment.completed ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
        </Text>
        <Text style={styles.info}>Nội dung: {assignment.description}</Text>

        <TouchableOpacity
          style={styles.statusButton}
          onPress={() => toggleAssignment(assignment.id)}>
          <Text style={styles.buttonText}>
            {assignment.completed
              ? 'Đánh dấu Chưa hoàn thành'
              : 'Đánh dấu Đã hoàn thành'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Quay lại</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  info: {
    fontSize: 15,
    color: '#374151',
    marginBottom: 8,
  },
  statusButton: {
    marginTop: 12,
    backgroundColor: '#16A34A',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButton: {
    marginTop: 16,
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
