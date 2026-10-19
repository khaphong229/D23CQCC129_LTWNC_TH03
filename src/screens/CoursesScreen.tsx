import React, { useState } from 'react';
import { FlatList, StyleSheet, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useStudy } from '../context/StudyContext';
import { RootStackParamList } from '../types/study';
import { CourseItem } from '../components/CourseItem';
import { EmptyState } from '../components/EmptyState';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const CoursesScreen = () => {
  const { courses } = useStudy();
  const navigation = useNavigation<NavigationProp>();
  const [searchText, setSearchText] = useState('');

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Tìm kiếm môn học theo tên..."
        value={searchText}
        onChangeText={setSearchText}
      />

      <FlatList
        data={filteredCourses}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <CourseItem
            course={item}
            onPress={() =>
              navigation.navigate('CourseDetail', { course: item })
            }
          />
        )}
        ListEmptyComponent={
          <EmptyState message="Không tìm thấy môn học phù hợp." />
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
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 12,
  },
});
