import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { MainTabParamList, RootStackParamList } from '../types/study';
import { HomeScreen } from '../screens/HomeScreen';
import { CoursesScreen } from '../screens/CoursesScreen';
import { ScheduleScreen } from '../screens/ScheduleScreen';
import { AssignmentsScreen } from '../screens/AssignmentsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { CourseDetailScreen } from '../screens/CourseDetailScreen';
import { ScheduleDetailScreen } from '../screens/ScheduleDetailScreen';
import { AssignmentDetailScreen } from '../screens/AssignmentDetailScreen';
import { GradeDetailScreen } from '../screens/GradeDetailScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#6B7280',
        tabBarIcon: ({ color, size }) => {
          let iconName = 'home-outline';

          if (route.name === 'Home') {
            iconName = 'home-outline';
          } else if (route.name === 'Courses') {
            iconName = 'book-outline';
          } else if (route.name === 'Schedule') {
            iconName = 'calendar-outline';
          } else if (route.name === 'Assignments') {
            iconName = 'checkbox-outline';
          } else if (route.name === 'Profile') {
            iconName = 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Tổng quan' }}
      />
      <Tab.Screen
        name="Courses"
        component={CoursesScreen}
        options={{ title: 'Môn học' }}
      />
      <Tab.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{ title: 'Thời khóa biểu' }}
      />
      <Tab.Screen
        name="Assignments"
        component={AssignmentsScreen}
        options={{ title: 'Bài tập' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Cá nhân' }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="MainTabs"
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CourseDetail"
          component={CourseDetailScreen}
          options={{ title: 'Chi tiết môn học' }}
        />
        <Stack.Screen
          name="ScheduleDetail"
          component={ScheduleDetailScreen}
          options={{ title: 'Chi tiết buổi học' }}
        />
        <Stack.Screen
          name="AssignmentDetail"
          component={AssignmentDetailScreen}
          options={{ title: 'Chi tiết bài tập' }}
        />
        <Stack.Screen
          name="GradeDetail"
          component={GradeDetailScreen}
          options={{ title: 'Chi tiết kết quả học tập' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
