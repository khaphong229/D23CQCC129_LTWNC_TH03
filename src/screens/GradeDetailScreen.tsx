import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const GradeDetailScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Chi tiết kết quả học tập</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 16 },
});
