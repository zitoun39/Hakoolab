import React, { useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from "react-native";
import { router, useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";

// أيقونات بنفس نمطك القديم
import {
  Search,
  Menu,
  Droplets,
  Calculator,
  Activity,
  Atom,
  Gauge,
  Ruler,
  Square,
  Package,
  Scale,
  Thermometer,
  BarChart3,
  Zap,
  Waves,
  FlaskConical,
} from "lucide-react-native";

type CalcItem = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  tags: string[];
};

type Group = {
  id: string;
  title: string;
  color: string;
  items: CalcItem[];
};

const GROUPS: Group[] = [
  {
    id: "hydraulics",
    title: "🟦 الهيدروليك والمضخات",
    color: "#1e40af",
    items: [
      {
        id: "process-flow",
        title: "حسابات تدفق العمليات",
        description: "حساب العلاقة بين سرعة المائع ومعدل التدفق",
        icon: <Waves color="#ffffff" size={24} />,
        route: "/calculators/process-flow",
        tags: ["hydraulic", "flow", "سرعة", "تدفق"],
      },
      {
        id: "pressure-converter",
        title: "محول الضغط",
        description: "التحويل بين وحدات الضغط المختلفة",
        icon: <BarChart3 color="#ffffff" size={24} />,
        route: "/calculators/pressure-converter",
        tags: ["ضغط", "bar", "kPa", "psi"],
      },
      // أضف أي حاسبات هيدروليك أخرى لديك هنا بنفس النمط
    ],
  },
  {
    id: "electrical",
    title: "🟩 الكهرباء والطاقة",
    color: "#16a34a",
    items: [
      {
        id: "ideal-gas-law", // لو غير موجود لديك احذفه
        title: "قانون الغازات المثالية",
        description: "حل معادلة الغازات المثالية لأي متغير",
        icon: <Zap color="#ffffff" size={24} />,
        route: "/calculators/ideal-gas-law",
        tags: ["طاقة", "غاز", "PV=nRT"],
      },
      // مثال: لو عندك شاشة تيار 3 فاز أضفها:
      // {
      //   id: "three-phase",
      //   title: "تيار 3 فاز و kVA",
      //   description: "تقدير التيار والقدرة الظاهرية حسب pf والكفاءة",
      //   icon: <Zap color="#ffffff" size={24} />,
      //   route: "/calculators/three-phase",
      //   tags: ["3phase", "kVA", "pf", "current"],
      // },
    ],
  },
  {
    id: "ro",
    title: "🟨 التحلية (RO)",
    color: "#f59e0b",
    items: [
      {
        id: "tds",
        title: "محول TDS والناقلية",
        description: "تحويل بين مجموع الأملاح الذائبة والناقلية الكهربائية",
        icon: <Droplets color="#ffffff" size={24} />,
        route: "/calculators/tds-converter",
        tags: ["RO", "TDS", "EC", "تحويل"],
      },
      {
        id: "osmotic-pressure",
        title: "حاسبة الضغط الأسموزي",
        description: "حساب الضغط الأسموزي للمحاليل",
        icon: <Gauge color="#ffffff" size={24} />,
        route: "/calculators/osmotic-pressure",
        tags: ["RO", "osmotic", "π", "ضغط"],
      },
    ],
  },
  {
    id: "dosing",
    title: "🟧 الجرعات الكيميائية",
    color: "#f97316",
    items: [
      {
        id: "molecular-weight",
        title: "حاسبة الوزن الجزيئي",
        description: "حساب الوزن الجزيئي للمركبات الكيميائية",
        icon: <Atom color="#ffffff" size={24} />,
        route: "/calculators/molecular-weight",
        tags: ["جرعات", "MW", "molar", "كيمياء"],
      },
      // لو عندك C1V1 أضفها:
      // {
      //   id: "c1v1",
      //   title: "C1V1 = C2V2 (تخفيف)",
      //   description: "أدخل 3 قيم واحسب الرابعة",
      //   icon: <FlaskConical color="#ffffff" size={24} />,
      //   route: "/calculators/c1v1",
      //   tags: ["dosing", "dilution", "تحضير"],
      // },
    ],
  },
  {
    id: "indices",
    title: "🟥 مؤشرات الترسب والتآكل",
    color: "#ef4444",
    items: [
      {
        id: "lsi",
        title: "مؤشر لانجليير للتشبع",
        description: "حساب قابلية الماء للترسيب أو التآكل",
        icon: <Activity color="#ffffff" size={24} />,
        route: "/calculators/lsi-calculator",
        tags: ["LSI", "RSI", "ترسب", "تآكل"],
      },
    ],
  },
  {
    id: "conversions",
    title: "🟪 التحويلات والوحدات",
    color: "#8b5cf6",
    items: [
      {
        id: "hardness",
        title: "محول عسر الماء",
        description: "تحويل بين وحدات عسر الماء المختلفة",
        icon: <Calculator color="#ffffff" size={24} />,
        route: "/calculators/hardness-converter",
        tags: ["عسر", "صلابة", "dH", "CaCO3"],
      },
      {
        id: "length-converter",
        title: "محول وحدات الطول",
        description: "التحويل السريع بين مختلف وحدات قياس الطول",
        icon: <Ruler color="#ffffff" size={24} />,
        route: "/calculators/length-converter",
        tags: ["طول", "mm", "cm", "m"],
      },
      {
        id: "surface-calculator",
        title: "حاسبة المساحة",
        description: "حساب مساحة الأشكال الهندسية الشائعة",
        icon: <Square color="#ffffff" size={24} />,
        route: "/calculators/surface-calculator",
        tags: ["مساحة", "هندسة", "surface"],
      },
      {
        id: "volume-converter",
        title: "محول وحدات الحجم",
        description: "التحويل بين وحدات الحجم المختلفة",
        icon: <Package color="#ffffff" size={24} />,
        route: "/calculators/volume-converter",
        tags: ["حجم", "L", "m3", "gal"],
      },
      {
        id: "mass-converter",
        title: "محول الكتلة",
        description: "التحويل بين مختلف وحدات قياس الكتلة",
        icon: <Scale color="#ffffff" size={24} />,
        route: "/calculators/mass-converter",
        tags: ["كتلة", "kg", "g", "lb"],
      },
      {
        id: "temperature-converter",
        title: "محول درجة الحرارة",
        description: "التحويل بين وحدات الحرارة الأساسية",
        icon: <Thermometer color="#ffffff" size={24} />,
        route: "/calculators/temperature-converter",
        tags: ["حرارة", "C", "F", "K"],
      },
      {
        id: "volume-flow-converter",
        title: "محول وحدات تدفق الحجم",
        description: "التحويل بين وحدات قياس معدل التدفق الحجمي",
        icon: <FlaskConical color="#ffffff" size={24} />,
        route: "/calculators/volume-flow-converter",
        tags: ["تدفق", "m3/h", "L/s", "gpm"],
      },
    ],
  },
];

export default function HomeGroupedScreen() {
  const navigation = useNavigation();
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    if (!q.trim()) return GROUPS;
    const k = q.trim().toLowerCase();
    return GROUPS.map((g) => ({
      ...g,
      items: g.items.filter(
        (it) =>
          it.title.toLowerCase().includes(k) ||
          it.description.toLowerCase().includes(k) ||
          it.tags.join(" ").toLowerCase().includes(k)
      ),
    })).filter((g) => g.items.length > 0);
  }, [q]);

  const go = (route: string) => router.push(route as any);
  const openDrawer = () => navigation.dispatch(DrawerActions.openDrawer());

  return (
    <SafeAreaView style={styles.container}>
      {/* الهيدر الأزرق */}
      <View style={styles.header}>
        <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
          <Menu color="#ffffff" size={30} />
        </TouchableOpacity>
        <Text style={styles.title}>hakoolab</Text>
        <Text style={styles.subtitle}>رفيقك لتحليل ومعالجة المياه</Text>
      </View>

      {/* البحث */}
      <View className="search-container" style={styles.searchContainer}>
        <Search color="#64748b" size={20} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="ابحث بالاسم أو الوسوم (RO، TDS، LSI، gpm...)"
          placeholderTextColor="#64748b"
          value={q}
          onChangeText={setQ}
        />
      </View>

      {/* القوائم المجمّعة */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.groupsWrap}>
          {filtered.map((g) => (
            <View key={g.id} style={styles.groupBlock}>
              <Text style={[styles.groupTitle, { color: g.color }]}>{g.title}</Text>
              {g.items.map((it) => (
                <TouchableOpacity
                  key={it.id}
                  style={styles.card}
                  onPress={() => go(it.route)}
                  activeOpacity={0.7}
                >
                  <View style={styles.cardIcon}>{it.icon}</View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{it.title}</Text>
                    <Text style={styles.cardDesc}>{it.description}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            مصمم للمختبرات ومحطات تحلية المياه في الجزائر
          </Text>
          <Text style={styles.creditText}>عبدالحق زيتون ♥ Ai</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: "#1e40af",
  },
  menuButton: { position: "absolute", left: 20, top: 40 },
  title: { fontSize: 32, fontWeight: "bold", color: "#ffffff", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#e2e8f0", textAlign: "center" },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 5,
  },
  searchIcon: { marginRight: 12 },
  searchInput: { flex: 1, fontSize: 16, color: "#1e293b", textAlign: "right" },

  groupsWrap: { paddingHorizontal: 20, paddingBottom: 10 },
  groupBlock: { marginBottom: 12 },
  groupTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 20,
    marginBottom: 10,
    borderRadius: 16,
    elevation: 5,
  },
  cardIcon: {
    width: 56,
    height: 56,
    backgroundColor: "#0891b2",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
    textAlign: "right",
  },
  cardDesc: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "right",
    lineHeight: 20,
  },

  footer: { padding: 20, alignItems: "center" },
  footerText: { fontSize: 12, color: "#64748b", textAlign: "center" },
  creditText: { fontSize: 12, color: "#9ca3af", marginTop: 5 },
});
