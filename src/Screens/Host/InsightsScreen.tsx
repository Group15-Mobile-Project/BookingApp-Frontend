import { Pressable, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React, { useCallback, useEffect, useState, useLayoutEffect } from 'react'
import { useTailwind } from 'tailwind-rn/dist'
import { useDispatch, useSelector } from 'react-redux'
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import { DateData } from 'react-native-calendars/src/types';
import { now } from 'moment';
import { Button } from '@rneui/base';
import Modal from "react-native-modal";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootState } from '../../Store/store'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { HomesStackParamList } from '../../Navigators/HomesStack';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../Navigators/MainStack';
import { HostBottomTabProps } from '../../Navigators/HostStack';
import { BOOKDATE, HOME } from '../../Model';
import { clearBookdates, getBookdatesByAuthHostAction } from '../../Store/Actions/BookDateAction';
import { getHomesByHostAction } from '../../Store/Actions/HomeAction';
import { ListRenderItem } from 'react-native';
import HostHomeCard from '../../Component/HostHomeCard';
import { FlatList } from 'react-native';
import LoadingComponent from '../../Component/LoadingComponent';
import { getHostStatisticsByAuthUser } from '../../Store/Actions/HostAction';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

export type HostHomeListingNavigationProp = CompositeNavigationProp<
NativeStackNavigationProp<HostBottomTabProps, "InsightsScreen">,
NativeStackNavigationProp<RootStackParamList>>;

const InsightsScreen = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const tw = useTailwind();
    const dispatch = useDispatch();
    const {users, authUser, userError, userSuccess, message} = useSelector((state: RootState) => state.USERS);
    const {homes, homeSuccess, homeError} = useSelector((state: RootState) => state.HOMES);
    const {stas, hostSuccess, hostError} = useSelector((state: RootState) => state.HOSTS);
    const navigation = useNavigation<HostHomeListingNavigationProp>();

    const loadStatistics = useCallback(async () => {
        if(authUser) {
            await dispatch(getHostStatisticsByAuthUser() as any);
        }
    }, [authUser])

    useEffect(() => {
        setIsLoading(true);
        loadStatistics().then(() => setIsLoading(false));
    }, [authUser])

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false
        })
    }, [])

    if(isLoading) {
        return <LoadingComponent></LoadingComponent>
    }
    if(!stas) {
        return <Text>No statistics</Text>
    }

  return (
    <SafeAreaView style={tw('flex-1 bg-white px-2')}>
        <Text style={tw('text-3xl font-bold text-black mt-6 ml-4 mb-8')}>Statistics</Text>
        <View style={tw('items-center justify-start rounded-2xl py-4 border-2 border-[#03b1fc] w-2/3 px-4  my-2 mx-auto')}>
            <Text style={tw('text-2xl text-black mb-2 font-bold')}>{stas?.homes} {stas?.homes > 1 ? "homes": "home"}</Text>
            <MaterialCommunityIcons name="home-group" size={30} color="#03b1fc"/>  
        </View>
        <View style={tw('items-center justify-start rounded-2xl py-4 border-2 border-[#03b1fc] w-2/3 px-4  my-2 mx-auto')}>
            <Text style={tw('text-2xl text-black mb-2 font-bold')}>{stas?.bookings} {stas?.bookings > 1 ? "bookings": "booking"}</Text>
            <AntDesign name="calendar" size={30} color="#03b1fc"/>  
        </View>
        <View style={tw('items-center justify-start rounded-2xl py-4 border-2 border-[#03b1fc] w-2/3 px-4  my-2 mx-auto')}>
            <Text style={tw('text-2xl text-black mb-2 font-bold')}>£{Math.round(stas?.earnings / 100 * 100).toFixed(2)}</Text>
            <FontAwesome name="money" size={30} color="#03b1fc"/>  
        </View>
        <View style={tw('items-center justify-start rounded-2xl py-4 border-2 border-[#03b1fc] w-2/3 px-4  my-2 mx-auto')}>
            <Text style={tw('text-2xl text-black mb-2 font-bold')}>{stas?.reviews} {stas?.reviews > 0 ? "reviews" : "review"}</Text>
            <Octicons name="checklist" size={30} color="#03b1fc"/>  
        </View>
       
        {/* <View style={tw('items-center justify-start rounded-2xl py-4 border-2 border-[#03b1fc] w-2/3 px-4  my-2 mx-auto')}>
            <Text style={tw('text-2xl text-black mb-2 font-bold')}>Overall rating {stas?.rating ? stas?.rating : "5"}</Text>
            <FontAwesome name="star" size={30} color="#03b1fc"/>  
        </View> */}
        
  </SafeAreaView>
  )
}

export default InsightsScreen

const styles = StyleSheet.create({})
