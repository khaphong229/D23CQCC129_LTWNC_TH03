import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Màn hình Cá nhân & Kết quả học tập</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 16 },
});
