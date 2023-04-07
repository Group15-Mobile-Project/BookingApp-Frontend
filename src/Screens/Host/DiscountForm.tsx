import { Alert,  Keyboard, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useTailwind } from 'tailwind-rn/dist'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from '@rneui/themed';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CompositeNavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import axios from 'axios';
import { RootState } from '../../Store/store';
import { RootStackParamList } from '../../Navigators/MainStack';
import { HostBottomTabProps } from '../../Navigators/HostStack';
import { getHomesByHomeIdAction } from '../../Store/Actions/HomeAction';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DiscountFormCalendar from '../../Component/DiscountFormCalendar';
import { createDiscountAction, updateDiscountAction } from '../../Store/Actions/DiscountAction';
import LoadingComponent from '../../Component/LoadingComponent';

export type DiscountFormNavigationProp = CompositeNavigationProp<
NativeStackNavigationProp<RootStackParamList, "DiscountForm">,
NativeStackNavigationProp<HostBottomTabProps>>;

type DiscountFormProp = RouteProp<RootStackParamList, "DiscountForm">;

const DiscountForm = () => {
    const [isLoading, setIsloading] = useState<boolean>(false);
    const currentDay = new Date().toLocaleDateString('en-CA');
    const [openDate, setOpenDate] = useState<string>(currentDay);
    const [closeDate, setCloseDate] = useState<string>(currentDay);
    const [openVisible, setOpenVisible] = useState<boolean>(false);
    const [closeVisible, setCloseVisible] = useState<boolean>(false);
    const [openDiscount, setOpenDiscount] = useState<string | null>(null);
    const [closeDiscount, setCloseDiscount] = useState<string | null>(null);
    const [rate, setRate] = useState<number>(0);
    const tw = useTailwind();
    const {users, authUser, userError, userSuccess, message} = useSelector((state: RootState) => state.USERS);
    const {home, homeSuccess, homeError} = useSelector((state: RootState) => state.HOMES);
    const {discount, discounts, discountSuccess, discountError} = useSelector((state: RootState) => state.DISCOUNTS);
    const dispatch = useDispatch()
    const navigation = useNavigation<DiscountFormNavigationProp>() 
    const {params} = useRoute<DiscountFormProp>();
    const {homeId, discountId}= params;

    

    const loadHome = useCallback(async () => {
        if(homeId) {
            await dispatch(getHomesByHomeIdAction(homeId) as any)
        }
    }, [homeId, dispatch])

    const submitFunction = async () => {
        if(openDiscount && closeDiscount && rate) {
            const obj = {
                openDate: openDiscount,
                closeDate: closeDiscount,
                discountRate: rate,
                homeId: homeId
            };
            console.log(obj);
            if(discountId) {
                console.log("update discount : " + discountId);
                await dispatch(updateDiscountAction(discountId, obj) as any);
                await loadHome();
                navigation.goBack();
            } else {
                console.log("create new discount");
                await dispatch(createDiscountAction(obj) as any);
                await loadHome();
                navigation.goBack();
            }
        }
    }

    useEffect(() => {
        if(home && home?.id == homeId) {
            setOpenDiscount(home?.discount?.openDate);
            setCloseDiscount(home?.discount?.closeDate);
            setRate(home?.discount?.discountRate);
        }
    }, [home])

    useEffect(() => {
        setIsloading(true)
        loadHome().then(() => setIsloading(false));
    }, [homeId, discountId])

    if(isLoading) {
        return <LoadingComponent/>
    }

  return (
    <KeyboardAvoidingView style={tw('flex-1')}>
        <TouchableWithoutFeedback style={tw('flex-1')} onPress={Keyboard.dismiss}>
            <SafeAreaView style={tw('flex-1 items-center justify-center px-4')}>
                <View style={tw('items-start justify-start w-full')}>
                    <Text style={tw('text-black font-bold text-2xl mb-2')}>Discount</Text>  
                    <Text>(Max discount rate is 100%)</Text>                 
                    <TextInput keyboardType='numeric' value={rate + ""} onChangeText={text => setRate(+text)} style={tw('w-full border border-gray-400 py-2 px-4 rounded-lg text-lg mb-6 mt-2')}></TextInput>
                </View>
                <View style={tw('items-start justify-start w-full')}>
                    <View style={tw('flex-row items-center mb-2')}>
                        <Text style={tw('text-black font-bold text-2xl mr-4')}>Open Date</Text>
                        <TouchableOpacity onPress={() => setOpenVisible(!openVisible)}>
                            <AntDesign name="calendar" size={28} color="#03b1fc" /> 
                        </TouchableOpacity>   
                    </View>                 
                    <View style={tw('w-full border border-gray-400 py-2 px-4 rounded-lg text-lg mb-6 mt-2')}>
                        <Text style={tw('text-lg')}>{openDiscount ? openDiscount : openDate}</Text>
                    </View>
                </View>
                <View style={tw('items-start justify-start w-full')}>
                    <View style={tw('flex-row items-center mb-2')}>
                        <Text style={tw('text-black font-bold text-2xl mr-4')}>Close Date</Text>
                        <TouchableOpacity onPress={() => setCloseVisible(!closeVisible)}>
                            <AntDesign name="calendar" size={28} color="#03b1fc" /> 
                        </TouchableOpacity>   
                    </View>                 
                    <View style={tw('w-full border border-gray-400 py-2 px-4 rounded-lg text-lg mb-6 mt-2')}>
                        <Text style={tw('text-lg')}>{closeDiscount ? closeDiscount : closeDate}</Text>
                    </View>
                </View>
                <Button  color="#03b1fc" containerStyle={tw('w-full rounded-lg mb-6')} size='lg' title='Add Discount' onPress={submitFunction}></Button>
                {home && openVisible && (
                    <DiscountFormCalendar isVisble={openVisible} setIsVisible={setOpenVisible} chosenDay={openDiscount} setChosenDay={setOpenDiscount} closeHome={home?.closeBooking} openHome={home?.openBooking}></DiscountFormCalendar>
                )}      
                {home && closeVisible && (
                    <DiscountFormCalendar isVisble={closeVisible} setIsVisible={setCloseVisible} chosenDay={closeDiscount} setChosenDay={setCloseDiscount} closeHome={home?.closeBooking} openHome={home?.openBooking} openDate={openDiscount}></DiscountFormCalendar>
                )}      
            </SafeAreaView>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>

  )
}

export default DiscountForm

const styles = StyleSheet.create({})