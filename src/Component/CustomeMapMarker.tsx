import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Marker } from "react-native-maps";

// interface COORDINATE {
//     longtitude: string,
//     latitude: string
// }

interface CustomMapperProp {
    coordinate: {
        longitude: string,
        latitude: string
    },
    price: number,
    homeId: number,
    isSelected: boolean,
    onPress: () => void
}

const CustomeMapMarker = ({coordinate, price, homeId, isSelected, onPress}: CustomMapperProp) => {

  return (
    <Marker  coordinate={{latitude: Number(coordinate.latitude), longitude: Number(coordinate.longitude)}} onPress={onPress}>
        <View style={{
        backgroundColor: isSelected ? "black" : "white",
        padding: 5,
        borderRadius: 20,
        borderColor: "grey",
        borderWidth: 1,
      }}>
        <Text style={{ color: isSelected ? "white" : "black", fontWeight: "bold" }}>${price}</Text>
      </View>
    </Marker>
  )
}

export default CustomeMapMarker

const styles = StyleSheet.create({})