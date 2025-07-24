import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Button } from "react-native";
import { useState, useEffect } from "react";

const WelcomeMessage = ({ name }) => <Text>欢迎回来, {name}!</Text>;
const LoginButton = ({ onPress }) => <Button title="请登录" onPress={onPress} />;

export function Condition1Layout() {
	const [isEnabled, setIsEnabled] = useState(false);
	const [text, setText] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const hasError = text.length > 0 && text.length < 5;
	const [isLogin, setIsLogin] = useState(false);
	useEffect(() => {
		setTimeout(() => setIsLoading(false), 5000);
	}, []);

	return (
		<View style={styles.container}>
			<TouchableOpacity onPress={() => setIsEnabled(!isEnabled)} style={[styles.buttonBase, isEnabled ? styles.buttonEnabled : styles.buttonDisabled]}>
				<Text style={ styles.text }>{isEnabled ? '可点击状态' : '禁用状态'}</Text>
			</TouchableOpacity>
			<TextInput style={[styles.input, hasError && styles.inputError]} value={text} onChangeText={setText} placeholder="请输入至少五个字符" />
			{isLoading && <ActivityIndicator size="large" color='#007AFF' />}
			{!isLoading && <Text>数据加载完成！</Text>}
			{isLogin ? <WelcomeMessage name="Admin" /> : <LoginButton onPress={() => setIsLogin(true)} />}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
	},
	buttonBase: {
		paddingHorizontal: 16,
		paddingVertical: 16,
		borderRadius: 8,
		backgroundColor: 'transparent',
	},
	buttonEnabled: {
		backgroundColor: '#007AFF'
	},
	buttonDisabled: {
		backgroundColor: '#999999'
	},
	text: {
		fontSize: 18
	},
	input: {
		width: '100%',
		borderWidth: 1,
		borderColor: 'gray',
		padding: 10,
		borderRadius: 5,
	},
	inputError: {
		borderColor: 'red',
		borderWidth: 2,
	}
})
