// app/(drawer)/_layout.tsx
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { DrawerActions } from "@react-navigation/native";
import { Drawer } from "expo-router/drawer";
import { Feather } from "@expo/vector-icons";
import Constants from "expo-constants";
import {
  DrawerContentScrollView,
  DrawerItemList,
  // DrawerToggleButton, // لم نعد نحتاجه
  type DrawerContentComponentProps,
} from "@react-navigation/drawer";
import { useTheme } from "@/src/contexts/ThemeContext";
import { ThemeToggle } from "@/src/components/ui/ThemeToggle";

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { theme } = useTheme();

  const appVersion = Constants.expoConfig?.version || "1.0.0";
  const versionCode = Constants.expoConfig?.android?.versionCode;
  const versionText = versionCode ? `v${appVersion} (${versionCode})` : `v${appVersion}`;

  return (
    <DrawerContentScrollView
      {...props}
      style={{ backgroundColor: theme.colors.surface }}
      contentContainerStyle={{ flex: 1 }}
    >
      {/* Header */}
      <View style={[styles.drawerHeader, { backgroundColor: theme.colors.primary }]}>

        <Text style={styles.drawerHeaderSubtitle}>رفيقك الهندسي</Text>
      </View>

      {/* Theme Toggle */}
      <View style={styles.themeToggleContainer}>
        <ThemeToggle />
      </View>

      {/* Navigation Items */}
      <View style={{ flex: 1 }}>
        <DrawerItemList {...props} />
      </View>

      {/* Footer with automatic version */}
      <View style={[styles.drawerFooter, { borderTopColor: theme.colors.border }]}>
        <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
          إصدار {versionText}
        </Text>
      </View>
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  const { theme } = useTheme();

  return (
        <Drawer
          screenOptions={({ navigation, route }) => ({
            headerShown: true,
            headerTitle: "HakooLab",
            headerStyle: { backgroundColor: theme.colors.primary },
            headerTintColor: "#fff",
            headerLeft: () => null,
            headerRight: () => (
              <Pressable
                onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
                style={{ paddingHorizontal: 12, paddingVertical: 8 }}
              >
                <Feather name="menu" size={22} color="#fff" />
              </Pressable>
            ),
            drawerPosition: "right",
            drawerType: "front",
            swipeEnabled: true,
            swipeEdgeWidth: 50,
          })}
        >
      <Drawer.Screen
        name="index"

        options={{
          drawerLabel: "الرئيسية",
          drawerIcon: ({ color, size }) => <Feather name="home" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="favorites"
        options={{
          drawerLabel: "المفضّلة",
          drawerIcon: ({ color, size }) => <Feather name="star" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="contact"
        options={{
          drawerLabel: "الاتصال والدعم الفني",
          drawerIcon: ({ color, size }) => <Feather name="phone" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="about"
        options={{
          drawerLabel: "حول التطبيق",
          drawerIcon: ({ color, size }) => <Feather name="info" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="exit"
        options={{
          drawerLabel: "الخروج",
          drawerIcon: ({ color, size }) => <Feather name="log-out" size={size} color={color} />,
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawerHeader: { padding: 20, paddingTop: 60, marginBottom: 16 },
  drawerHeaderTitle: { color: "#ffffff", fontSize: 24, fontWeight: "bold", textAlign: "right" },
  drawerHeaderSubtitle: { color: "#e2e8f0", fontSize: 14, textAlign: "right", marginTop: 4 },
  themeToggleContainer: { paddingHorizontal: 12, paddingVertical: 8, marginBottom: 8 },
  drawerFooter: { borderTopWidth: 1, padding: 16, marginTop: "auto" },
  footerText: { fontSize: 12, textAlign: "right" },
});
