import React, {useState} from "react";
import {forwardRef, useRef} from "react";
import {View, TextInput, StyleSheet, Alert, Dimensions} from "react-native";
import {useSafeState} from "@/hooks/useSafeState";

export default forwardRef(NBRegTextInput);

// 一个不允许输入disallow reg的输入框
function NBRegTextInput(props, ref) {
	const {disallow, disallow_text, ...rest} = props;

	const lastRef = useRef();
	lastRef.current = props.value;

	function onChangeText(newValue) {
		let dis = disallow;
		if (dis !== undefined) {
			// 如果dis不是正则对象
			if (!(dis instanceof RegExp)) {
				dis = new RegExp(dis);
			}
			// 如果新值中存在不允许的值 则设置上一次的state
			if (dis.test(newValue)) {
				newValue = lastRef.current;
				if (disallow_text) {
					console.log(disallow_text)
				}
			}
		}
		props.onChangeText?.(newValue);
	}

	return <TextInput {...rest} ref={ref} onChangeText={onChangeText}/>;
}

const window_width = Dimensions.get("window").width;
const showAlert = (title, msg) => {
	Alert.alert(
		title | "提示标题",
		msg | "这是提示内容",
		[
			{text: "取消", onPress: () => console.log("取消被按下"), style: "cancel"},
			{text: "确认", onPress: () => console.log("确认被按下")}
		],
		{cancelable: false}
	);
};

export function InputTest2() {
	const [showAlert, setShowAlert] = useState(false);
	// const [text, setText] = useSafeState("");
	const [text, setText] = useState("");

	return (
		<View style={[styles.container]}>
			<NBRegTextInput
				style={{
					left: 25,
					height: 70,
					width: window_width - 25 * 2,
					fontSize: 16,
					borderWidth: 1,
					borderColor: "gray",
				}}
				value={text}
				maxLength={20}
				onChangeText={setText}
				disallow={/[^\u4E00-\u9FA5 a-zA-Z0-9_]/}
				placeholder="请输入你的昵称"
				keyboardType="default"
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {}
})
