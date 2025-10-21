import { View, StyleSheet } from 'react-native';

export function Flex3Layout() {
  return (
    <View style={styles.container}>
      <View style={styles.top}></View>
      <View style={styles.middle}></View>
      <View style={styles.bottom}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gray',
    padding: 20,
    justifyContent: 'space-between'
  },
  top:{
    flex: 0.3,
    backgroundColor: 'green',
    borderWidth: 5,
    borderColor: 'black',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  middle: {
    flex: 0.3,
    backgroundColor: 'beige',
    borderWidth: 5,
    borderColor: 'black',
  },
  bottom:{
    flex: 0.3,
    backgroundColor: 'pink',
    borderWidth: 5,
    borderColor: 'black',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
});
