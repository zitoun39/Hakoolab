import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { AlertCircle } from 'lucide-react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'صفحة غير موجودة' }} />
      <View style={styles.container}>
        <AlertCircle color="#ef4444" size={64} style={styles.icon} />
        <Text style={styles.title}>هذه الصفحة غير موجودة</Text>
        <Text style={styles.subtitle}>عذراً، لا يمكن العثور على الصفحة المطلوبة</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>العودة للصفحة الرئيسية</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 32,
  },
  link: {
    backgroundColor: '#0891b2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  linkText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
