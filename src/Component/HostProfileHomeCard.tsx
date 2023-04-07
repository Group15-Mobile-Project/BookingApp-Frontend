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
import { HOME } from '../Model';
import Entypo from 'react-native-vector-icons/Entypo';


const HostProfileHomeCard = ({home}: {home: HOME}) => {
    const windownWith = useWindowDimensions().width
    const tw = useTailwind()
    const dispatch = useDispatch()
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>() 
    const goToPostPage = () => {
        navigation.navigate("HostDetailedHome", {homeId: home.id})
      }
  return (
    <Pressable onPress={goToPostPage}  style={[tw('flex items-start justify-start rounded-lg bg-white mx-2'), {width: windownWith - 100}]}>
        <Image source={{uri: HOST_URL + "/api/images/image/" + home?.imgUrls[0]}} style={[tw('rounded-lg w-full'), { height: 200, resizeMode: 'cover'}]}></Image>
        <View style={tw(' flex-1 items-start justify-start my-2 px-2')}>
            {home?.rating && (
                    <View style={tw('flex-row items-center justify-center mr-2')}>
                        <Entypo name="star" size={24} color="black" />
                        <Text style={tw('text-lg ml-2')}>{home?.rating && (Math.round(home?.rating * 100) / 100).toFixed(2)} -</Text>
                        {home?.reviewNums && <Text style={[tw('text-lg ml-2 text-black'), {textDecorationLine: 'underline'}]}>{home?.reviewNums} {home?.reviewNums > 1 ? "reviews" : "review"}</Text>}
                    </View>
                )}
            <Text style={tw('text-lg font-bold text-gray-400')}>{home.bedrooms} bedrooms - {home.beds} beds</Text>
            <View style={{maxWidth: "80%"}}>
                <Text style={tw('text-lg text-black')}>{home.title}</Text>
            </View>
            {/* <Text style={tw('text-lg font-bold text-black')}>£{home.price}/ night</Text> */}
        </View>
  </Pressable>
  )
}

export default HostProfileHomeCard

const styles = StyleSheet.create({})