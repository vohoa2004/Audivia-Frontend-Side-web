import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack, usePathname } from 'expo-router';
import { useAuth } from './AuthContext';
import { COLORS } from '@/constants/theme';
import FloatingButton from '@/components/common/FloatingButton';

export default function LayoutContent() {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
      <Stack screenOptions={{ headerShown: false }} />
      {isAuthenticated && !pathname.includes('chatbox') && <FloatingButton onPress={() => router.push("/(screens)/chatbox")} />}
    </SafeAreaView>
  );
}