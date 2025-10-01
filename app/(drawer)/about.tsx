import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import Constants from 'expo-constants';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { Screen, Card } from '@/src/components/ui';
import { useTheme } from '@/src/contexts/ThemeContext';

const facebookUrl = 'https://web.facebook.com/zitoun.abdelhak';
const linkedinUrl = 'https://www.linkedin.com/in/z-abdelhak/';
const paypalEmail = 'zitounn_abdelhak@yahoo.com';

export default function AboutScreen() {
  const { theme } = useTheme();
  // جلب رقم نسخة التطبيق من app.json تلقائيًا
  const appVersion = Constants.expoConfig?.version || '1.0.0';

  const openLink = (url: string) => {
    Linking.openURL(url).catch((err) => console.error('An error occurred: ', err));
  };

  const handlePayPalPress = () => {
    Alert.alert(
      'دعم عبر PayPal',
      `بيانات الدفع:\n${paypalEmail}\n\nهل تريد نسخ البريد الإلكتروني؟`,
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'نسخ',
          onPress: async () => {
            await Clipboard.setStringAsync(paypalEmail);
            Alert.alert('تم النسخ', 'تم نسخ عنوان البريد الإلكتروني');
          },
        },
        {
          text: 'فتح البريد',
          onPress: () => openLink(`mailto:${paypalEmail}`),
        },
      ]
    );
  };

  return (
    <Screen scrollable padding contentContainerStyle={{ paddingTop: 24 }}>
      <View style={[styles.contentContainer, { backgroundColor: theme.colors.background }]}>
        {/* Logo بدون borderRadius حتى لا تُقص الحواف */}
        <Image
          source={require('../../assets/images/icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* اسم التطبيق بصياغة موحّدة */}
        <Text style={[styles.appName, { color: theme.colors.primary }]}>HakooLab</Text>

        {/* وصف مختصر */}
        <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
          دليلك الذكي لحسابات ومعالجة المياه والتحلية — للمهندس والمشغّل والمختبر.
        </Text>

        {/* معلومات النسخة والمطوّر */}
        <Card style={styles.infoContainer}>
          <Text style={[styles.infoText, { color: theme.colors.text }]}>
            طوّره: عبدالحـق زيتون بدعم Ai ♥
          </Text>
          <Text style={[styles.infoText, { color: theme.colors.text }]}>
            إصدار النسخة: {appVersion}
          </Text>
        </Card>

        {/* قسم الدعم */}
        <Card
          style={[
            styles.supportContainer,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
          ]}
        >
          <Text style={[styles.supportTitle, { color: theme.colors.text }]}>دعم المشروع</Text>

          <TouchableOpacity
            style={styles.paypalContainer}
            onPress={handlePayPalPress}
            activeOpacity={0.7}
          >
            <Text style={[styles.paypalText, { color: theme.colors.textSecondary }]}>
              Support via PayPal: {paypalEmail}
            </Text>
          </TouchableOpacity>
        </Card>

        {/* روابط اجتماعية */}
        <View style={styles.socialContainer}>
          <TouchableOpacity
            style={[
              styles.socialButton,
              { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderWidth: 1 },
            ]}
            onPress={() => openLink(facebookUrl)}
          >
            <FontAwesome name="facebook-official" size={30} color="#1877F2" />
            <Text style={[styles.socialText, { color: theme.colors.text }]}>Facebook</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.socialButton,
              { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderWidth: 1 },
            ]}
            onPress={() => openLink(linkedinUrl)}
          >
            <FontAwesome5 name="linkedin" size={30} color="#0A66C2" />
            <Text style={[styles.socialText, { color: theme.colors.text }]}>LinkedIn</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    minHeight: '100%',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    // بدون borderRadius حتى لا تُقص الحواف
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  infoContainer: {
    marginTop: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    width: '100%',
    maxWidth: 420,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: '500',
  },
  supportContainer: {
    marginTop: 10,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    width: '100%',
    maxWidth: 420,
  },
  supportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  paypalContainer: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  paypalText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  socialContainer: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 20,
  },
  socialButton: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    alignItems: 'center',
    minWidth: 110,
  },
  socialText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 6,
    textAlign: 'center',
  },
});
