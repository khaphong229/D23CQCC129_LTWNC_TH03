import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/study';

type Props = NativeStackScreenProps<RootStackParamList, 'ScheduleDetail'>;

export const ScheduleDetailScreen: React.FC<Props> = ({
  route,
  navigation,
}) => {
  const { schedule } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{schedule.courseName}</Text>
        <Text style={styles.info}>Thứ: {schedule.day}</Text>
        <Text style={styles.info}>Thời gian: {schedule.time}</Text>
        <Text style={styles.info}>Phòng học: {schedule.room}</Text>
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
