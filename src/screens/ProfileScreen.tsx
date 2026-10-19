import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useStudy } from '../context/StudyContext';
import { RootStackParamList } from '../types/study';
import { EmptyState } from '../components/EmptyState';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ProfileScreen = () => {
  const { student, grades, updateStudent } = useStudy();
  const navigation = useNavigation<NavigationProp>();

  const [fullName, setFullName] = useState(student.fullName);
  const [email, setEmail] = useState(student.email);
  const [phone, setPhone] = useState(student.phone);

  useEffect(() => {
    setFullName(student.fullName);
    setEmail(student.email);
    setPhone(student.phone);
  }, [student]);

  const handleSave = () => {
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ họ tên, email và SĐT.');
      return;
    }
    updateStudent(fullName.trim(), email.trim(), phone.trim());
    Alert.alert('Thành công', 'Đã cập nhật thông tin cá nhân.');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={grades}
        keyExtractor={item => item.id}
        ListHeaderComponent={
          <View>
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Thông tin sinh viên</Text>
              <Text style={styles.info}>Mã sinh viên: {student.studentId}</Text>
              <Text style={styles.info}>Họ tên: {student.fullName}</Text>
              <Text style={styles.info}>Lớp: {student.className}</Text>
              <Text style={styles.info}>Ngành học: {student.major}</Text>

              <Text style={styles.label}>Chỉnh sửa Họ tên</Text>
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Nhập họ tên"
              />

              <Text style={styles.label}>Chỉnh sửa Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Nhập email"
                keyboardType="email-address"
              />

              <Text style={styles.label}>Chỉnh sửa Số điện thoại</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Nhập số điện thoại"
                keyboardType="phone-pad"
              />

              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Lưu thông tin</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.gradeSectionTitle}>Kết quả học tập</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.gradeCard}
            onPress={() => navigation.navigate('GradeDetail', { grade: item })}>
            <Text style={styles.courseName}>{item.courseName}</Text>
            <Text style={styles.gradeInfo}>
              Số tín chỉ: {item.credits} | Điểm tổng kết: {item.totalScore}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <EmptyState message="Chưa có dữ liệu kết quả học tập." />
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
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 10,
  },
  info: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginTop: 10,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: '#FFFFFF',
  },
  saveButton: {
    marginTop: 14,
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  gradeSectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  gradeCard: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  courseName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111827',
  },
  gradeInfo: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 4,
  },
});
