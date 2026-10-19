import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Course } from '../types/study';

interface CourseItemProps {
  course: Course;
  onPress: () => void;
}

export const CourseItem: React.FC<CourseItemProps> = ({ course, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.row}>
        <Text style={styles.code}>{course.code}</Text>
        <Text style={styles.credits}>{course.credits} tín chỉ</Text>
      </View>
      <Text style={styles.name}>{course.name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  code: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
  },
  credits: {
    fontSize: 13,
    color: '#6B7280',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
});
