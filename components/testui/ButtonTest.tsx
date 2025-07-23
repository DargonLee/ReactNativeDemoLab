import {StyleSheet, Text, View, TouchableOpacity, Pressable} from "react-native";
import {ThemedText} from "@/components/ThemedText";
import {ThemeTestProps} from "@/types/ThemeTestProps";
import React from "react";

const baseStyle = {width: 50, height: 50, backgroundColor: 'red'};

export function ButtonTest({textColor, tintColor}: ThemeTestProps) {
	return (
		<View style={styles.testContent}>
			<ThemedText type="subtitle" style={styles.sectionTitle}>
				按钮测试
			</ThemedText>
			<Pressable style={({pressed}) => [baseStyle, {opacity: pressed ? 0.5 : 1}]} onPress={() => {
			}}>
				<Text>按钮</Text>
			</Pressable>
			<TouchableOpacity
				style={[styles.testButton, {backgroundColor: tintColor}]}
			>
				<ThemedText style={[styles.buttonText, {color: "white"}]}>
					主要按钮
				</ThemedText>
			</TouchableOpacity>
			<TouchableOpacity
				style={[styles.testButton, {borderColor: tintColor, borderWidth: 1}]}
			>
				<ThemedText style={[styles.buttonText, {color: tintColor}]}>
					次要按钮
				</ThemedText>
			</TouchableOpacity>
			<TouchableOpacity
				style={[styles.testButton, {backgroundColor: "#f0f0f0"}]}
			>
				<ThemedText style={[styles.buttonText, {color: textColor}]}>
					默认按钮
				</ThemedText>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	testButton: {
		paddingHorizontal: 20,
		paddingVertical: 12,
		borderRadius: 8,
		marginBottom: 12,
		alignItems: "center",
	},
	buttonText: {
		fontSize: 16,
		fontWeight: "600",
	},
	testContent: {
		flex: 1,
		paddingHorizontal: 20,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "600",
		marginBottom: 16,
	},
});
