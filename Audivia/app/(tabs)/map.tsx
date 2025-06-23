import { View, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
// import UserLocationMap from '@/components/common/UserLocationMap'

export default function Map() {
  return (
    <View style={styles.container}>
      {/* <UserLocationMap 
        height={Dimensions.get('window').height}
        width={Dimensions.get('window').width}
        showMarker={true}
      /> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
})