import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Svg, {
  G,
  Rect,
  Line,
  Text as SvgText,
  Path,
  Circle,
  Defs,
  LinearGradient,
  Stop
} from 'react-native-svg';

const { width: screenWidth } = Dimensions.get('window');

const ChartSVGDemo = ({ 
  showLinePoints = false,  // 控制是否显示折线图的圆点
  pointRadius = 3,         // 圆点半径
  pointColor = '#1ABC9C',  // 圆点颜色
  pointStrokeWidth = 2     // 圆点描边宽度
} = {}) => {
  // 图表尺寸配置
  const chartWidth = screenWidth - 40;
  const chartHeight = 300;
  const paddingLeft = 60;
  const paddingRight = 60;
  const paddingTop = 20;
  const paddingBottom = 60;
  
  const plotWidth = chartWidth - paddingLeft - paddingRight;
  const plotHeight = chartHeight - paddingTop - paddingBottom;

  // 模拟数据
  const data = [
    { time: 0, torque: 265, rpm: 0 },
    { time: 2, torque: 200, rpm: 0.5 },
    { time: 4, torque: 180, rpm: 1.2 },
    { time: 6, torque: 210, rpm: 1.0 },
    { time: 8, torque: 150, rpm: 0.8 },
    { time: 10, torque: 160, rpm: 1.5 },
    { time: 12, torque: 130, rpm: 2.0 },
    { time: 14, torque: 140, rpm: 2.5 },
    { time: 16, torque: 170, rpm: 3.0 },
    { time: 18, torque: 180, rpm: 3.5 },
    { time: 20, torque: 120, rpm: 4.0 },
    { time: 22, torque: 140, rpm: 3.8 },
    { time: 24, torque: 160, rpm: 3.5 },
    { time: 26, torque: 170, rpm: 2.8 },
    { time: 28, torque: 220, rpm: 2.0 },
    { time: 30, torque: 200, rpm: 1.8 },
    { time: 32, torque: 90, rpm: 1.5 },
    { time: 34, torque: 100, rpm: 1.0 },
    { time: 36, torque: 110, rpm: 0.5 },
    { time: 38, torque: 140, rpm: 0.2 },
    { time: 40, torque: 130, rpm: 0 }
  ];

  const [selectedPoint, setSelectedPoint] = useState(null);

  // 数据范围
  const maxTorque = Math.max(...data.map(d => d.torque));
  const minTorque = 0;
  const maxRpm = Math.max(...data.map(d => d.rpm));
  const minRpm = 0;
  const maxTime = Math.max(...data.map(d => d.time));

  // 坐标转换函数
  const getX = (time) => paddingLeft + (time / maxTime) * plotWidth;
  const getTorqueY = (torque) => paddingTop + plotHeight - ((torque - minTorque) / (maxTorque - minTorque)) * plotHeight;
  const getRpmY = (rpm) => paddingTop + plotHeight - ((rpm - minRpm) / (maxRpm - minRpm)) * plotHeight;

  // 生成柱状图
  const renderBars = () => {
    const barWidth = plotWidth / data.length * 0.6;
    
    return data.map((point, index) => {
      const x = getX(point.time) - barWidth / 2;
      const y = getTorqueY(point.torque);
      const height = plotHeight - (y - paddingTop);
      
      return (
        <Rect
          key={`bar-${index}`}
          x={x}
          y={y}
          width={barWidth}
          height={height}
          fill="url(#torqueGradient)"
          opacity={0.8}
          onPress={() => setSelectedPoint(index)}
        />
      );
    });
  };

  // 生成折线图路径
  const generateLinePath = () => {
    let path = '';
    data.forEach((point, index) => {
      const x = getX(point.time);
      const y = getRpmY(point.rpm);
      
      if (index === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    });
    return path;
  };

  // 生成折线图点 - 现在受参数控制
  const renderLinePoints = () => {
    if (!showLinePoints) return null; // 如果不显示点，直接返回null
    
    return data.map((point, index) => {
      const x = getX(point.time);
      const y = getRpmY(point.rpm);
      
      return (
        <Circle
          key={`point-${index}`}
          cx={x}
          cy={y}
          r={pointRadius}
          fill={pointColor}
          stroke="#fff"
          strokeWidth={pointStrokeWidth}
          onPress={() => setSelectedPoint(index)}
        />
      );
    });
  };

  // 生成网格线
  const renderGrid = () => {
    const horizontalLines = [];
    const verticalLines = [];

    // 水平网格线 (扭矩)
    for (let i = 0; i <= 5; i++) {
      const y = paddingTop + (plotHeight / 5) * i;
      horizontalLines.push(
        <Line
          key={`hgrid-${i}`}
          x1={paddingLeft}
          y1={y}
          x2={paddingLeft + plotWidth}
          y2={y}
          stroke="#e0e0e0"
          strokeWidth={0.5}
        />
      );
    }

    // 垂直网格线 (时间)
    for (let i = 0; i <= 8; i++) {
      const x = paddingLeft + (plotWidth / 8) * i;
      verticalLines.push(
        <Line
          key={`vgrid-${i}`}
          x1={x}
          y1={paddingTop}
          x2={x}
          y2={paddingTop + plotHeight}
          stroke="#e0e0e0"
          strokeWidth={0.5}
        />
      );
    }

    return [...horizontalLines, ...verticalLines];
  };

  // 生成坐标轴标签
  const renderAxisLabels = () => {
    const labels = [];

    // 左Y轴标签 (扭矩)
    for (let i = 0; i <= 5; i++) {
      const value = (maxTorque / 5) * (5 - i);
      const y = paddingTop + (plotHeight / 5) * i;
      
      labels.push(
        <SvgText
          key={`left-label-${i}`}
          x={paddingLeft - 10}
          y={y + 3}
          fontSize="10"
          fill="#666"
          textAnchor="end"
        >
          {Math.round(value)}
        </SvgText>
      );
    }

    // 右Y轴标签 (转速)
    for (let i = 0; i <= 4; i++) {
      const value = (maxRpm / 4) * (4 - i);
      const y = paddingTop + (plotHeight / 4) * i;
      
      labels.push(
        <SvgText
          key={`right-label-${i}`}
          x={paddingLeft + plotWidth + 10}
          y={y + 3}
          fontSize="10"
          fill="#1ABC9C"
          textAnchor="start"
        >
          {value.toFixed(1)}
        </SvgText>
      );
    }

    // X轴标签 (时间)
    for (let i = 0; i <= 8; i++) {
      const value = (maxTime / 8) * i;
      const x = paddingLeft + (plotWidth / 8) * i;
      
      labels.push(
        <SvgText
          key={`bottom-label-${i}`}
          x={x}
          y={paddingTop + plotHeight + 20}
          fontSize="10"
          fill="#666"
          textAnchor="middle"
        >
          {Math.round(value)}
        </SvgText>
      );
    }

    return labels;
  };

  // 渲染坐标轴
  const renderAxes = () => {
    return (
      <G>
        {/* 左Y轴 */}
        <Line
          x1={paddingLeft}
          y1={paddingTop}
          x2={paddingLeft}
          y2={paddingTop + plotHeight}
          stroke="#666"
          strokeWidth={1}
        />
        
        {/* 右Y轴 */}
        <Line
          x1={paddingLeft + plotWidth}
          y1={paddingTop}
          x2={paddingLeft + plotWidth}
          y2={paddingTop + plotHeight}
          stroke="#1ABC9C"
          strokeWidth={1}
        />
        
        {/* X轴 */}
        <Line
          x1={paddingLeft}
          y1={paddingTop + plotHeight}
          x2={paddingLeft + plotWidth}
          y2={paddingTop + plotHeight}
          stroke="#666"
          strokeWidth={1}
        />
      </G>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>扭矩与转速监测图表</Text>
      
      <View style={styles.chartContainer}>
        <Svg width={chartWidth} height={chartHeight}>
          <Defs>
            <LinearGradient id="torqueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#3498DB" stopOpacity={1} />
              <Stop offset="100%" stopColor="#5DADE2" stopOpacity={0.6} />
            </LinearGradient>
          </Defs>
          
          {/* 网格线 */}
          <G>
            {renderGrid()}
          </G>
          
          {/* 坐标轴 */}
          {renderAxes()}
          
          {/* 柱状图 (扭矩) */}
          <G>
            {renderBars()}
          </G>
          
          {/* 折线图 (转速) */}
          <G>
            <Path
              d={generateLinePath()}
              stroke="#1ABC9C"
              strokeWidth={2.5}
              fill="none"
            />
            {renderLinePoints()}
          </G>
          
          {/* 坐标轴标签 */}
          <G>
            {renderAxisLabels()}
          </G>
          
          {/* 轴标题 */}
          <SvgText
            x={paddingLeft - 40}
            y={paddingTop + plotHeight / 2}
            fontSize="12"
            fill="#666"
            textAnchor="middle"
            transform={`rotate(-90, ${paddingLeft - 40}, ${paddingTop + plotHeight / 2})`}
          >
            扭矩 (N·m)
          </SvgText>
          
          <SvgText
            x={paddingLeft + plotWidth + 40}
            y={paddingTop + plotHeight / 2}
            fontSize="12"
            fill="#1ABC9C"
            textAnchor="middle"
            transform={`rotate(90, ${paddingLeft + plotWidth + 40}, ${paddingTop + plotHeight / 2})`}
          >
            转速 (rpm)
          </SvgText>
          
          <SvgText
            x={paddingLeft + plotWidth / 2}
            y={paddingTop + plotHeight + 45}
            fontSize="12"
            fill="#666"
            textAnchor="middle"
          >
            时间 (分钟)
          </SvgText>
        </Svg>
      </View>

      {/* 图例 */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#3498DB' }]} />
          <Text style={styles.legendText}>扭矩 (N·m)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#1ABC9C' }]} />
          <Text style={styles.legendText}>转速 (rpm)</Text>
        </View>
      </View>

      {/* 选中点信息 */}
      {selectedPoint !== null && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            时间: {data[selectedPoint].time}分钟
          </Text>
          <Text style={styles.infoText}>
            扭矩: {data[selectedPoint].torque} N·m
          </Text>
          <Text style={styles.infoText}>
            转速: {data[selectedPoint].rpm} rpm
          </Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedPoint(null)}
          >
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: 50,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 20,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 2,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    position: 'relative',
    minWidth: 200,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  closeButton: {
    position: 'absolute',
    top: 5,
    right: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#999',
    fontWeight: 'bold',
  },
});

export {ChartSVGDemo};