import React from 'react';
import { View, Text } from 'react-native';
import CombinedChart from '@/components/charts/CombinedChart';

const CombinedChartDemo = () => {
    const sampleData = [
        { time: 0, torque: 265, rpm: 0 },
        { time: 2, torque: 200, rpm: 0.5 },
        { time: 4, torque: 180, rpm: 1.2 },
        { time: 6, torque: 160, rpm: 1.5 },
        { time: 8, torque: 140, rpm: 1.8 },
        { time: 10, torque: 120, rpm: 2.0 },
        { time: 12, torque: 100, rpm: 2.2 },
        { time: 14, torque: 80, rpm: 2.5 },
    ];

    return (
        <View>
            <CombinedChart
                // 数据
                data={sampleData}

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
                onPointPress={(point: any, index: any, type: any) => {
                    return console.log('点击了', type, '数据:', point);
                }}

                // 样式配置
                backgroundColor="#f8f9fa"
                showGrid={true}
                showLegend={true}
            />
        </View>
    );
};

export { CombinedChartDemo };
