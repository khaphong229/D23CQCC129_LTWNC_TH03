import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/study';

type Props = NativeStackScreenProps<RootStackParamList, 'GradeDetail'>;

export const GradeDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { grade } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{grade.courseName}</Text>
        <Text style={styles.info}>Số tín chỉ: {grade.credits}</Text>
        <Text style={styles.info}>Điểm giữa kỳ: {grade.midtermScore}</Text>
        <Text style={styles.info}>Điểm cuối kỳ: {grade.finalScore}</Text>
        <Text style={styles.info}>Điểm tổng kết: {grade.totalScore}</Text>
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
  backButton: {
    marginTop: 16,
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
