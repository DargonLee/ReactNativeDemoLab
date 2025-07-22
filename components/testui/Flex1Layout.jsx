import React from "react";
import {StyleSheet, View, Text} from "react-native";
import {Image} from "expo-image";

export function Flex1Layout({textColor, tintColor}) {
	const imageUri = "https://cn.bing.com/images/search?q=%e5%9b%be%e7%89%87&id=99E8794026CA9229880CB1784977B57B306E8AB1&FORM=IACFIR"
	return (
		<View>
			<View>
				<View style={{height: 50, backgroundColor: 'powderblue'}}></View>
				<View style={{height: 50, backgroundColor: 'skyblue'}}></View>
				<View style={{height: 50, backgroundColor: 'red'}}></View>
			</View>
			<View style={{flexDirection: 'row'}}>
				<Image
					style={{width: 100, height: 100}}
					source={{uri: imageUri}}
					placeholder={require('../../assets/images/react-logo.png')}
					contentFit={'cover'}
				/>
				<Text style={{flex: 1, fontSize: 18, backgroundColor: 'gray'}}>我是文字</Text>
			</View>
			<View style={{
				alignItems: 'center',
				justifyContent: 'center',
				height: 60,
				borderColor: 'gray',
				borderWidth: 1
			}}>
				<Text
					style={{
						fontSize: 18,
						// 文字默认内边距，会导致垂直居中偏下
						// includeFontPadding: false,
						// 文字默认基于基线对齐，会导致垂直居中偏下
						// textAlignVertical: 'center',
					}}>
					我是文字啊
				</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {}
})
