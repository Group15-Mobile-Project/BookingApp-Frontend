import { Keyboard, KeyboardAvoidingView, ListRenderItem, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTailwind } from 'tailwind-rn/dist'
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootState } from '../Store/store';
import { RootStackParamList } from '../Navigators/MainStack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import MapView, { Marker, PROVIDER_GOOGLE }  from 'react-native-maps';
import CustomeMapMarker from '../Component/CustomeMapMarker';
import MapHomeCard from '../Component/MapHomeCard';
import { FlatList } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { HOME } from '../Model'
import AntDesign from 'react-native-vector-icons/AntDesign';

const HomeDetailMap = ({home}: {home: HOME}) => {
    const tw = useTailwind();
    const dispatch = useDispatch();
    const windownWith = useWindowDimensions().width
    const map = useRef<any>();

    
    useEffect(() => {
        if(home ) {
            const region = {
                latitude: Number(home.latitude),
                longitude: Number(home.longtitude),
                latitudeDelta: 0.7,
                longitudeDelta: 0.7,
            }
            // console.log(region);
            map.current.animateToRegion(region);
        } 
    }, [home])

  return (
    <View style={[tw('w-full my-2'),]}>
        <Text style={[tw('ml-4 text-black text-2xl font-bold my-2 ')]}>Where you will be</Text>
        <MapView      
                ref={map}
                initialRegion={{
                    latitude: Number(home.latitude),
                    longitude: Number(home.longtitude),
                    latitudeDelta: 0.7,
                    longitudeDelta: 0.7,
                }}
                style={{height: 400, width: "100%"}}
                provider={PROVIDER_GOOGLE}  
            >
            <Marker coordinate={{latitude: Number(home.latitude), longitude: Number(home.longtitude)}} >            
                <View style={tw('bg-[#FF5A5F] p-2 rounded-full')}>
                    <AntDesign name="home" size={24} color="white" />
                </View>
            </Marker>
        </MapView>
        <View style={tw('w-full my-2 pl-4 pr-4')}>
            <Text style={tw('text-lg ml-2 text-black font-bold')}>{home?.city?.name}, {home?.country?.name}</Text>
            <View style={[tw('w-full my-4 bg-gray-400'), {height: 1}]}></View>
        </View>
    </View>
  )
}

export default HomeDetailMap

const styles = StyleSheet.create({})