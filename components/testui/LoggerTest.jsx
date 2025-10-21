import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Logger, { LogLevel } from '@/packages/logger';

export function LoggerTest({ textColor, tintColor }) {
  const [consoleOn, setConsoleOn] = useState(true);
  const [bridgeOn, setBridgeOn] = useState(true);
  const L = Logger;

  // 探测可用的增强 API（兼容当前 logger/index.js 未提供的情况）
  const supports = {
    withContext: typeof L.withContext === 'function',
    setDefaultContext: typeof L.setDefaultContext === 'function',
    setConsoleEnabled: typeof L.setConsoleEnabled === 'function',
    setBridgeEnabled: typeof L.setBridgeEnabled === 'function',
    getLogLevel: typeof L.getLogLevel === 'function',
    isEnabled: typeof L.isEnabled === 'function',
  };

  // 当没有 withContext 时，使用本地封装实现上下文合并
  function createChildLogger(baseContext) {
    return {
      debug: (message, context) =>
        L.debug(message, { ...baseContext, ...context }),
      info: (message, context) =>
        L.info(message, { ...baseContext, ...context }),
      warn: (message, context) =>
        L.warn(message, { ...baseContext, ...context }),
      error: (message, context) =>
        L.error(message, { ...baseContext, ...context }),
      fatal: (message, context) =>
        L.fatal(message, { ...baseContext, ...context }),
    };
  }

  const apiLogger = useMemo(
    () =>
      supports.withContext
        ? L.withContext({ scope: 'api', moduleName: 'Auth' })
        : createChildLogger({ scope: 'api', moduleName: 'Auth' }),
    []
  );

  const handleSetDefaultContext = () => {
    if (supports.setDefaultContext) {
      L.setDefaultContext({
        appVersion: '1.0.0',
        env: __DEV__ ? 'dev' : 'prod',
      });
      L.info('设置默认上下文', {
        screen: 'LoggerTest',
        moduleName: 'LoggerTest',
      });
    } else {
      // 兼容旧版：仅提示
      L.info('当前 Logger 不支持默认上下文 API', {
        screen: 'LoggerTest',
        moduleName: 'LoggerTest',
      });
    }
  };

  const handleToggleConsole = () => {
    const next = !consoleOn;
    if (supports.setConsoleEnabled) {
      setConsoleOn(next);
      L.setConsoleEnabled(next);
      L.info(`consoleEnabled=${next}`, { moduleName: 'LoggerTest' });
    } else {
      L.warn('当前 Logger 不支持 consoleEnabled 开关', {
        moduleName: 'LoggerTest',
      });
    }
  };

  const handleToggleBridge = () => {
    const next = !bridgeOn;
    if (supports.setBridgeEnabled) {
      setBridgeOn(next);
      L.setBridgeEnabled(next);
      L.info(`bridgeEnabled=${next}`, { moduleName: 'LoggerTest' });
    } else {
      L.warn('当前 Logger 不支持 bridgeEnabled 开关', {
        moduleName: 'LoggerTest',
      });
    }
  };

  const logAllLevels = () => {
    L.debug('这是一个 DEBUG 日志', {
      screen: 'LoggerTest',
      userId: 123,
      moduleName: 'LoggerTest',
    });
    L.info('这是一个 INFO 日志', {
      action: 'click',
      btn: 'logAllLevels',
      moduleName: 'LoggerTest',
    });
    L.warn('这是一个 WARN 日志', {
      reason: 'just-a-warning',
      moduleName: 'LoggerTest',
    });
    L.error('这是一个 ERROR 日志', { code: 'E1001', moduleName: 'LoggerTest' });
    L.fatal('这是一个 FATAL 日志', { code: 'F9999', moduleName: 'LoggerTest' });
  };

  const logErrorObject = () => {
    const err = new Error('模拟错误：网络请求失败');
    L.error(err, { requestId: 'REQ-001', moduleName: 'LoggerTest' });
  };

  const logChildLogger = () => {
    apiLogger.info('子 logger：请求成功', { url: '/login' });
    apiLogger.warn('子 logger：响应慢', { duration: 1200 });
  };

  const setLevelInfo = () => {
    L.setLogLevel(LogLevel.INFO);
    setCurrentLevel(LogLevel.INFO);
  };

  const setLevelDebug = () => {
    L.setLogLevel(LogLevel.DEBUG);
    setCurrentLevel(LogLevel.DEBUG);
  };

  const [currentLevel, setCurrentLevel] = useState(
    supports.getLogLevel
      ? L.getLogLevel()
      : __DEV__
        ? LogLevel.DEBUG
        : LogLevel.INFO
  );
  const debugEnabled = supports.isEnabled
    ? L.isEnabled(LogLevel.DEBUG)
    : LogLevel.DEBUG >= currentLevel;

  const Button = ({ title, onPress }) => (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: tintColor }]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, { color: '#fff' }]}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={[styles.title, { color: textColor }]}>Logger 测试面板</Text>
      <Text style={[styles.desc, { color: textColor }]}>
        当前级别: {currentLevel}，DEBUG启用: {String(debugEnabled)}
      </Text>

      <View style={styles.row}>
        <Button title="log: all levels" onPress={logAllLevels} />
        <Button title="log: Error对象" onPress={logErrorObject} />
      </View>

      <View style={styles.row}>
        <Button title="子logger: API" onPress={logChildLogger} />
        <Button title="设置默认上下文" onPress={handleSetDefaultContext} />
      </View>

      {supports.setConsoleEnabled && supports.setBridgeEnabled && (
        <View style={styles.row}>
          <Button
            title={`切换console(${consoleOn ? '开' : '关'})`}
            onPress={handleToggleConsole}
          />
          <Button
            title={`切换bridge(${bridgeOn ? '开' : '关'})`}
            onPress={handleToggleBridge}
          />
        </View>
      )}

      <View style={styles.row}>
        <Button title="级别设为 INFO" onPress={setLevelInfo} />
        <Button title="级别设为 DEBUG" onPress={setLevelDebug} />
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
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
