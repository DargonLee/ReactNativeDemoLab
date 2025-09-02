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
import PropTypes from 'prop-types';

const { width: screenWidth } = Dimensions.get('window');

/**
 * 通用SVG组合图表组件
 * 支持柱状图 + 折线图的组合显示，双Y轴
 */
const CombinedChart = ({
  // 数据相关
  data = [],
  
  // 图表尺寸
  width = screenWidth - 40,
  height = 300,
  
  // 内边距
  paddingLeft = 60,
  paddingRight = 60,
  paddingTop = 20,
  paddingBottom = 60,
  
  // 柱状图配置
  barColor = '#3498DB',
  barOpacity = 0.8,
  barBorderRadius = 4,
  useBarGradient = false,
  barGradientColors = ['#3498DB', '#5DADE2'],
  barGradientOpacities = [1, 0.6],
  
  // 折线图配置
  lineColor = '#1ABC9C',
  lineWidth = 2.5,
  showLinePoints = false,
  pointRadius = 3,
  pointColor = '#1ABC9C',
  pointStrokeColor = '#fff',
  pointStrokeWidth = 2,
  
  // 坐标轴配置
  leftAxisLabel = '扭矩 (N·m)',
  rightAxisLabel = '转速 (rpm)',
  bottomAxisLabel = '时间 (分钟)',
  leftAxisColor = '#666',
  rightAxisColor = '#1ABC9C',
  axisLabelColor = '#666',
  axisLabelSize = 12,
  tickLabelSize = 10,
  
  // 网格配置
  showGrid = true,
  gridColor = '#e0e0e0',
  gridOpacity = 0.5,
  
  // 交互配置
  enableInteraction = true,
  
  // 样式配置
  backgroundColor = 'white',
  containerStyle = {},
  
  // 回调函数
  onPointPress = null,
  
  // 图例配置
  showLegend = true,
  legendBarLabel = '柱状数据',
  legendLineLabel = '折线数据'
}) => {
  
  const [selectedPoint, setSelectedPoint] = useState(null);
  
  // 图表绘制区域尺寸
  const plotWidth = width - paddingLeft - paddingRight;
  const plotHeight = height - paddingTop - paddingBottom;

  // 数据验证
  if (!data || data.length === 0) {
    return (
      <View style={[styles.container, containerStyle]}>
        <Text style={styles.noDataText}>暂无数据</Text>
      </View>
    );
  }

  // 提取数据字段名（自动检测）
  const sampleItem = data[0];
  const keys = Object.keys(sampleItem);
  
  // 假设第一个字段是X轴，第二个是柱状图数据，第三个是折线图数据
  const xKey = keys[0];
  const barKey = keys[1];
  const lineKey = keys[2];

  // 计算数据范围
  const xValues = data.map(d => d[xKey]);
  const barValues = data.map(d => d[barKey]);
  const lineValues = data.map(d => d[lineKey]);
  
  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const barMin = 0; // 柱状图通常从0开始
  const barMax = Math.max(...barValues);
  const lineMin = Math.min(...lineValues);
  const lineMax = Math.max(...lineValues);

  // 坐标转换函数
  const getX = (value) => paddingLeft + ((value - xMin) / (xMax - xMin)) * plotWidth;
  const getBarY = (value) => paddingTop + plotHeight - ((value - barMin) / (barMax - barMin)) * plotHeight;
  const getLineY = (value) => paddingTop + plotHeight - ((value - lineMin) / (lineMax - lineMin)) * plotHeight;

  // 生成柱状图
  const renderBars = () => {
    const barWidth = plotWidth / data.length * 0.6;
    
    return data.map((point, index) => {
      const x = getX(point[xKey]) - barWidth / 2;
      const y = getBarY(point[barKey]);
      const barHeight = plotHeight - (y - paddingTop);
      
      const actualBorderRadius = barHeight < barBorderRadius * 2 ? 0 : barBorderRadius;
      
      return (
        <Rect
          key={`bar-${index}`}
          x={x}
          y={y}
          width={barWidth}
          height={barHeight}
          fill={useBarGradient ? "url(#barGradient)" : barColor}
          opacity={barOpacity}
          rx={actualBorderRadius}
          ry={actualBorderRadius}
          onPress={enableInteraction ? () => {
            setSelectedPoint(index);
            onPointPress && onPointPress(point, index, 'bar');
          } : undefined}
        />
      );
    });
  };

  // 生成折线路径
  const generateLinePath = () => {
    let path = '';
    data.forEach((point, index) => {
      const x = getX(point[xKey]);
      const y = getLineY(point[lineKey]);
      
      if (index === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    });
    return path;
  };

  // 生成折线图点
  const renderLinePoints = () => {
    if (!showLinePoints) return null;
    
    return data.map((point, index) => {
      const x = getX(point[xKey]);
      const y = getLineY(point[lineKey]);
      
      return (
        <Circle
          key={`point-${index}`}
          cx={x}
          cy={y}
          r={pointRadius}
          fill={pointColor}
          stroke={pointStrokeColor}
          strokeWidth={pointStrokeWidth}
          onPress={enableInteraction ? () => {
            setSelectedPoint(index);
            onPointPress && onPointPress(point, index, 'line');
          } : undefined}
        />
      );
    });
  };

  // 生成网格线
  const renderGrid = () => {
    if (!showGrid) return null;
    
    const lines = [];

    // 水平网格线
    for (let i = 0; i <= 5; i++) {
      const y = paddingTop + (plotHeight / 5) * i;
      lines.push(
        <Line
          key={`hgrid-${i}`}
          x1={paddingLeft}
          y1={y}
          x2={paddingLeft + plotWidth}
          y2={y}
          stroke={gridColor}
          strokeWidth={0.5}
          opacity={gridOpacity}
        />
      );
    }

    // 垂直网格线
    const verticalGridCount = Math.min(8, data.length - 1);
    for (let i = 0; i <= verticalGridCount; i++) {
      const x = paddingLeft + (plotWidth / verticalGridCount) * i;
      lines.push(
        <Line
          key={`vgrid-${i}`}
          x1={x}
          y1={paddingTop}
          x2={x}
          y2={paddingTop + plotHeight}
          stroke={gridColor}
          strokeWidth={0.5}
          opacity={gridOpacity}
        />
      );
    }

    return lines;
  };

  // 生成坐标轴标签
  const renderAxisLabels = () => {
    const labels = [];

    // 左Y轴标签 (柱状图)
    for (let i = 0; i <= 5; i++) {
      const value = (barMax / 5) * (5 - i);
      const y = paddingTop + (plotHeight / 5) * i;
      
      labels.push(
        <SvgText
          key={`left-label-${i}`}
          x={paddingLeft - 10}
          y={y + 3}
          fontSize={tickLabelSize}
          fill={leftAxisColor}
          textAnchor="end"
        >
          {Math.round(value)}
        </SvgText>
      );
    }

    // 右Y轴标签 (折线图)
    for (let i = 0; i <= 4; i++) {
      const value = lineMin + (lineMax - lineMin) / 4 * (4 - i);
      const y = paddingTop + (plotHeight / 4) * i;
      
      labels.push(
        <SvgText
          key={`right-label-${i}`}
          x={paddingLeft + plotWidth + 10}
          y={y + 3}
          fontSize={tickLabelSize}
          fill={rightAxisColor}
          textAnchor="start"
        >
          {value.toFixed(1)}
        </SvgText>
      );
    }

    // X轴标签
    const xLabelCount = Math.min(8, data.length);
    const step = Math.floor(data.length / xLabelCount);
    for (let i = 0; i < xLabelCount; i++) {
      const dataIndex = i * step;
      if (dataIndex < data.length) {
        const value = data[dataIndex][xKey];
        const x = getX(value);
        
        labels.push(
          <SvgText
            key={`bottom-label-${i}`}
            x={x}
            y={paddingTop + plotHeight + 20}
            fontSize={tickLabelSize}
            fill={axisLabelColor}
            textAnchor="middle"
          >
            {typeof value === 'number' ? Math.round(value) : value}
          </SvgText>
        );
      }
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
          stroke={leftAxisColor}
          strokeWidth={1}
        />
        
        {/* 右Y轴 */}
        <Line
          x1={paddingLeft + plotWidth}
          y1={paddingTop}
          x2={paddingLeft + plotWidth}
          y2={paddingTop + plotHeight}
          stroke={rightAxisColor}
          strokeWidth={1}
        />
        
        {/* X轴 */}
        <Line
          x1={paddingLeft}
          y1={paddingTop + plotHeight}
          x2={paddingLeft + plotWidth}
          y2={paddingTop + plotHeight}
          stroke={axisLabelColor}
          strokeWidth={1}
        />
      </G>
    );
  };

  const handleCloseInfo = () => {
    setSelectedPoint(null);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.chartContainer, { backgroundColor }]}>
        <Svg width={width} height={height}>
          {useBarGradient && (
            <Defs>
              <LinearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor={barGradientColors[0]} stopOpacity={barGradientOpacities[0]} />
                <Stop offset="100%" stopColor={barGradientColors[1]} stopOpacity={barGradientOpacities[1]} />
              </LinearGradient>
            </Defs>
          )}
          
          {/* 网格线 */}
          <G>{renderGrid()}</G>
          
          {/* 坐标轴 */}
          {renderAxes()}
          
          {/* 柱状图 */}
          <G>{renderBars()}</G>
          
          {/* 折线图 */}
          <G>
            <Path
              d={generateLinePath()}
              stroke={lineColor}
              strokeWidth={lineWidth}
              fill="none"
            />
            {renderLinePoints()}
          </G>
          
          {/* 坐标轴标签 */}
          <G>{renderAxisLabels()}</G>
          
          {/* 轴标题 */}
          <SvgText
            x={paddingLeft - 40}
            y={paddingTop + plotHeight / 2}
            fontSize={axisLabelSize}
            fill={leftAxisColor}
            textAnchor="middle"
            transform={`rotate(-90, ${paddingLeft - 40}, ${paddingTop + plotHeight / 2})`}
          >
            {leftAxisLabel}
          </SvgText>
          
          <SvgText
            x={paddingLeft + plotWidth + 40}
            y={paddingTop + plotHeight / 2}
            fontSize={axisLabelSize}
            fill={rightAxisColor}
            textAnchor="middle"
            transform={`rotate(90, ${paddingLeft + plotWidth + 40}, ${paddingTop + plotHeight / 2})`}
          >
            {rightAxisLabel}
          </SvgText>
          
          <SvgText
            x={paddingLeft + plotWidth / 2}
            y={paddingTop + plotHeight + 45}
            fontSize={axisLabelSize}
            fill={axisLabelColor}
            textAnchor="middle"
          >
            {bottomAxisLabel}
          </SvgText>
        </Svg>
      </View>

      {/* 图例 */}
      {showLegend && (
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: useBarGradient ? barGradientColors[0] : barColor }]} />
            <Text style={styles.legendText}>{legendBarLabel}</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: lineColor }]} />
            <Text style={styles.legendText}>{legendLineLabel}</Text>
          </View>
        </View>
      )}

      {/* 选中点信息 */}
      {enableInteraction && selectedPoint !== null && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            {xKey}: {data[selectedPoint][xKey]}
          </Text>
          <Text style={styles.infoText}>
            {legendBarLabel}: {data[selectedPoint][barKey]}
          </Text>
          <Text style={styles.infoText}>
            {legendLineLabel}: {data[selectedPoint][lineKey]}
          </Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleCloseInfo}
          >
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// PropTypes 定义
CombinedChart.propTypes = {
  // 数据
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  
  // 尺寸
  width: PropTypes.number,
  height: PropTypes.number,
  
  // 内边距
  paddingLeft: PropTypes.number,
  paddingRight: PropTypes.number,
  paddingTop: PropTypes.number,
  paddingBottom: PropTypes.number,
  
  // 柱状图
  barColor: PropTypes.string,
  barOpacity: PropTypes.number,
  barBorderRadius: PropTypes.number,
  useBarGradient: PropTypes.bool,
  barGradientColors: PropTypes.arrayOf(PropTypes.string),
  barGradientOpacities: PropTypes.arrayOf(PropTypes.number),
  
  // 折线图
  lineColor: PropTypes.string,
  lineWidth: PropTypes.number,
  showLinePoints: PropTypes.bool,
  pointRadius: PropTypes.number,
  pointColor: PropTypes.string,
  pointStrokeColor: PropTypes.string,
  pointStrokeWidth: PropTypes.number,
  
  // 标签
  leftAxisLabel: PropTypes.string,
  rightAxisLabel: PropTypes.string,
  bottomAxisLabel: PropTypes.string,
  legendBarLabel: PropTypes.string,
  legendLineLabel: PropTypes.string,
  
  // 交互
  enableInteraction: PropTypes.bool,
  onPointPress: PropTypes.func,
  
  // 样式
  containerStyle: PropTypes.object,
  backgroundColor: PropTypes.string,
  showLegend: PropTypes.bool,
  showGrid: PropTypes.bool,
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  chartContainer: {
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
  noDataText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    padding: 40,
  },
});

export default CombinedChart;