﻿import { useEffect } from "react";
import { Platform, BackHandler, View, Text } from "react-native";
import { router } from "expo-router";

export default function ExitScreen() {
  useEffect(() => {
    if (Platform.OS === "android") {
      BackHandler.exitApp();
    } else {
      router.replace("/");
    }
  }, []);
  return (
    <View style={{ flex:1, alignItems:"center", justifyContent:"center" }}>
      <Text>جاري إنهاء التطبيق...</Text>
    </View>
  );
}
