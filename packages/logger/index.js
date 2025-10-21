import { NativeModules, AppState } from "react-native";

// 定义日志级别
export const LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  FATAL: 4,
  OFF: 99,
};

const LogLevelString = {
  [LogLevel.DEBUG]: "DEBUG",
  [LogLevel.INFO]: "INFO",
  [LogLevel.WARN]: "WARN",
  [LogLevel.ERROR]: "ERROR",
  [LogLevel.FATAL]: "FATAL",
};

let logQueue = [];
let flushTimer = null;

const CONFIG = {
  MAX_MESSAGE_LENGTH: 5000,
  FLUSH_INTERVAL_MS: 5000,
  MAX_QUEUE_SIZE: 50,
};

let currentLogLevel = __DEV__ ? LogLevel.DEBUG : LogLevel.INFO;

// 获取原生模块
// 我们使用一个代理(proxy)来安全地处理原生模块
// 即使 NativeLogManager 没有被正确链接，App 也不会崩溃
const NativeLogger = NativeModules.NativeLogManager
  ? NativeModules.NativeLogManager
  : {
      // 提供一个备用的(mock)实现，以防原生模块未链接
      log: (level, message, context) => {
        if (__DEV__) {
          console.warn(
            `NativeLogManager 未链接。日志仅在控制台打印: [${level}]`,
            message,
            context
          );
        }
      },
      logBatch: (logs) => {
        if (__DEV__) {
          console.warn("NativeLogManager 未链接。日志仅在控制台打印:", logs);
        }
      },
      setLevel: () => {}, // 空操作
    };

const handleAppStateChange = (nextAppState) => {
  if (nextAppState === "background") {
    flushQueue();
  }
};
AppState.addEventListener("change", handleAppStateChange);

/** 刷新日志队列，批量发送到原生层 */
function flushQueue() {
  if (logQueue.length === 0) {
    return;
  }

  // 复制并清空队列
  const logsToSend = [...logQueue];
  logQueue = [];

  // 取消定时器
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }

  // 批量发送
  try {
    NativeLogger.logBatch(logsToSend);
  } catch (e) {
    console.error("Logger: 批量写入原生日志失败", e, logsToSend);
  }
}

/**
 * 截断字符串到指定长度
 */
function truncateString(str, maxLength) {
  if (str.length <= maxLength) {
    return str;
  }
  const half = Math.floor((maxLength - 20) / 2);
  return `${str.slice(0, half)}\n...[截断 ${
    str.length - maxLength
  } 字符]...\n${str.slice(-half)}`;
}

/**
 * 安全地序列化对象，处理循环引用
 */
function safeStringify(obj, maxLength) {
  const seen = new WeakSet();

  try {
    const str = JSON.stringify(obj, (key, value) => {
      // 处理循环引用
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return "[Circular]";
        }
        seen.add(value);
      }
      return value;
    });

    return truncateString(str, maxLength);
  } catch (error) {
    return `[序列化失败: ${error.message}]`;
  }
}

/**
 * 设置 JS 端的最小日志级别。
 * 低于此级别的日志将不会被发送到 Native。
 * @param {number} level - 使用 LogLevel 中的一个值 (例如 LogLevel.INFO)
 */
function setLogLevel(level) {
  currentLogLevel = level;

  // (可选) 同时通知原生层
  // NativeLogger.setLevel(LogLevelString[level] || 'INFO');
}

// 4. 核心日志写入函数 (内部使用)
/**
 * 内部函数，用于处理所有日志
 * @param {number} level - 数字日志级别
 * @param {string | Error} message - 日志消息或一个 Error 对象
 * @param {object} context - 附加上下文
 */
function write(level, message, context = {}) {
  // 关键：在 JS 端进行级别过滤
  if (level < currentLogLevel) {
    return;
  }

  // A. 开发者友好：在开发模式下，也在控制台打印
  const levelString = LogLevelString[level] || "INFO";
  const moduleName = (context && context.moduleName) || null;
  const prefix = moduleName
    ? `[${moduleName}][${levelString}]`
    : `[${levelString}]`;

  let logMessage = message;
  let logContext = { ...context };

  if (message instanceof Error) {
    logMessage = message.message;
    logContext.stack = message.stack;
    logContext.errorName = message.name;
  }
  if (typeof logMessage !== "string") {
    logMessage = safeStringify(logMessage, CONFIG.MAX_MESSAGE_LENGTH);
  } else {
    logMessage = truncateString(logMessage, CONFIG.MAX_MESSAGE_LENGTH);
  }

  // D. 发送到原生层
  // 将模块名写入上下文，便于原生层区分来源模块
  const ctxModuleName = (context && context.moduleName) || null;
  if (ctxModuleName && !logContext.moduleName) {
    logContext.moduleName = ctxModuleName;
  }
  // 标识来源为 React Native
  if (!logContext.platform) {
    logContext.platform = "RN";
  }

  const logEntry = {
    level: prefix,
    message: logMessage,
    context: logContext,
    timestamp: new Date().toISOString(),
  };

  try {
    if (__DEV__) {
      const logMethod =
        level === LogLevel.WARN
          ? console.warn
          : level >= LogLevel.ERROR
          ? console.error
          : console.log;
      logMethod(logEntry);
    }
    logQueue.push(logEntry);
    if (logQueue.length >= CONFIG.MAX_QUEUE_SIZE) {
      flushQueue();
    } else if (!flushTimer) {
      flushTimer = setTimeout(flushQueue, CONFIG.FLUSH_INTERVAL_MS);
    }
  } catch (e) {
    console.error("Logger: 写入原生日志失败", e, {
      level: levelString,
      logEntry: logEntry,
    });
  }
}

const Logger = {
  // 导出级别常量，方便外部使用
  LogLevel,

  // 导出配置函数
  setLogLevel,

  // 导出各个级别的日志方法
  debug: (message, context) => {
    write(LogLevel.DEBUG, message, context);
  },

  info: (message, context) => {
    write(LogLevel.INFO, message, context);
  },

  warn: (message, context) => {
    write(LogLevel.WARN, message, context);
  },

  error: (message, context) => {
    write(LogLevel.ERROR, message, context);
  },

  fatal: (message, context) => {
    write(LogLevel.FATAL, message, context);
  },
};

export default Logger;
