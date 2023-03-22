import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useTailwind } from 'tailwind-rn/dist'

const HomeCardDots = ({arrayLength, activeIndex}: {arrayLength: number, activeIndex: number}) => { 
    const tw = useTailwind()
    
    return (
    <View style={tw('mx-2 flex-row')}>
      {[...Array(arrayLength).keys()].map((index: number) => <View key={index} style={tw(`w-2 h-2 mr-2 rounded-full ${index == activeIndex ? "bg-gray-700" : "bg-gray-300"}`)}></View>)}
    </View>
    )
}

export default HomeCardDots

const styles = StyleSheet.create({})