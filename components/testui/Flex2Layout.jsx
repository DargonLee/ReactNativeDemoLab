import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Image } from 'expo-image';

const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 24) / 2; // 2列 + 间距

const data = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  title: `卡片 ${i + 1}`,
  image: `https://picsum.photos/seed/${i}/300/${150 + (i % 5) * 30}`,
}));

export function Flex2Layout({ textColor, tintColor }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {data.map(item => (
        <View key={item.id} style={styles.card}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <Text style={styles.title}>{item.title}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 8,
  },
  card: {
    width: cardWidth,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1, // 固定比例或可删掉以展示不等高
    resizeMode: 'cover',
  },
  title: {
    backgroundColor: 'gray',
    padding: 8,
    fontSize: 14,
  },
});

