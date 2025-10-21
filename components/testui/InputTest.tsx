import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { CustomAlert } from '@/components/ui/CustomAlert';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ThemeTestProps } from '@/types/ThemeTestProps';
import {
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  KeyboardAvoidingView,
  ScrollView
} from 'react-native';

export function InputTest({ textColor, tintColor }: ThemeTestProps) {
  const [basicText, setBasicText] = useState('');
  const [passwordText, setPasswordText] = useState('');
  const [emailText, setEmailText] = useState('');
  const [phoneText, setPhoneText] = useState('');
  const [multilineText, setMultilineText] = useState('');
  const [mixedText, setMixedText] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleSubmit = () => {
    Alert.alert('提交数据', `
基础文本: ${basicText}
邮箱: ${emailText}
手机: ${phoneText}
多行文本: ${multilineText}
混合字符: ${mixedText}
    `);
  };

  const formatPhoneNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return text;
  };

  const handlePhoneChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length <= 11) {
      setPhoneText(cleaned);
    }
  };

  // 汉字按2个字符计算，其他字符按1个字符计算
  const calculateCharacterLength = (text: string): number => {
    let length = 0;
    // 使用 Array.from 正确处理 Unicode 码点，包括emoji
    const characters = Array.from(text);

    for (const char of characters) {
      // 检查是否为汉字（包括基本汉字、扩展汉字等）
      if (/[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/.test(char)) {
        length += 2; // 汉字按2个字符计算
      } else {
        length += 1; // 其他字符（英文、数字、emoji、符号等）按1个字符计算
      }
    }

    return length;
  };

  const handleMixedTextChange = (text: string) => {
    const charLength = calculateCharacterLength(text);

    if (charLength > 20) {
      setAlertMessage('输入内容超出限制！最多支持20个字符（汉字按2个字符计算，其他按1个字符计算）。');
      setShowAlert(true);
      return;
    }

    setMixedText(text);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.content}>
          <ThemedText type="title" style={styles.title}>输入框测试</ThemedText>

          {/* 基础文本输入 */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>基础文本输入</ThemedText>
            <TextInput
              style={[styles.input, { color: textColor, borderColor: tintColor }]}
              value={basicText}
              onChangeText={setBasicText}
              placeholder="请输入文本"
              placeholderTextColor={textColor + '60'}
            />
          </View>

          {/* 密码输入 */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>密码输入</ThemedText>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.passwordInput, { color: textColor, borderColor: tintColor }]}
                value={passwordText}
                onChangeText={setPasswordText}
                placeholder="请输入密码"
                placeholderTextColor={textColor + '60'}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? 'eye' : 'eye-off'}
                  size={20}
                  color={textColor}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* 邮箱输入 */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>邮箱输入</ThemedText>
            <TextInput
              style={[styles.input, { color: textColor, borderColor: tintColor }]}
              value={emailText}
              onChangeText={setEmailText}
              placeholder="请输入邮箱地址"
              placeholderTextColor={textColor + '60'}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* 手机号输入 */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>手机号输入</ThemedText>
            <TextInput
              style={[styles.input, { color: textColor, borderColor: tintColor }]}
              value={formatPhoneNumber(phoneText)}
              onChangeText={handlePhoneChange}
              placeholder="请输入手机号"
              placeholderTextColor={textColor + '60'}
              keyboardType="phone-pad"
              maxLength={13}
            />
          </View>

          {/* 多行文本输入 */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>多行文本输入</ThemedText>
            <TextInput
              style={[styles.textArea, { color: textColor, borderColor: tintColor }]}
              value={multilineText}
              onChangeText={setMultilineText}
              placeholder="请输入多行文本..."
              placeholderTextColor={textColor + '60'}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* 混合字符输入 */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>
              混合字符输入 ({calculateCharacterLength(mixedText)}/20)
            </ThemedText>
            <TextInput
              style={[styles.input, { color: textColor, borderColor: tintColor }]}
              value={mixedText}
              onChangeText={handleMixedTextChange}
              placeholder="支持空格、emoji、汉字、英文 😊"
              placeholderTextColor={textColor + '60'}
            />
            <ThemedText style={[styles.hint, { color: textColor + '80' }]}>
              最多20个字符（汉字按2个字符计算，其他按1个字符计算）
            </ThemedText>
          </View>

          {/* 提交按钮 */}
          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: tintColor }]}
            onPress={handleSubmit}
          >
            <ThemedText style={[styles.submitButtonText, { color: 'white' }]}>
              提交数据
            </ThemedText>
          </TouchableOpacity>

          {/* 清除按钮 */}
          <TouchableOpacity
            style={[styles.clearButton, { borderColor: tintColor }]}
            onPress={() => {
              setBasicText('');
              setPasswordText('');
              setEmailText('');
              setPhoneText('');
              setMultilineText('');
              setMixedText('');
            }}
          >
            <ThemedText style={[styles.clearButtonText, { color: tintColor }]}>
              清除所有
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>

      <CustomAlert
        visible={showAlert}
        title="输入限制"
        message={alertMessage}
        onConfirm={() => setShowAlert(false)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingRight: 48,
    fontSize: 16,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: 14,
    padding: 4,
  },
  textArea: {
    height: 100,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  submitButton: {
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  clearButton: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  hint: {
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
});
