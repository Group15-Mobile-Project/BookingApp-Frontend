import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { HOME } from '../Model'
import { useTailwind } from 'tailwind-rn/dist'
import Entypo from 'react-native-vector-icons/Entypo';

const imageDefault: string = "wallpaper.jpg_967998eb-546b-4d21-8757-fd05c576e8cb";

const HomeCardMain = ({item}: {item: HOME}) => {
  const tw = useTailwind()

  return (
    <View style={tw('w-full my-2 px-2')}>
      <View style={tw('w-full flex-row items-start justify-between mt-2')}>
        <View style={tw(' flex-1 items-start justify-start ml-2')}>
          <Text style={tw('text-lg font-bold text-zinc-700 mb-2')}>{item.title}</Text>
          <Text style={tw('text-lg text-zinc-500 mb-2')}>{item.address}, {item.zipcode} {item.city.name}, {item.country.name}</Text>
          <Text style={tw('text-lg font-bold text-zinc-700 mb-2')}>£{item.price} night</Text>
        </View>
        <View style={tw('flex-row items-center justify-start ml-2')}>
          <Entypo name="star" size={20} color="black" />
          <Text style={tw(' text-lg ml-2 text-black')}>4.83</Text>
          {/* {item.rating && <Text>{item.rating}</Text>} */}
        </View>
      </View>
    </View>
  )
}

export default HomeCardMain

const styles = StyleSheet.create({})