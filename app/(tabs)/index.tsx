import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

interface TestItem {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  category: string;
  component: string;
}

const categories = [
  { id: 'all', name: '全部', icon: 'apps' as keyof typeof Ionicons.glyphMap },
  { id: 'ui', name: 'UI组件', icon: 'library' as keyof typeof Ionicons.glyphMap },
  { id: 'network', name: '网络请求', icon: 'cloud' as keyof typeof Ionicons.glyphMap },
  { id: 'storage', name: '存储功能', icon: 'save' as keyof typeof Ionicons.glyphMap },
  { id: 'animation', name: '动画效果', icon: 'play' as keyof typeof Ionicons.glyphMap },
  { id: 'device', name: '设备功能', icon: 'phone-portrait' as keyof typeof Ionicons.glyphMap },
  { id: 'charts', name: '图表组件', icon: 'bar-chart' as keyof typeof Ionicons.glyphMap },
];

const testItems: TestItem[] = [
  {
    id: '1',
    title: '按钮组件测试',
    description: '各种类型按钮的样式和交互测试',
    icon: 'radio-button-on',
    category: 'ui',
    component: 'ButtonTest'
  },
  {
    id: '2',
    title: '输入框测试1',
    description: '文本输入、验证、格式化等功能',
    icon: 'create',
    category: 'ui',
    component: 'InputTest'
  },
  {
    id: '13',
    title: '输入框测试2',
    description: '文本输入最大字符',
    icon: 'create',
    category: 'ui',
    component: 'InputTest2'
  },
  {
    id: '3',
    title: '模态框测试',
    description: '弹窗、对话框、底部抽屉等',
    icon: 'layers',
    category: 'ui',
    component: 'ModalTest'
  },
  {
    id: '9',
    title: 'Product 商品组件',
    description: '商品展示、列表、详情',
    icon: 'layers',
    category: 'ui',
    component: 'ProductTest'
  },
  {
    id: '10',
    title: '布局学习 1',
    description: 'Flex布局',
    icon: 'layers',
    category: 'ui',
    component: 'Flex1Layout'
  },
  {
    id: '11',
    title: '布局学习 2',
    description: 'Flex布局',
    icon: 'layers',
    category: 'ui',
    component: 'Flex2Layout'
  },
  {
    id: '12',
    title: '布局学习 3',
    description: 'Flex布局',
    icon: 'layers',
    category: 'ui',
    component: 'Flex3Layout'
  },
  {
    id: '14',
    title: '条件布局学习 1',
    description: '条件布局',
    icon: 'layers',
    category: 'ui',
    component: 'Condition1Layout'
  },
  {
    id: '4',
    title: 'API请求测试',
    description: '网络请求、数据获取、错误处理',
    icon: 'cloud-download',
    category: 'network',
    component: 'ApiTest'
  },
  {
    id: '5',
    title: '本地存储测试',
    description: 'AsyncStorage、缓存管理',
    icon: 'folder',
    category: 'storage',
    component: 'StorageTest'
  },
  {
    id: '6',
    title: '过渡动画测试',
    description: '页面切换、元素动画效果',
    icon: 'trending-up',
    category: 'animation',
    component: 'AnimationTest'
  },
  {
    id: '7',
    title: '摄像头功能',
    description: '拍照、录像、图片处理',
    icon: 'camera',
    category: 'device',
    component: 'CameraTest'
  },
  {
    id: '8',
    title: '位置服务',
    description: '定位、地图、导航功能',
    icon: 'location',
    category: 'device',
    component: 'LocationTest'
  },
  {
    id: '15',
    title: '图表组件测试',
    description: '图表组件、折线图、柱状图、饼图等',
    icon: 'bar-chart',
    category: 'charts',
    component: 'LineChartTest'
  },
  {
    id: '16',
    title: '图表组件测试2',
    description: '图表组件、折线图、柱状图、饼图等',
    icon: 'bar-chart',
    category: 'charts',
    component: 'ChartKitDemo'
  },
  {
    id: '17',
    title: '图表组件测试3',
    description: '图表组件、折线图、柱状图、饼图等',
    icon: 'bar-chart',
    category: 'charts',
    component: 'ChartSVGDemo'
  },
];

export default function TabTwoScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');
  const router = useRouter();

  const filteredItems = selectedCategory === 'all'
    ? testItems
    : testItems.filter(item => item.category === selectedCategory);

  const handleTestItemPress = (item: TestItem) => {
    // 跳转到动态路由页面，并传递参数
    router.push({
      pathname: '/test/[component]' as any,
      params: {
        component: item.component,
        title: item.title,
        description: item.description,
        category: item.category
      }
    });
  };

  const renderTestItem = ({ item }: { item: TestItem }) => (
    <TouchableOpacity style={styles.testItem} onPress={() => handleTestItemPress(item)}>
      <View style={styles.testItemContent}>
        <View style={[styles.iconContainer, { backgroundColor: tintColor + '20' }]}>
          <Ionicons name={item.icon} size={24} color={tintColor} />
        </View>
        <View style={styles.testItemText}>
          <ThemedText type="defaultSemiBold" style={styles.testItemTitle}>
            {item.title}
          </ThemedText>
          <ThemedText style={styles.testItemDescription}>
            {item.description}
          </ThemedText>
        </View>
        <Ionicons name="chevron-forward" size={20} color={textColor} style={styles.chevron} />
      </View>
    </TouchableOpacity>
  );

  const renderCategory = (category: typeof categories[0]) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryButton,
        selectedCategory === category.id && { backgroundColor: tintColor + '20' }
      ]}
      onPress={() => setSelectedCategory(category.id)}
    >
      <Ionicons
        name={category.icon}
        size={18}
        color={selectedCategory === category.id ? tintColor : textColor}
      />
      <ThemedText
        style={[
          styles.categoryText,
          selectedCategory === category.id && { color: tintColor }
        ]}
      >
        {category.name}
      </ThemedText>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      {/* 顶部标题区域 */}
      <View style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>
          开发测试
        </ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          Demo 列表 · {filteredItems.length} 项
        </ThemedText>
      </View>

      {/* 分类标签 */}
      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map(renderCategory)}
        </ScrollView>
      </View>

      {/* 测试项目列表 */}
      <FlatList
        data={filteredItems}
        renderItem={renderTestItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  testItem: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  testItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  testItemText: {
    flex: 1,
  },
  testItemTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  testItemDescription: {
    fontSize: 14,
    opacity: 0.7,
  },
  chevron: {
    opacity: 0.5,
  },
});
