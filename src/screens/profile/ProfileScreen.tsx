import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import SyncBadge from '../../components/common/SyncBadge';
import AppButton from '../../components/common/AppButton';
import InfoRow from '../../components/profile/InfoRow';
import GpaSummary from '../../components/grade/GpaSummary';
import { useAppData } from '../../context/AppDataContext';
import { useSync } from '../../context/SyncContext';
import { calcGpa } from '../../utils/gpa';
import ROUTES from '../../navigation/routes';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function ProfileScreen({ navigation }: { navigation: any }) {
  const { student, grades, courses, studentQuery, gradesQuery, refreshAll } =
    useAppData();
  const { isOnline, isPendingItem } = useSync();

  if ((studentQuery.loading || gradesQuery.loading) && !student) {
    return (
      <ScreenContainer>
        <LoadingView />
      </ScreenContainer>
    );
  }

  if (studentQuery.error && !student) {
    return (
      <ScreenContainer>
        <ErrorView message={studentQuery.error} onRetry={refreshAll} />
      </ScreenContainer>
    );
  }

  const { gpa, totalCredits } = calcGpa(grades, courses);

  return (
    <ScreenContainer scroll>
      {!isOnline ? (
        <LastUpdatedText timestamp={studentQuery.lastUpdated} />
      ) : null}

      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Thông tin cá nhân</Text>
          <SyncBadge pending={isPendingItem('student', student?.id || 1)} />
        </View>

        <InfoRow label="Mã sinh viên" value={student?.studentCode || '---'} />
        <InfoRow label="Họ và tên" value={student?.fullName || '---'} />
        <InfoRow label="Lớp" value={student?.className || '---'} />
        <InfoRow label="Ngành học" value={student?.major || '---'} />
        <InfoRow label="Email" value={student?.email || '---'} />
        <InfoRow label="Số điện thoại" value={student?.phone || '---'} />

        <View style={styles.btnWrap}>
          <AppButton
            title="Chỉnh sửa thông tin"
            onPress={() => navigation.navigate(ROUTES.EDIT_PROFILE)}
          />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Tổng kết học tập</Text>
      <GpaSummary gpa={gpa} totalCredits={totalCredits} />

      <AppButton
        title="Xem bảng điểm chi tiết"
        variant="outline"
        onPress={() => navigation.navigate(ROUTES.GRADE_LIST)}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.h2,
    color: colors.text,
  },
  btnWrap: {
    marginTop: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.sm,
  },
});

