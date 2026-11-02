import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ROUTES from './routes';
import HomeStack from './HomeStack';
import CourseStack from './CourseStack';
import ScheduleStack from './ScheduleStack';
import AssignmentStack from './AssignmentStack';
import ProfileStack from './ProfileStack';
import { useAppData } from '../context/AppDataContext';
import colors from '../theme/colors';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const { assignments } = useAppData();
  const todoCount = (assignments || []).filter(
    item => item.status !== 'done',
  ).length;

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarIcon: ({ color, size }) => {
            let iconName = 'home-outline';
            if (route.name === ROUTES.HOME_TAB) {
              iconName = 'home-outline';
            } else if (route.name === ROUTES.COURSE_TAB) {
              iconName = 'book-outline';
            } else if (route.name === ROUTES.SCHEDULE_TAB) {
              iconName = 'calendar-outline';
            } else if (route.name === ROUTES.ASSIGNMENT_TAB) {
              iconName = 'checkbox-outline';
            } else if (route.name === ROUTES.PROFILE_TAB) {
              iconName = 'person-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}>
        <Tab.Screen
          name={ROUTES.HOME_TAB}
          component={HomeStack}
          options={{ title: 'Tổng quan' }}
        />
        <Tab.Screen
          name={ROUTES.COURSE_TAB}
          component={CourseStack}
          options={{ title: 'Môn học' }}
        />
        <Tab.Screen
          name={ROUTES.SCHEDULE_TAB}
          component={ScheduleStack}
          options={{ title: 'Thời khóa biểu' }}
        />
        <Tab.Screen
          name={ROUTES.ASSIGNMENT_TAB}
          component={AssignmentStack}
          options={{
            title: 'Bài tập',
            tabBarBadge: todoCount > 0 ? todoCount : undefined,
          }}
        />
        <Tab.Screen
          name={ROUTES.PROFILE_TAB}
          component={ProfileStack}
          options={{ title: 'Cá nhân' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

