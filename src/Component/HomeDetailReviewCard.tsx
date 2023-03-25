import { FlatList, Image, ListRenderItem, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import { HOME, HOMEREVIEW } from '../Model'
import { useTailwind } from 'tailwind-rn/dist'
import Entypo from 'react-native-vector-icons/Entypo';
import { useWindowDimensions } from 'react-native';
import { HOST_URL } from '../Store/store';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigators/MainStack';
import { useNavigation } from '@react-navigation/native';

const imageDefault =[
  "wallpaper.jpg_a776d37b-97c9-4bd6-b4ca-1f342de06161",
  "Cabin-in-the-city-Best-Airbnbs-in-Ontario-819x1024.jpeg_89abc5d3-cd57-4fae-92ed-96bb77daf640",
  "dormir-dans-une-ferme-en-suède-best-airbnb-in-south-sweden-main.jpg_c83de24f-f4d0-4367-96ef-96d261a99e94"
]

const HomeDetailReviewCard = ({item}: {item: HOMEREVIEW}) => {
  const tw = useTailwind()
  const windownWith = useWindowDimensions().width;
  const date = new Date();
  const reviewDate = new Date(item?.createDate);
  const diffDate = ( date.getTime() - reviewDate.getTime()) / 1000 / 60 / 60 / 24;
  return (
    <View style={[tw('border border-gray-400 rounded-lg py-2 px-2 mx-2'), {width: windownWith - 100}]}>
      <View style={tw('flex-row items-center justify-start')}>
        <Image source={{uri: HOST_URL + "/api/images/image/" + imageDefault[0]}} style={[tw('rounded-full mr-4'), {width: 40, height: 40, resizeMode: 'cover'}]}></Image>      
        <View style={tw(' items-start justify-start')}>
          <Text style={tw(' text-lg text-black font-bold')}>{item.user.username}</Text>
          <Text style={tw(' text-base')}>{diffDate <= 1 ? " day ago": diffDate > 30 ? Math.floor(diffDate / 30) + " months ago" :  Math.round(diffDate) + " days ago" }</Text>
        </View>
      </View>
      <Text style={tw(' my-2 text-lg')}>{item.content}</Text>
    </View>
  )
}

export default HomeDetailReviewCard

const styles = StyleSheet.create({})