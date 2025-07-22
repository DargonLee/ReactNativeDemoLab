import {StyleSheet, Text, View, TouchableOpacity} from "react-native";
import {ThemedText} from "@/components/ThemedText";
import {ThemeTestProps} from "@/types/ThemeTestProps";
import React from "react";

function Category({category}) {
	return (
		<Text style={{marginTop: 20, flexDirection: 'row', width: 100, fontWeight: 'bold', color: 'red'}}>{category}</Text>
	)
}

function Product({product = {name: '默认商品', price: 0}}) {
	return (
		<View style={styles.productContainer}>
			<Text style={{flex: 1}}>{product.name}</Text>
			<Text style={{width: 50}}>{product.price}</Text>
		</View>
	)
}

export function ProductTest({textColor, tintColor}) {
	const rows = [];
	let lastCategory = null;
	const products = [
		{category: '水果', price: '￥1', name: 'PingGuo'},
		{category: '水果', price: '￥1', name: 'HuoLongGuo'},
		{category: '水果', price: '￥2', name: 'BaiXiangGuo'},
		{category: '蔬菜', price: '￥2', name: 'BoCai'},
		{category: '蔬菜', price: '￥4', name: 'NanGua'},
		{category: '蔬菜', price: '￥1', name: 'WanDou'},
	];
	products.forEach((product) => {
		if (product.category !== lastCategory) {
			rows.push(
				<Category key={product.category} category={product.category}/>
			)
		}
		rows.push(
			<Product key={product.name} product={product}/>
		)
		lastCategory = product.category;
	})
	return (
		<View style={styles.testContent}>
			<View style={{flexDirection: 'row'}}>
				<Text style={{flex: 1}}>名称</Text>
				<Text style={{width: 50}}>价格</Text>
			</View>
			<View style={{marginTop: 20}}>
				{rows}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	productContainer: {
		flexDirection: "row",
		marginTop: 20,
	},
	testContent: {
		flex: 1,
		marginTop: 20,
	}
});
