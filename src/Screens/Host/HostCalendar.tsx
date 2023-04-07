import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React, { useCallback, useEffect, useState, useLayoutEffect } from 'react'
import { useTailwind } from 'tailwind-rn/dist'
import { useDispatch, useSelector } from 'react-redux'
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import { DateData } from 'react-native-calendars/src/types';
import { now } from 'moment';
import { Button } from '@rneui/base';
import Modal from "react-native-modal";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RootState } from '../../Store/store'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { HomesStackParamList } from '../../Navigators/HomesStack';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../Navigators/MainStack';
import { HostBottomTabProps } from '../../Navigators/HostStack';
import { BOOKDATE } from '../../Model';
import { clearBookdates, getBookdatesByAuthHostAction } from '../../Store/Actions/BookDateAction';
import LoadingComponent from '../../Component/LoadingComponent';

type HostCalendarNavigationProp = CompositeNavigationProp<
NativeStackNavigationProp<HostBottomTabProps, "HostCalendar">,
NativeStackNavigationProp<RootStackParamList>>;

const currentDay = new Date().toLocaleDateString('en-CA');
const HostCalendar = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // const [bookingId, setBookingId] = useState<number | null>(null);
    const windownHeigh = useWindowDimensions().height;
    const tw = useTailwind();
    const dispatch = useDispatch();
    const [markedDays, setMarkedDays] = useState<any>({});
    const {bookdates, bookdateSuccess, bookdateError} = useSelector((state: RootState) => state.BOOKDATES);
    const {users, authUser, userError, userSuccess, message} = useSelector((state: RootState) => state.USERS);
    const navigation = useNavigation<HostCalendarNavigationProp>();

    const loadBookdatesByBooking = useCallback(async () => {
       if(authUser) {
        await dispatch(getBookdatesByAuthHostAction() as any)
       }
    }, [authUser, dispatch])

    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => (
                <View style={tw('bg-white py-4 px-4 flex-row items-center')}>
                    <TouchableOpacity style={tw('mr-4')} onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={tw('text-2xl text-black')}>Host Calendar</Text>
                </View>
            )
        })
    }, [])

    useEffect(() => {
        setIsLoading(true);
        setMarkedDays({});
        dispatch(clearBookdates() as any);
        loadBookdatesByBooking().then(() => setIsLoading(false));    
    }, [authUser, dispatch])
    // useEffect(() => {
    //     if(bookingId) {
    //         navigation.navigate('HostDetailBookingScreen', {bookingId: bookingId});
    //     }
    // }, [bookingId])

    useEffect(() => {      
        bookdates.forEach((bo : BOOKDATE) => {
            markedDays[bo.date] = { color: "#03b1fc", key: bo.bookingId};
        });
    }, [bookdates, authUser])

    const handlePressDay = async (day: DateData) => {
        if(markedDays[day.dateString]) {
            // setBookingId(null);
            console.log(day);
            console.log(markedDays[day.dateString]);
            const markday = markedDays[day.dateString];
            const bookingId = markday.key
            console.log("bookingId " + bookingId);
            if(bookingId) {
                navigation.navigate('HostDetailBookingScreen', {bookingId: bookingId});
            }
            // setBookingId(markday.key);
        } else {
            console.log(day);
        }
    }

    if(isLoading) {
        return <LoadingComponent/>
    }

  return (
    <SafeAreaView>
        {markedDays && bookdates && (
            <CalendarList
                minDate={currentDay}
                current={currentDay}
                hideExtraDays={true}
                enableSwipeMonths={true}
                onDayPress={day => handlePressDay(day)}
                markingType={'period'}
                markedDates={markedDays} 
                theme={{
                    selectedDayBackgroundColor: "blue",
                    todayBackgroundColor: "lightBlue"
                }}        
            />
        )}
    </SafeAreaView>
  )
}

export default HostCalendar

const styles = StyleSheet.create({})