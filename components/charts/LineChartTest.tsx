// import React from 'react';
// import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
// import { LineChart, BarChart } from 'react-native-chart-kit';
// import { Ionicons } from '@expo/vector-icons';

// const screenWidth = Dimensions.get('window').width;

// export function LineChartTest() {
//     const data = {
//         labels: ["January", "February", "March", "April", "May", "June"],
//         datasets: [
//             {
//                 data: [
//                     Math.random() * 100,
//                     Math.random() * 100,
//                     Math.random() * 100,
//                     Math.random() * 100,
//                     Math.random() * 100,
//                     Math.random() * 100
//                 ],
//                 color: (opacity = 1) => `rgba(66, 185, 131, ${opacity})`, // optional
//                 strokeWidth: 2 // optional
//             }
//         ],
//         legend: ["Rainy Days"] // optional
//     };
//     const chartConfig = {
//         backgroundColor: "#ffffff",
//         backgroundGradientFrom: "#F8F9FA",
//         backgroundGradientTo: "#F8F9FA",
//         color: (opacity = 1) => `rgba(102, 172, 243, ${opacity})`,
//         strokeWidth: 2, // optional, default 3
//         barPercentage: 0.15, // 柱状图的宽度
//         useShadowColorFromDataset: false, // optional
//         propsForBackgroundLines: {
//             strokeDasharray: '',
//             stroke: '#ffffff4c',
//             strokeWidth: '1',
//             x1: 60,
//         }
//     };
//     return (
//         <View>
//             <View>
//                 <Text>Bezier Line Chart</Text>
//                 <LineChart
//                     data={data}
//                     width={screenWidth}
//                     height={220}
//                     chartConfig={chartConfig}
//                     style={{
//                         marginVertical: 18,
//                         borderRadius: 16
//                     }}
//                 />
//                 <BarChart
//                     data={data}
//                     width={screenWidth}
//                     height={220}
//                     chartConfig={chartConfig}
//                     style={{
//                         marginVertical: 18,
//                         borderRadius: 16
//                     }}
//                     showBarTops={false}
//                 />
//             </View>
//         </View>
//     )
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#F4F4F5',
//     }
// });

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const LineChartTest = () => {
  // 模拟数据 - 扭矩数据 (N·m)
  const torqueData = [265, 200, 180, 210, 150, 160, 130, 140, 170, 180, 120, 140, 160, 170, 220, 200, 90, 100, 110, 140, 130];
  
  // 模拟数据 - 转速数据 (rpm)
  const rpmData = [0, 0.5, 1.2, 1.0, 0.8, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 3.8, 3.5, 2.8, 2.0, 1.8, 1.5, 1.0, 0.5, 0.2, 0];

  // 时间标签
  const timeLabels = ['0', '2', '4', '6', '8', '10', '12', '14', '16', '18', '20', '22', '24', '26', '28', '30', '32', '34', '36', '38', '40'];

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(54, 162, 235, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
  };

  const rpmChartConfig = {
    ...chartConfig,
    color: (opacity = 1) => `rgba(26, 188, 156, ${opacity})`,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>扭矩与转速监测图表</Text>
      
      {/* 扭矩图表 */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>扭矩 (N·m)</Text>
        <BarChart
          data={{
            labels: timeLabels.filter((_, index) => index % 4 === 0), // 每4个显示一个标签
            datasets: [{
              data: torqueData.filter((_, index) => index % 4 === 0)
            }]
          }}
          width={screenWidth - 40}
          height={200}
          chartConfig={chartConfig}
          style={styles.chart}
          showValuesOnTopOfBars={false}
        />
      </View>

      {/* 转速图表 */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>转速 (rpm)</Text>
        <LineChart
          data={{
            labels: timeLabels.filter((_, index) => index % 4 === 0),
            datasets: [{
              data: rpmData.filter((_, index) => index % 4 === 0),
              color: (opacity = 1) => `rgba(26, 188, 156, ${opacity})`,
              strokeWidth: 3
            }]
          }}
          width={screenWidth - 40}
          height={200}
          chartConfig={rpmChartConfig}
          style={styles.chart}
          bezier
        />
      </View>

      {/* 图例 */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: 'rgba(54, 162, 235, 1)' }]} />
          <Text style={styles.legendText}>扭矩 (N·m)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: 'rgba(26, 188, 156, 1)' }]} />
          <Text style={styles.legendText}>转速 (rpm)</Text>
        </View>
      </View>
      
      <Text style={styles.timeLabel}>时间 (分钟)</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  chartContainer: {
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
    color: '#666',
  },
  chart: {
    borderRadius: 10,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  timeLabel: {
    marginTop: 15,
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
});

export {LineChartTest};