import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { CATEGORY } from '../Model'
import { useTailwind } from 'tailwind-rn/dist'
import { HOST_URL } from '../Store/store'

const imageDefault = "cottage-vector-icon-isolated-white-background-outline-thin-line-website-design-mobile-app-development-illustration-189426532.jpg_840e4719-f8a7-49a4-9734-8763879881f1";

const HomeCategoryCard = ({item, categoryIndex, setCategoryIndex}: {item: CATEGORY, categoryIndex: any, setCategoryIndex: any}) => {
    const tw = useTailwind()
  return (
    <TouchableOpacity onPress={() => setCategoryIndex(item.id)} style={tw('my-2 mx-2 ')}>
      <Image source={{uri: HOST_URL + "/api/images/image/" + item.imageUrl}} style={[tw('rounded-lg mr-2'), {width: 50, height: 50, resizeMode: 'cover'}]}></Image>  
      <Text style={tw(`${categoryIndex == item.id ? "text-black" : "text-gray-400"} pb-2`)}>{item.name}</Text>
      {item.id == categoryIndex && (
        <View style={[tw('w-full bg-black rounded-lg'), {height: 4}]}></View>
      )}  
    </TouchableOpacity>
  )
}

export default HomeCategoryCard

const styles = StyleSheet.create({})