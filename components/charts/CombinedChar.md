### 安装依赖
```
npm install react-native-svg prop-types
# 对于iOS
cd ios && pod install
```

### 基本使用

```
import CombinedChart from './CombinedChart';

// 数据格式 - 第一个字段作为X轴，第二个作为柱状图，第三个作为折线图
const sampleData = [
  { time: 0, torque: 265, rpm: 0 },
  { time: 2, torque: 200, rpm: 0.5 },
  { time: 4, torque: 180, rpm: 1.2 },
  // ... 更多数据
];

// 基本用法
<CombinedChart data={sampleData} />

// 自定义样式
<CombinedChart 
  data={sampleData}
  barColor="#E74C3C"
  lineColor="#2ECC71"
  showLinePoints={true}
  leftAxisLabel="压力 (Pa)"
  rightAxisLabel="流量 (L/min)"
  bottomAxisLabel="时间 (秒)"
  legendBarLabel="压力"
  legendLineLabel="流量"
/>
```

### 完整配置示例
```
<CombinedChart 
  // 数据
  data={yourData}
  
  // 图表尺寸
  width={350}
  height={280}
  
  // 柱状图配置
  barColor="#3498DB"
  barBorderRadius={6}
  useBarGradient={false}
  
  // 折线图配置
  lineColor="#E74C3C"
  lineWidth={3}
  showLinePoints={true}
  pointRadius={4}
  pointColor="#E74C3C"
  
  // 标签配置
  leftAxisLabel="温度 (°C)"
  rightAxisLabel="湿度 (%)"
  bottomAxisLabel="时间 (小时)"
  legendBarLabel="温度"
  legendLineLabel="湿度"
  
  // 交互配置
  enableInteraction={true}
  onPointPress={(point, index, type) => {
    console.log('点击了', type, '数据:', point);
  }}
  
  // 样式配置
  backgroundColor="#f8f9fa"
  showGrid={true}
  showLegend={true}
/>
```

### 数据格式要求
数据必须是对象数组，组件会自动检测：

- 第1个字段: X轴数据
- 第2个字段: 柱状图数据（左Y轴）
- 第3个字段: 折线图数据（右Y轴）

```
// 示例1: 时间序列数据
const timeSeriesData = [
  { timestamp: 1, temperature: 25, humidity: 60 },
  { timestamp: 2, temperature: 27, humidity: 58 },
];

// 示例2: 分类数据
const categoryData = [
  { month: '1月', sales: 1000, growth: 5.2 },
  { month: '2月', sales: 1200, growth: 3.8 },
];
```