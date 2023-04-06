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
import AntDesign from 'react-native-vector-icons/AntDesign';
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

export type HostHomeListingNavigationProp = CompositeNavigationProp<
NativeStackNavigationProp<HostBottomTabProps, "HostHomeListingScreen">,
NativeStackNavigationProp<RootStackParamList>>;

const HostHomeListingScreen = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const windownHeigh = useWindowDimensions().height;
    const tw = useTailwind();
    const dispatch = useDispatch();
    const {users, authUser, userError, userSuccess, message} = useSelector((state: RootState) => state.USERS);
    const {homes, homeSuccess, homeError} = useSelector((state: RootState) => state.HOMES);
    const navigation = useNavigation<HostHomeListingNavigationProp>();

    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => (
                <View style={tw('bg-white py-2 px-4 flex-row items-center')}>
                    <TouchableOpacity style={tw('mr-4')} onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={tw('text-2xl text-black')}>Your homes</Text>
                </View>
            )
        })
    }, [])   

    const handleGetHomes = useCallback(async () => {
        setIsRefreshing(true);
        await dispatch(getHomesByHostAction(authUser?.hostId) as any);
        setIsRefreshing(false);
    }, [ dispatch, authUser]); 

    useEffect(() => {
        setIsLoading(true)
        handleGetHomes().then(() => setIsLoading(false))
    }, [authUser, dispatch])

    const handleRenderItem: ListRenderItem<any> = ({item}: {item: HOME}) => (
       <HostHomeCard item={item}></HostHomeCard>
    )

  return (
    <SafeAreaView style={tw('flex-1 bg-white  relative')}> 
        <TouchableOpacity onPress={() => navigation.navigate("CreateHomeScreen")} style={[tw('flex-row items-center px-4 py-2 justify-start w-full mb-2 bg-white mt-4'), styles.shadow]}>
            <MaterialCommunityIcons name="home-plus-outline" size={34} color="gray" /> 
            <View style={tw('flex-1')}>
                <Text style={tw('text-lg ml-4 font-bold text-black')}>Add new home</Text>
            </View>
            <View style={tw('ml-2')}>
                <AntDesign name="right" size={24} color="black" /> 
            </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("UserProfileScreen", {userId: authUser?.id})} style={[tw('flex-row items-center px-4 py-2 justify-start w-full mb-4 bg-white mt-2'), styles.shadow]}>
            <Ionicons name="person" size={34} color="gray" /> 
            <View style={tw('flex-1')}>
                <Text style={tw('text-lg ml-4 font-bold text-black')}>your profile</Text>
            </View>
            <View style={tw('ml-2')}>
                <AntDesign name="right" size={24} color="black" /> 
            </View>
        </TouchableOpacity>
        <FlatList
            refreshing={isRefreshing}
            onRefresh={handleGetHomes}
            data={homes}
            keyExtractor={(item: any) => item.id}
            renderItem={handleRenderItem}
            showsVerticalScrollIndicator={false}
            >
        </FlatList>
        {/* <TouchableOpacity onPress={navigateToMapHome}  style={[tw('mx-2 absolute bottom-4 bg-white p-2 rounded-full'), {zIndex: 10, left: windownWith/2 - 30}]}>
            <Entypo name="map" size={28} color="black" />
        </TouchableOpacity> */}
    </SafeAreaView>
  )
}

export default HostHomeListingScreen


const styles = StyleSheet.create({
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        
        elevation: 5,
    }
})