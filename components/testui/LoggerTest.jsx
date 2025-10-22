import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import Logger, { LogLevel } from '@/packages/logger';

export function LoggerTest({ textColor = '#222', tintColor = '#2d7ff9' }) {
  const [currentLevel, setCurrentLevel] = useState(Logger.getLogLevel());
  const [testCount, setTestCount] = useState(0);

  // 创建子 Logger 示例
  const apiLogger = useMemo(() => {
    return Logger.createLogger({ 
      moduleName: 'API',
      scope: 'network',
    });
  }, []);

  const dbLogger = useMemo(() => {
    return Logger.createLogger({ 
      moduleName: 'Database',
      scope: 'storage',
    });
  }, []);

  const uiLogger = useMemo(() => {
    return Logger.createLogger({ 
      moduleName: 'UI',
      screen: 'LoggerTest',
    });
  }, []);

  // ========== 辅助组件 ==========
  const Button = ({ title, onPress, variant = 'primary' }) => (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'primary' && { backgroundColor: tintColor },
        variant === 'secondary' && { backgroundColor: '#666' },
        variant === 'danger' && { backgroundColor: '#dc3545' },
        variant === 'success' && { backgroundColor: '#28a745' },
      ]}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  const Section = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: textColor }]}>{title}</Text>
      {children}
    </View>
  );

  const setLevel = (level) => {
    Logger.setLogLevel(level);
    setCurrentLevel(level);
    const levelNames = {
      [LogLevel.DEBUG]: 'DEBUG',
      [LogLevel.INFO]: 'INFO',
      [LogLevel.WARN]: 'WARN',
      [LogLevel.ERROR]: 'ERROR',
      [LogLevel.FATAL]: 'FATAL',
      [LogLevel.OFF]: 'OFF',
    };
    Logger.info(`日志级别已切换为 ${levelNames[level]}`, {
      moduleName: 'LoggerTest',
      oldLevel: currentLevel,
      newLevel: level,
    });
  };

  // ========== 测试用例 ==========
  
  // 1. 基础级别测试
  const testAllLevels = () => {
    Logger.debug('这是 DEBUG 级别日志', { moduleName: 'LoggerTest', step: 1 });
    Logger.info('这是 INFO 级别日志', { moduleName: 'LoggerTest', step: 2 });
    Logger.warn('这是 WARN 级别日志', { moduleName: 'LoggerTest', step: 3 });
    Logger.error('这是 ERROR 级别日志', { moduleName: 'LoggerTest', step: 4 });
    Logger.fatal('这是 FATAL 级别日志', { moduleName: 'LoggerTest', step: 5 });
    
    setTestCount(prev => prev + 5);
    Alert.alert('✅ 测试完成', '已输出所有级别日志\n请查看控制台');
  };

  // 2. Error 对象测试
  const testErrorObject = () => {
    // 测试1: 基础错误
    try {
      throw new Error('模拟网络请求超时');
    } catch (e) {
      Logger.error(e, {
        moduleName: 'LoggerTest',
        requestId: 'REQ-1001',
        url: '/api/user/login',
      });
    }

    // 测试2: 带额外属性的错误
    try {
      const error = new Error('服务器响应错误');
      error.code = 'ERR_BAD_RESPONSE';
      error.statusCode = 500;
      throw error;
    } catch (e) {
      Logger.error(e, {
        moduleName: 'LoggerTest',
        endpoint: '/api/data',
      });
    }

    setTestCount(prev => prev + 2);
    Alert.alert('✅ 测试完成', 'Error 对象已记录\n应包含 stack 和 errorName');
  };

  // 3. 长消息截断测试
  const testLongMessage = () => {
    const longText = 'A'.repeat(3000) + '\n【中间部分】\n' + 'B'.repeat(3000);
    Logger.info(longText, {
      moduleName: 'LoggerTest',
      type: 'longMessage',
      originalLength: longText.length,
    });
    
    setTestCount(prev => prev + 1);
    Alert.alert(
      '✅ 测试完成',
      `已输出 ${longText.length} 字符的长消息\n应该被截断到 5000 字符`
    );
  };

  // 4. 循环引用测试
  const testCircularReference = () => {
    const parent = { name: '父对象', id: 1 };
    const child = { name: '子对象', id: 2, parent };
    parent.child = child; // 构成循环

    Logger.debug('测试循环引用对象', {
      moduleName: 'LoggerTest',
      data: parent,
      description: '应该显示 [Circular]',
    });
    
    setTestCount(prev => prev + 1);
    Alert.alert('✅ 测试完成', '循环引用已处理\n应显示 [Circular]');
  };

  // 5. 特殊类型测试
  const testSpecialTypes = () => {
    Logger.info('测试各种特殊类型', {
      moduleName: 'LoggerTest',
      bigInt: 9007199254740991n,
      func: function testFunction() {},
      symbol: Symbol('testSymbol'),
      date: new Date(),
      undefined: undefined,
      null: null,
      nan: NaN,
      infinity: Infinity,
    });
    
    setTestCount(prev => prev + 1);
    Alert.alert(
      '✅ 测试完成',
      '特殊类型已记录:\n• BigInt\n• Function\n• Symbol\n• Date\n• undefined/null/NaN/Infinity'
    );
  };

  // 6. 对象作为 message 测试
  const testObjectMessage = () => {
    Logger.warn(
      { 
        type: 'warning',
        msg: '这是一个对象消息',
        timestamp: Date.now(),
        data: { 
          count: 42, 
          items: ['apple', 'banana', 'orange'],
          nested: {
            level: 2,
            value: 'deep',
          }
        },
      },
      { moduleName: 'LoggerTest' }
    );
    
    setTestCount(prev => prev + 1);
    Alert.alert('✅ 测试完成', '对象已作为 message 序列化');
  };

  // 7. 子 Logger 测试
  const testChildLoggers = () => {
    apiLogger.info('API 请求开始', { 
      endpoint: '/api/login',
      method: 'POST',
    });
    
    apiLogger.warn('API 响应慢', { 
      duration: 2500,
      threshold: 2000,
    });
    
    dbLogger.debug('查询数据库', { 
      table: 'users',
      query: 'SELECT * FROM users WHERE id = ?',
      params: [123],
    });
    
    dbLogger.error('数据库连接失败', {
      error: 'Connection timeout',
      retryCount: 3,
    });

    uiLogger.info('页面渲染', {
      duration: '45ms',
      componentCount: 12,
    });
    
    setTestCount(prev => prev + 5);
    Alert.alert(
      '✅ 测试完成',
      '子 Logger 已测试:\n• apiLogger (2条)\n• dbLogger (2条)\n• uiLogger (1条)'
    );
  };

  // 8. 批量日志测试
  const testBatchLogs = () => {
    const count = 30;
    for (let i = 0; i < count; i++) {
      Logger.debug(`批量日志 #${i + 1}`, {
        moduleName: 'LoggerTest',
        batchId: 'BATCH-001',
        index: i,
        timestamp: Date.now(),
      });
    }
    
    setTestCount(prev => prev + count);
    Alert.alert(
      '✅ 测试完成',
      `已输出 ${count} 条日志\n测试批量发送机制`
    );
  };

  // 9. 性能测试
  const testPerformance = () => {
    const start = Date.now();
    const count = 100;
    
    for (let i = 0; i < count; i++) {
      Logger.info(`性能测试 ${i}`, {
        moduleName: 'LoggerTest',
        testId: 'PERF-001',
        index: i,
      });
    }
    
    const duration = Date.now() - start;
    const avgTime = (duration / count).toFixed(2);
    
    Logger.info('性能测试完成', {
      moduleName: 'LoggerTest',
      totalLogs: count,
      duration: `${duration}ms`,
      avgPerLog: `${avgTime}ms`,
    });
    
    setTestCount(prev => prev + count + 1);
    Alert.alert(
      '📊 性能测试结果',
      `总日志数: ${count} 条\n总耗时: ${duration}ms\n平均耗时: ${avgTime}ms/条`
    );
  };

  // 10. 级别过滤测试
  const testLevelFiltering = () => {
    const originalLevel = currentLevel;
    
    // 切换到 ERROR 级别
    Logger.setLogLevel(LogLevel.ERROR);
    Logger.debug('❌ 这条 DEBUG 不应该输出');
    Logger.info('❌ 这条 INFO 不应该输出');
    Logger.warn('❌ 这条 WARN 不应该输出');
    Logger.error('✅ 这条 ERROR 应该输出');
    Logger.fatal('✅ 这条 FATAL 应该输出');
    
    // 恢复原级别
    Logger.setLogLevel(originalLevel);
    setCurrentLevel(originalLevel);
    
    setTestCount(prev => prev + 2); // 只有2条会输出
    Alert.alert(
      '✅ 测试完成',
      '级别过滤已测试\n只有 ERROR 和 FATAL 应该输出\n已恢复原级别'
    );
  };

  // 11. 嵌套对象测试
  const testNestedObjects = () => {
    Logger.info('测试深层嵌套对象', {
      moduleName: 'LoggerTest',
      user: {
        id: 10086,
        name: '测试用户',
        profile: {
          age: 25,
          address: {
            country: '中国',
            city: '北京',
            district: {
              name: '海淀区',
              zipCode: '100000',
            },
          },
          preferences: {
            theme: 'dark',
            language: 'zh-CN',
            notifications: {
              email: true,
              push: false,
              sms: true,
            },
          },
        },
        metadata: {
          createdAt: new Date('2024-01-01'),
          lastLogin: new Date(),
          loginCount: 42,
        },
      },
    });
    
    setTestCount(prev => prev + 1);
    Alert.alert('✅ 测试完成', '深层嵌套对象已序列化\n检查格式是否正确');
  };

  // 12. Unicode 和特殊字符测试
  const testUnicodeAndSpecialChars = () => {
    Logger.info('测试 Unicode 和特殊字符', {
      moduleName: 'LoggerTest',
      emoji: '🚀 🎉 💻 🔥 ✨ 🌈',
      chinese: '中文测试 - 你好世界',
      japanese: '日本語テスト - こんにちは',
      korean: '한국어 테스트 - 안녕하세요',
      special: 'Tab:\t Newline:\n Quote:" Backslash:\\ Slash:/',
      mixed: '混合📱中文🎨English日本語',
    });
    
    setTestCount(prev => prev + 1);
    Alert.alert('✅ 测试完成', 'Unicode 和特殊字符已记录');
  };

  // 13. 手动刷新测试
  const testManualFlush = () => {
    Logger.info('准备手动刷新日志队列', { moduleName: 'LoggerTest' });
    Logger.flush();
    
    Alert.alert('✅ 测试完成', '日志队列已手动刷新\n所有待发送日志已发送到原生层');
  };

  // 14. 生命周期测试
  const testLifecycle = () => {
    // 测试销毁
    Logger.info('测试销毁前', { moduleName: 'LoggerTest' });
    Logger.destroy();
    Logger.warn('销毁后的日志', { moduleName: 'LoggerTest' });
    
    // 重新初始化
    Logger.init();
    Logger.info('重新初始化后', { moduleName: 'LoggerTest' });
    
    setTestCount(prev => prev + 3);
    Alert.alert(
      '✅ 测试完成',
      '生命周期测试:\n• 销毁 (destroy)\n• 重新初始化 (init)\n已完成'
    );
  };

  // 15. 综合压力测试
  const testStressTest = () => {
    Alert.alert(
      '⚠️ 压力测试',
      '将输出大量日志，可能影响性能\n确定继续吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '开始',
          onPress: () => {
            const start = Date.now();
            const count = 500;
            
            for (let i = 0; i < count; i++) {
              const level = i % 5;
              const message = `压力测试 #${i} - ${Math.random().toString(36).substring(7)}`;
              
              switch (level) {
                case 0:
                  Logger.debug(message, { index: i, type: 'stress' });
                  break;
                case 1:
                  Logger.info(message, { index: i, type: 'stress' });
                  break;
                case 2:
                  Logger.warn(message, { index: i, type: 'stress' });
                  break;
                case 3:
                  Logger.error(message, { index: i, type: 'stress' });
                  break;
                case 4:
                  Logger.fatal(message, { index: i, type: 'stress' });
                  break;
              }
            }
            
            const duration = Date.now() - start;
            Logger.info('压力测试完成', {
              moduleName: 'LoggerTest',
              count,
              duration: `${duration}ms`,
              avgTime: `${(duration / count).toFixed(2)}ms`,
            });
            
            setTestCount(prev => prev + count + 1);
            Alert.alert(
              '📊 压力测试完成',
              `总日志: ${count} 条\n耗时: ${duration}ms\n平均: ${(duration / count).toFixed(2)}ms/条`
            );
          },
        },
      ]
    );
  };

  const LogLevelNames = {
    [LogLevel.DEBUG]: 'DEBUG',
    [LogLevel.INFO]: 'INFO',
    [LogLevel.WARN]: 'WARN',
    [LogLevel.ERROR]: 'ERROR',
    [LogLevel.FATAL]: 'FATAL',
    [LogLevel.OFF]: 'OFF',
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={[styles.title, { color: textColor }]}>
        Logger 测试面板
      </Text>
      
      {/* 状态信息 */}
      <View style={styles.statusCard}>
        <Text style={[styles.statusText, { color: textColor }]}>
          📊 当前级别: {LogLevelNames[currentLevel]} (值: {currentLevel})
        </Text>
        <Text style={[styles.statusText, { color: textColor }]}>
          📝 已执行测试: ~{testCount} 条日志
        </Text>
        <Text style={[styles.statusText, { color: textColor }]}>
          🔧 模式: {__DEV__ ? '开发模式' : '生产模式'}
        </Text>
      </View>

      {/* 级别控制 */}
      <Section title="🎚️ 日志级别控制">
        <View style={styles.row}>
          <Button 
            title="DEBUG (0)" 
            onPress={() => setLevel(LogLevel.DEBUG)}
            variant={currentLevel === LogLevel.DEBUG ? 'success' : 'primary'} 
          />
          <Button 
            title="INFO (1)" 
            onPress={() => setLevel(LogLevel.INFO)}
            variant={currentLevel === LogLevel.INFO ? 'success' : 'primary'}
          />
          <Button 
            title="WARN (2)" 
            onPress={() => setLevel(LogLevel.WARN)}
            variant={currentLevel === LogLevel.WARN ? 'success' : 'primary'}
          />
        </View>
        <View style={styles.row}>
          <Button 
            title="ERROR (3)" 
            onPress={() => setLevel(LogLevel.ERROR)}
            variant={currentLevel === LogLevel.ERROR ? 'success' : 'primary'}
          />
          <Button 
            title="FATAL (4)" 
            onPress={() => setLevel(LogLevel.FATAL)}
            variant={currentLevel === LogLevel.FATAL ? 'success' : 'primary'}
          />
          <Button 
            title="OFF (99)" 
            onPress={() => setLevel(LogLevel.OFF)} 
            variant="secondary" 
          />
        </View>
      </Section>

      {/* 基础功能测试 */}
      <Section title="📦 基础功能测试">
        <View style={styles.row}>
          <Button title="所有级别" onPress={testAllLevels} />
          <Button title="Error 对象" onPress={testErrorObject} />
        </View>
        <View style={styles.row}>
          <Button title="长消息截断" onPress={testLongMessage} />
          <Button title="对象消息" onPress={testObjectMessage} />
        </View>
      </Section>

      {/* 特殊情况测试 */}
      <Section title="🔬 特殊情况测试">
        <View style={styles.row}>
          <Button title="循环引用" onPress={testCircularReference} />
          <Button title="特殊类型" onPress={testSpecialTypes} />
        </View>
        <View style={styles.row}>
          <Button title="嵌套对象" onPress={testNestedObjects} />
          <Button title="Unicode字符" onPress={testUnicodeAndSpecialChars} />
        </View>
      </Section>

      {/* 高级功能测试 */}
      <Section title="⚡ 高级功能测试">
        <View style={styles.row}>
          <Button title="子 Logger" onPress={testChildLoggers} />
          <Button title="批量日志 (30)" onPress={testBatchLogs} />
        </View>
        <View style={styles.row}>
          <Button title="性能测试 (100)" onPress={testPerformance} />
          <Button title="级别过滤" onPress={testLevelFiltering} />
        </View>
      </Section>

      {/* 系统测试 */}
      <Section title="🛠️ 系统测试">
        <View style={styles.row}>
          <Button 
            title="手动刷新" 
            onPress={testManualFlush}
            variant="secondary"
          />
          <Button 
            title="生命周期" 
            onPress={testLifecycle}
            variant="secondary"
          />
        </View>
        <View style={styles.row}>
          <Button 
            title="压力测试 (500)" 
            onPress={testStressTest}
            variant="danger"
          />
        </View>
      </Section>

      {/* 说明文档 */}
      <Section title="📖 功能说明">
        <View style={styles.descCard}>
          <Text style={[styles.descTitle, { color: textColor }]}>基础功能：</Text>
          <Text style={[styles.desc, { color: textColor }]}>
            • 所有级别: 测试 DEBUG/INFO/WARN/ERROR/FATAL{'\n'}
            • Error对象: 自动提取 stack 和 errorName{'\n'}
            • 长消息截断: 超过 5000 字符自动截断{'\n'}
            • 对象消息: 对象作为 message 自动序列化
          </Text>
          
          <Text style={[styles.descTitle, { color: textColor }]}>特殊情况：</Text>
          <Text style={[styles.desc, { color: textColor }]}>
            • 循环引用: 显示 [Circular] 避免死循环{'\n'}
            • 特殊类型: BigInt/Function/Symbol/Date 等{'\n'}
            • 嵌套对象: 多层对象结构序列化{'\n'}
            • Unicode: 中文/日文/韩文/Emoji 支持
          </Text>
          
          <Text style={[styles.descTitle, { color: textColor }]}>高级功能：</Text>
          <Text style={[styles.desc, { color: textColor }]}>
            • 子Logger: 带默认上下文的独立记录器{'\n'}
            • 批量日志: 测试批量发送机制{'\n'}
            • 性能测试: 评估日志系统性能{'\n'}
            • 级别过滤: 动态调整输出级别
          </Text>
          
          <Text style={[styles.descTitle, { color: textColor }]}>系统功能：</Text>
          <Text style={[styles.desc, { color: textColor }]}>
            • 手动刷新: flush() 立即发送队列{'\n'}
            • 生命周期: 测试 init() 和 destroy(){'\n'}
            • 压力测试: 500 条日志的极限测试
          </Text>
        </View>
      </Section>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  statusCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#2d7ff9',
  },
  statusText: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 14,
    letterSpacing: 0.3,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 110,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  descCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
  },
  descTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },
  desc: {
    fontSize: 13,
    lineHeight: 22,
    opacity: 0.85,
  },
});