import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import FormInput from '../../components/common/FormInput';
import AppButton from '../../components/common/AppButton';
import { useAppData } from '../../context/AppDataContext';
import { validateProfile } from '../../utils/validators';
import spacing from '../../theme/spacing';

export default function EditProfileScreen({ navigation }: { navigation: any }) {
  const { student, updateProfile } = useAppData();

  const [fullName, setFullName] = useState(student?.fullName || '');
  const [email, setEmail] = useState(student?.email || '');
  const [phone, setPhone] = useState(student?.phone || '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (student) {
      setFullName(student.fullName || '');
      setEmail(student.email || '');
      setPhone(student.phone || '');
    }
  }, [student]);

  const handleSave = async () => {
    const form = { fullName, email, phone };
    const err = validateProfile(form);
    if (Object.keys(err).length > 0) {
      setErrors(err);
      return;
    }

    setErrors({});
    setSaving(true);
    try {
      await updateProfile(form);
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Lỗi', e?.message || 'Không thể lưu thông tin cá nhân');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenContainer scroll>
      <FormInput
        label="Họ và tên"
        value={fullName}
        onChangeText={setFullName}
        placeholder="Nhập họ và tên"
        error={errors.fullName}
      />

      <FormInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholder="Nhập địa chỉ email"
        error={errors.email}
      />

      <FormInput
        label="Số điện thoại"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        placeholder="Nhập số điện thoại"
        error={errors.phone}
      />

      <View style={styles.btnGroup}>
        <AppButton
          title="Lưu thay đổi"
          onPress={handleSave}
          loading={saving}
        />
        <View style={styles.spacer} />
        <AppButton
          title="Hủy"
          variant="outline"
          onPress={() => navigation.goBack()}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  btnGroup: {
    marginTop: spacing.sm,
  },
  spacer: {
    height: spacing.sm,
  },
});

