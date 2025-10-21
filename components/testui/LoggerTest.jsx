import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Logger, { LogLevel } from '@/packages/logger';

// 根据当前 logger/index.js 的实现：仅提供 setLogLevel 与五种级别方法
// 本测试面板侧重验证：
// 1. 级别过滤
// 2. Error 对象自动提取 stack/name
// 3. 长消息截断逻辑
// 4. 上下文中循环引用的安全处理 (Circular)
// 5. 不可序列化值 (BigInt) 触发的失败兜底
// 6. 非字符串 message 的序列化

export function LoggerTest({ textColor = '#222', tintColor = '#2d7ff9' }) {
  const L = Logger;

  // 简易子 logger（模拟模块名与作用域）
  const apiLogger = useMemo(() => {
    const base = { scope: 'api', moduleName: 'Auth' };
    return {
      debug: (m, c) => L.debug(m, { ...base, ...c }),
      info: (m, c) => L.info(m, { ...base, ...c }),
      warn: (m, c) => L.warn(m, { ...base, ...c }),
      error: (m, c) => L.error(m, { ...base, ...c }),
      fatal: (m, c) => L.fatal(m, { ...base, ...c }),
    };
  }, []);

  // 当前级别本地状态（Logger 未提供 getLogLevel，因此手动同步）
  const [currentLevel, setCurrentLevel] = useState(__DEV__ ? LogLevel.DEBUG : LogLevel.INFO);

  const setLevel = (level) => {
    L.setLogLevel(level);
    setCurrentLevel(level);
    L.info(`LogLevel 已切换为 ${level}`, { moduleName: 'LoggerTest' });
  };

  // 级别过滤演示：当切到 WARN 后再触发 debug/info 看不到（Native层不会调用，DEV 控制台也不会打印）
  const demoAllLevels = () => {
    L.debug('DEBUG 日志示例', { moduleName: 'LoggerTest', step: 'start' });
    L.info('INFO 日志示例', { moduleName: 'LoggerTest' });
    L.warn('WARN 日志示例', { moduleName: 'LoggerTest' });
    L.error('ERROR 日志示例', { moduleName: 'LoggerTest' });
    L.fatal('FATAL 日志示例', { moduleName: 'LoggerTest' });
  };

  // Error 对象演示
  const demoErrorObject = () => {
    try {
      throw new Error('模拟抛出的网络错误');
    } catch (e) {
      L.error(e, { requestId: 'REQ-1001', moduleName: 'LoggerTest' });
    }
  };

  // 长消息截断：构造 6000+ 字符串
  const demoLongMessage = () => {
    const long = 'A'.repeat(3000) + '\nMIDDLE' + 'B'.repeat(3000) + 'END';
    L.info(long, { moduleName: 'LoggerTest', type: 'longMessage' });
  };

  // 循环引用上下文演示
  const demoCircularContext = () => {
    const a = { name: 'root' };
    const b = { parent: a };
    a.child = b; // 构成循环
    L.debug('包含循环引用的上下文', { moduleName: 'LoggerTest', data: a });
  };

  // 不可序列化值 (BigInt) 演示
  const demoBigIntContext = () => {
    const ctx = { moduleName: 'LoggerTest', bigCounter: 10n };
    L.info('上下文包含 BigInt', ctx);
  };

  // 非字符串 message（对象）演示
  const demoObjectMessage = () => {
    L.warn({ msg: '对象作为 message', ts: Date.now(), ok: true }, { moduleName: 'LoggerTest' });
  };

  // 子 logger 演示
  const demoChildLogger = () => {
    apiLogger.info('子 logger 请求成功', { url: '/login' });
    apiLogger.warn('子 logger 响应慢', { duration: 1450 });
  };

  const Button = ({ title, onPress }) => (
    <TouchableOpacity style={[styles.button, { backgroundColor: tintColor }]} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={[styles.title, { color: textColor }]}>Logger 测试面板</Text>
      <Text style={[styles.desc, { color: textColor }]}>
        当前级别: {currentLevel} (DEBUG=0, INFO=1, WARN=2, ERROR=3, FATAL=4)
      </Text>
      <Text style={[styles.desc, { color: textColor }]}>
        验证点：过滤 / Error 自动展开 / 截断 / 循环引用 / BigInt 兜底 / 对象 message
      </Text>

      <View style={styles.row}>
        <Button title="日志: 全部级别" onPress={demoAllLevels} />
        <Button title="日志: Error对象" onPress={demoErrorObject} />
        <Button title="日志: 长消息截断" onPress={demoLongMessage} />
      </View>
      <View style={styles.row}>
        <Button title="日志: 循环上下文" onPress={demoCircularContext} />
        <Button title="日志: BigInt上下文" onPress={demoBigIntContext} />
        <Button title="日志: 对象message" onPress={demoObjectMessage} />
      </View>
      <View style={styles.row}>
        <Button title="子Logger演示" onPress={demoChildLogger} />
      </View>
      <View style={styles.row}>
        <Button title="级别设为 DEBUG" onPress={() => setLevel(LogLevel.DEBUG)} />
        <Button title="级别设为 INFO" onPress={() => setLevel(LogLevel.INFO)} />
        <Button title="级别设为 WARN" onPress={() => setLevel(LogLevel.WARN)} />
      </View>
      <View style={styles.row}>
        <Button title="级别设为 ERROR" onPress={() => setLevel(LogLevel.ERROR)} />
        <Button title="级别设为 FATAL" onPress={() => setLevel(LogLevel.FATAL)} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  desc: {
    fontSize: 14,
    opacity: 0.7,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
});
