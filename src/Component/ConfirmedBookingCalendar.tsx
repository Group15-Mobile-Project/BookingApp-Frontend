
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useTailwind } from 'tailwind-rn/dist'
import { useDispatch, useSelector } from 'react-redux'
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import { DateData } from 'react-native-calendars/src/types';
import { now } from 'moment';
import { Button } from '@rneui/base';
import Modal from "react-native-modal";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BOOKDATE, BOOKING, HOME } from '../Model';
import { RootState } from '../Store/store';
import { clearBookdates, getBookdatesByBookingAction, getBookdatesByHomeAndCurrentTimeAction } from '../Store/Actions/BookDateAction';

interface ConfirmedBookingCalendarProp {
    isVisble: boolean, 
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>, 
    bookingId: number,
    booking: BOOKING
}
const currentDay = new Date().toLocaleDateString('en-CA');


const ConfirmedBookingCalendar = ({bookingId, isVisble, setIsVisible, booking}: ConfirmedBookingCalendarProp) => {
    const [isStart, setIsStart] = useState<boolean>(false);
    const [isEnd, setIsEnd] = useState<boolean>(false);
    const [isBetween, setIsBetween] = useState<boolean>(false);
    const windownHeigh = useWindowDimensions().height;
    const tw = useTailwind();
    const dispatch = useDispatch();
    const [markedDays, setMarkedDays] = useState<any>({});
    const {bookdates, bookdateSuccess, bookdateError} = useSelector((state: RootState) => state.BOOKDATES);

    const loadBookdatesByBooking = useCallback(async () => {
        if(bookingId) {
            await dispatch(getBookdatesByBookingAction(bookingId) as any)
        }
    }, [bookingId, dispatch])

    useEffect(() => {
        setMarkedDays({});
        dispatch(clearBookdates() as any);
        loadBookdatesByBooking();
    }, [bookingId])

    useEffect(() => {
        let checkoutDay = new Date(booking?.checkOutDate);
        checkoutDay.setDate(checkoutDay.getDate() - 1);
       
        bookdates.filter((bo: BOOKDATE) => bo.date != booking?.checkInDate || bo.date != checkoutDay.toLocaleDateString('en-CA')).forEach((bo : BOOKDATE) => {
            markedDays[bo.date] = {disabled: true, disableTouchEvent: true, color: "#FF5A5F"}
        });
        markedDays[booking.checkInDate] = {disabled: true, disableTouchEvent: true, color: "#FF5A5F", startingDay: true}
        markedDays[checkoutDay.toLocaleDateString('en-CA')] = {disabled: true, disableTouchEvent: true, color: "#FF5A5F", endingDay: true}
    }, [bookdates, bookingId])

    
  return (
    <Modal
    isVisible={isVisble}
    swipeDirection="down"
    animationInTiming={900}
    animationOutTiming={500}
    backdropTransitionInTiming={1000}
    backdropTransitionOutTiming={500}
    style={[tw('rounded-lg'), {justifyContent: "flex-end", margin: 0}]}
    >
        <View style={[tw('w-full bg-white relative'), {maxHeight: windownHeigh - 100, borderTopRightRadius: 20, borderTopLeftRadius: 20}]}>
            <View style={tw('flex-row items-center justify-between mt-4 ')}>         
                <TouchableOpacity onPress={() => setIsVisible(false)} style={tw('ml-4')}>
                    <Ionicons name="arrow-back" size={28} color="black" />
                </TouchableOpacity>
                <Button  title="Clear" buttonStyle={tw('w-20 h-12 rounded-lg bg-white')} titleStyle={tw('text-black font-bold')} containerStyle={tw('bg-white')}></Button>
            </View>
            <CalendarList
                minDate={booking?.checkInDate}
                current={booking?.checkInDate}
                hideExtraDays={true}
                enableSwipeMonths={true}
                onDayPress={day => console.log(day)}
                markingType={'period'}
                markedDates={markedDays} 
                theme={{
                    selectedDayBackgroundColor: "blue",
                    todayBackgroundColor: "lightBlue"
                }} 
               
            />
        </View>
    </Modal>
  )
}

export default ConfirmedBookingCalendar

const styles = StyleSheet.create({
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 9,
        },
        shadowOpacity: 0.48,
        shadowRadius: 11.95,
        elevation: 18,
    }
})