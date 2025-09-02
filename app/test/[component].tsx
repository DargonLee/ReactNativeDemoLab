import {ThemedText} from '@/components/ThemedText';
import {ThemedView} from '@/components/ThemedView';
import {useThemeColor} from '@/hooks/useThemeColor';
import {Ionicons} from '@expo/vector-icons';
import {useLocalSearchParams, useRouter} from 'expo-router';
import {Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import {InputTest} from '@/components/testui/InputTest';
import {InputTest2} from '@/components/testui/InputTest2';
import {ButtonTest} from '@/components/testui/ButtonTest';
import {ProductTest} from '@/components/testui/ProductTest';
import {Flex1Layout} from "@/components/testui/Flex1Layout";
import {Flex2Layout} from "@/components/testui/Flex2Layout";
import {Flex3Layout} from "@/components/testui/Flex3Layout";
import {Condition1Layout} from "@/components/testui/Condition1Layout";
import {LineChartTest} from "@/components/charts/LineChartTest";
import {ChartKitDemo} from "@/components/charts/ChartKitDemo";
import {ChartSVGDemo} from "@/components/charts/ChartSVGDemo";
import {CombinedChartDemo} from "@/components/charts/CombinedChartDemo";

export default function TestDetailScreen() {
	const {component, title, description, category} = useLocalSearchParams<{
		component: string;
		title?: string;
		description?: string;
		category?: string;
	}>();

	const router = useRouter();
	const textColor = useThemeColor({}, 'text');
	const tintColor = useThemeColor({}, 'tint');

	const renderTestContent = () => {
		switch (component) {
			case 'ButtonTest':
				return <ButtonTest textColor={textColor} tintColor={tintColor}/>;

			case 'InputTest':
				return <InputTest textColor={textColor} tintColor={tintColor}/>;
			case 'InputTest2':
				return <InputTest2/>;

			case 'ModalTest':
				return (
					<View style={styles.testContent}>
						<ThemedText type="subtitle" style={styles.sectionTitle}>模态框测试</ThemedText>
						<ThemedText style={styles.placeholder}>这里将展示模态框组件</ThemedText>
					</View>
				);

			case 'ProductTest':
				return <ProductTest textColor={textColor} tintColor={tintColor}/>;

			case 'Flex1Layout':
				return <Flex1Layout textColor={textColor} tintColor={tintColor}/>

			case 'Flex2Layout':
				return <Flex2Layout textColor={textColor} tintColor={tintColor}/>

			case 'Flex3Layout':
				return <Flex3Layout/>

			case 'Condition1Layout':
				return <Condition1Layout/>

			case 'ApiTest':
				return (
					<View style={styles.testContent}>
						<ThemedText type="subtitle" style={styles.sectionTitle}>API请求测试</ThemedText>
						<ThemedText style={styles.placeholder}>这里将展示网络请求功能</ThemedText>
					</View>
				);

			case 'StorageTest':
				return (
					<View style={styles.testContent}>
						<ThemedText type="subtitle" style={styles.sectionTitle}>存储测试</ThemedText>
						<ThemedText style={styles.placeholder}>这里将展示本地存储功能</ThemedText>
					</View>
				);

			case 'AnimationTest':
				return (
					<View style={styles.testContent}>
						<ThemedText type="subtitle" style={styles.sectionTitle}>动画测试</ThemedText>
						<ThemedText style={styles.placeholder}>这里将展示动画效果</ThemedText>
					</View>
				);

			case 'CameraTest':
				return (
					<View style={styles.testContent}>
						<ThemedText type="subtitle" style={styles.sectionTitle}>摄像头测试</ThemedText>
						<ThemedText style={styles.placeholder}>这里将展示摄像头功能</ThemedText>
					</View>
				);

			case 'LocationTest':
				return (
					<View style={styles.testContent}>
						<ThemedText type="subtitle" style={styles.sectionTitle}>位置服务测试</ThemedText>
						<ThemedText style={styles.placeholder}>这里将展示位置服务功能</ThemedText>
					</View>
				);

			case 'LineChartTest':
				return <LineChartTest/>;

			case 'ChartKitDemo':
				return <ChartKitDemo/>;

			case 'ChartSVGDemo':
				return <ChartSVGDemo/>;

			case 'CombinedChartDemo':
				return <CombinedChartDemo/>;

			default:
				return (
					<View style={styles.testContent}>
						<ThemedText type="subtitle" style={styles.sectionTitle}>未知测试</ThemedText>
						<ThemedText style={styles.placeholder}>该测试页面还未实现</ThemedText>
					</View>
				);
		}
	};

	return (
		<ThemedView style={styles.container}>
			{/* 顶部导航 */}
			<View style={styles.header}>
				<TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
					<Ionicons name="arrow-back" size={24} color={textColor}/>
				</TouchableOpacity>
				<View style={styles.headerContent}>
					<ThemedText type="title" style={styles.headerTitle}>
						{title || component}
					</ThemedText>
					{description && (
						<ThemedText style={styles.headerDescription}>
							{description}
						</ThemedText>
					)}
				</View>
			</View>

			{/* 测试内容 */}
			{renderTestContent()}
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: Platform.OS === 'ios' ? 60 : 40,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 20,
		paddingBottom: 20,
	},
	backButton: {
		marginRight: 16,
		padding: 8,
	},
	headerContent: {
		flex: 1,
	},
	headerTitle: {
		fontSize: 24,
		fontWeight: 'bold',
	},
	headerDescription: {
		fontSize: 14,
		opacity: 0.7,
		marginTop: 4,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '600',
		marginBottom: 16,
	},
	placeholder: {
		fontSize: 16,
		opacity: 0.6,
		textAlign: 'center',
		marginTop: 40,
	},
	testContent: {
		flex: 1,
		paddingHorizontal: 20,
	},
});
