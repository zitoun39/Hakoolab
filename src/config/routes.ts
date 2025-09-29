export type CalculatorCategory = 
  | 'hydraulics' 
  | 'electrical' 
  | 'ro' 
  | 'dosing' 
  | 'indices' 
  | 'conversions';

export interface CalculatorRoute {
  id: string;
  title: string;
  description: string;
  category: CalculatorCategory;
  route: string;
  icon: string; // Lucide icon name
  tags: string[];
  featured?: boolean;
  difficulty?: 'basic' | 'intermediate' | 'advanced';
}

export const CALCULATOR_ROUTES: CalculatorRoute[] = [
  // Hydraulics & Pumps
  {
    id: 'flow-velocity',
    title: 'سرعة التدفق',
    description: 'حساب سرعة المائع في الأنابيب',
    category: 'hydraulics',
    route: '/calc/flow-velocity',
    icon: 'waves',
    tags: ['hydraulic', 'flow', 'velocity'],
    difficulty: 'basic',
    featured: true,
  },
  {
    id: 'pump-power',
    title: 'قدرة المضخة',
    description: 'حساب WHP و BHP للمضخات',
    category: 'hydraulics',
    route: '/calc/pump-power',
    icon: 'zap',
    tags: ['pump', 'whp', 'bhp'],
    difficulty: 'intermediate',
  },
  {
    id: 'tdh',
    title: 'الرفع الديناميكي الكلي',
    description: 'حساب TDH مع فواقد الاحتكاك',
    category: 'hydraulics',
    route: '/calc/tdh',
    icon: 'trending-up',
    tags: ['pump', 'tdh', 'losses'],
    difficulty: 'advanced',
  },

  // RO & Desalination
  {
    id: 'tds-converter',
    title: 'محول TDS',
    description: 'تحويل بين TDS والناقلية الكهربائية',
    category: 'ro',
    route: '/calc/tds-converter',
    icon: 'droplets',
    tags: ['RO', 'TDS', 'EC'],
    difficulty: 'basic',
    featured: true,
  },
  {
    id: 'ro-recovery',
    title: 'كفاءة استخلاص RO',
    description: 'حساب Recovery و Salt Rejection',
    category: 'ro',
    route: '/calc/ro-recovery',
    icon: 'percent',
    tags: ['RO', 'recovery', 'rejection'],
    difficulty: 'intermediate',
  },
  {
    id: 'osmotic-pressure',
    title: 'الضغط الأسموزي',
    description: 'حساب الضغط الأسموزي للمحاليل',
    category: 'ro',
    route: '/calc/osmotic-pressure',
    icon: 'gauge',
    tags: ['osmotic', 'pressure', 'solutions'],
    difficulty: 'intermediate',
  },

  // Chemical Dosing
  {
    id: 'chlorine-dose',
    title: 'جرعة الكلور',
    description: 'حساب معدل حقن الكلور',
    category: 'dosing',
    route: '/calc/chlorine-dose',
    icon: 'flask-conical',
    tags: ['chlorine', 'dosing', 'disinfection'],
    difficulty: 'basic',
  },
  {
    id: 'c1v1-dilution',
    title: 'تخفيف المحاليل',
    description: 'C1V1 = C2V2 حاسبة التخفيف',
    category: 'dosing',
    route: '/calc/c1v1',
    icon: 'beaker',
    tags: ['dilution', 'preparation', 'molarity'],
    difficulty: 'basic',
    featured: true,
  },
  {
    id: 'molecular-weight',
    title: 'الوزن الجزيئي',
    description: 'حساب الكتلة المولية للمركبات',
    category: 'dosing',
    route: '/calc/molecular-weight',
    icon: 'atom',
    tags: ['molecular', 'weight', 'chemistry'],
    difficulty: 'basic',
  },

  // Water Quality Indices
  {
    id: 'lsi',
    title: 'مؤشر لانجليير',
    description: 'حساب قابلية الماء للترسب أو التآكل',
    category: 'indices',
    route: '/calc/lsi',
    icon: 'activity',
    tags: ['LSI', 'scaling', 'corrosion'],
    difficulty: 'intermediate',
    featured: true,
  },

  // Electrical
  {
    id: 'three-phase',
    title: 'حسابات 3 فاز',
    description: 'تيار وقدرة المحركات ثلاثية الطور',
    category: 'electrical',
    route: '/calc/three-phase',
    icon: 'zap',
    tags: ['3phase', 'current', 'power'],
    difficulty: 'intermediate',
  },

  // Unit Conversions
  {
    id: 'pressure-converter',
    title: 'محول الضغط',
    description: 'تحويل وحدات الضغط المختلفة',
    category: 'conversions',
    route: '/calc/pressure-converter',
    icon: 'bar-chart-3',
    tags: ['pressure', 'conversion', 'units'],
    difficulty: 'basic',
  },
  {
    id: 'hardness-converter',
    title: 'محول الصلابة',
    description: 'تحويل وحدات صلابة الماء',
    category: 'conversions',
    route: '/calc/hardness-converter',
    icon: 'scale',
    tags: ['hardness', 'water', 'conversion'],
    difficulty: 'basic',
  },
];

export const CATEGORY_INFO = {
  hydraulics: {
    title: 'الهيدروليك والمضخات',
    color: '#1e40af',
    icon: 'waves',
    description: 'حسابات التدفق والمضخات والأنابيب',
  },
  electrical: {
    title: 'الكهرباء والطاقة',
    color: '#16a34a',
    icon: 'zap',
    description: 'حسابات التيار والقدرة والمحركات',
  },
  ro: {
    title: 'التحلية (RO)',
    color: '#f59e0b',
    icon: 'droplets',
    description: 'حسابات أنظمة التناضح العكسي',
  },
  dosing: {
    title: 'الجرعات الكيميائية',
    color: '#f97316',
    icon: 'flask-conical',
    description: 'حسابات المعالجة الكيميائية والجرعات',
  },
  indices: {
    title: 'مؤشرات جودة الماء',
    color: '#ef4444',
    icon: 'activity',
    description: 'مؤشرات الترسب والتآكل وجودة الماء',
  },
  conversions: {
    title: 'التحويلات',
    color: '#8b5cf6',
    icon: 'repeat',
    description: 'تحويل الوحدات المختلفة',
  },
} as const;

// Helper functions
export const getCalculatorsByCategory = (category: CalculatorCategory) => 
  CALCULATOR_ROUTES.filter(calc => calc.category === category);

export const getFeaturedCalculators = () => 
  CALCULATOR_ROUTES.filter(calc => calc.featured);

export const searchCalculators = (query: string) => 
  CALCULATOR_ROUTES.filter(calc => 
    calc.title.includes(query) || 
    calc.description.includes(query) ||
    calc.tags.some(tag => tag.includes(query))
  );

export const getCalculatorById = (id: string) => 
  CALCULATOR_ROUTES.find(calc => calc.id === id);