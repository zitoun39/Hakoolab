﻿import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { X } from "lucide-react-native";

export default function InfoModalScreen() {
  const { title, formula } = useLocalSearchParams<{
    title: string;
    formula: string;
  }>();

  const handleClose = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <X color="#ffffff" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formulaContainer}>
          <Text style={styles.formulaTitle}>الصيغة المستخدمة:</Text>
          <Text style={styles.formulaText}>{formula}</Text>
        </View>

        <View style={styles.noteContainer}>
          <Text style={styles.noteTitle}>ملاحظات مهمة:</Text>
          <Text style={styles.noteText}>
            • تأكد من دقة القيم المدخلة للحصول على نتائج صحيحة
          </Text>
          <Text style={styles.noteText}>
            • هذه الحاسبات مصممة للاستخدام المهني في المختبرات
          </Text>
          <Text style={styles.noteText}>
            • في حالة الشك، راجع المعايير المحلية والدولية
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1e40af",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    flex: 1,
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  formulaContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  formulaTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 12,
    textAlign: "right",
  },
  formulaText: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 24,
    textAlign: "right",
    fontFamily: "monospace",
  },
  noteContainer: {
    backgroundColor: "#fef3c7",
    borderRadius: 16,
    padding: 20,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#92400e",
    marginBottom: 12,
    textAlign: "right",
  },
  noteText: {
    fontSize: 14,
    color: "#92400e",
    marginBottom: 8,
    textAlign: "right",
    lineHeight: 20,
  },
});
