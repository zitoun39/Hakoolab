import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/src/components/ui';
import { useTheme } from '@/src/contexts/ThemeContext';

const contactOptions = [
  'الإبلاغ عن خلل تقني',
  'اقتراح إضافة حاسبة جديدة',
  'خطأ في نتائج إحدى الحاسبات',
  'استفسار عام',
];

export default function ContactScreen() {
  const { theme } = useTheme();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSendWhatsApp = () => {
    if (!selectedOption) {
      Alert.alert("خطأ", "يرجى اختيار سبب التواصل أولاً.");
      return;
    }

    const phoneNumber = "+213558445757"; 
    const message = `مرحباً، لدي طلب بخصوص تطبيق hakoolab:\n\n- سبب التواصل: ${selectedOption}`;
    const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

    Linking.openURL(url).catch(() => {
      Alert.alert("خطأ", "تأكد من أن تطبيق واتساب مثبت على جهازك.");
    });
  };

  return (
    <Screen contentContainerStyle={{ paddingTop: 24 }}>
      <Text style={[styles.title, { color: theme.colors.text }]}>اختر سبب التواصل</Text>
      <View style={styles.optionsContainer}>
        {contactOptions.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              { 
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border 
              },
              selectedOption === option && {
                backgroundColor: `${theme.colors.primary}20`,
                borderColor: theme.colors.primary
              },
            ]}
            onPress={() => setSelectedOption(option)}
          >
            <Text
              style={[
                styles.optionText,
                { color: theme.colors.text },
                selectedOption === option && {
                  color: theme.colors.primary,
                  fontWeight: 'bold'
                },
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.sendButton} onPress={handleSendWhatsApp}>
        <Text style={styles.sendButtonText}>إرسال عبر واتساب</Text>
        <Ionicons name="logo-whatsapp" size={24} color="white" style={{ marginLeft: 10 }} />
      </TouchableOpacity>
    </Screen>
  );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    optionsContainer: {
        marginBottom: 30,
    },
    optionButton: {
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
    },
    optionText: {
        fontSize: 16,
        textAlign: 'right',
    },
    sendButton: {
        backgroundColor: '#25D366',
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 12,
    },
    sendButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});