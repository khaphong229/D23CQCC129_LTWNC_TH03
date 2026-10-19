import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const ScheduleDetailScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Chi tiết buổi học</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 16 },
});
