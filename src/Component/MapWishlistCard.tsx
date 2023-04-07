import { Image, Keyboard, KeyboardAvoidingView, ListRenderItem, Pressable, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, useWindowDimensions, View } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTailwind } from 'tailwind-rn/dist'
import { SafeAreaView } from 'react-native-safe-area-context';
import { HOST_URL, RootState } from '../Store/store';
import { RootStackParamList } from '../Navigators/MainStack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import MapView, { Marker, PROVIDER_GOOGLE }  from 'react-native-maps';
import CustomeMapMarker from '../Component/CustomeMapMarker';
import { HOME, WISHLIST } from '../Model';


const MapWishlistCard = ({item}: {item: WISHLIST}) => {
    const windownWith = useWindowDimensions().width
    const tw = useTailwind()
    const dispatch = useDispatch()
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>() 
    const goToPostPage = () => {
        navigation.navigate("DetailHomeScreen", {homeId: item.homeResponse.id})
      }
  return (
    <Pressable onPress={goToPostPage}  style={[tw('flex flex-row items-center justify-between rounded-lg bg-white mx-2'), {width: windownWith - 20}]}>
         {item?.homeResponse?.imgUrls && item?.homeResponse?.imgUrls.length > 0 && (
            <Image source={{uri: HOST_URL + "/api/images/image/" + item?.homeResponse?.imgUrls[0]}} style={[tw('rounded-lg'), {width: 150, height: 120, resizeMode: 'cover'}]}></Image>
        )}
        <View style={tw(' flex-1 items-start justify-start px-4')}>
            <Text style={tw('text-lg font-bold text-gray-400')}>{item.homeResponse.bedrooms} bedrooms - {item.homeResponse.beds} beds</Text>
            <View style={{maxWidth: "80%"}}>
                <Text style={tw('text-lg text-black')}>{item.homeResponse.title}</Text>
            </View>
            <Text style={tw('text-lg font-bold text-black')}>£{item.homeResponse.price}/ night</Text>
        </View>
  </Pressable>
  )
}

export default MapWishlistCard

const styles = StyleSheet.create({})