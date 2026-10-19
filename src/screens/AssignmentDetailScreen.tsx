import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const AssignmentDetailScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Chi tiết bài tập</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 16 },
});
