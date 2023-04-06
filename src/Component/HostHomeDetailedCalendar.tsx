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
import { BOOKDATE, HOME } from '../Model';
import { RootState } from '../Store/store';
import { clearBookdates, getBookdatesByHomeAndCurrentTimeAction } from '../Store/Actions/BookDateAction';

interface HostHomeDetailCalendarProp {
    isVisble: boolean, 
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>, 
    home: HOME,
    homeId: number
}
const currentDay = new Date().toLocaleDateString('en-CA');


const HostHomeDetailedCalendar = ({isVisble, setIsVisible, home, homeId}: HostHomeDetailCalendarProp) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // const [bookingId, setBookingId] = useState<number | null>(null);
    const windownHeigh = useWindowDimensions().height;
    const tw = useTailwind();
    const dispatch = useDispatch();
    const [markedDays, setMarkedDays] = useState<any>({});
    const {bookdates, bookdateSuccess, bookdateError} = useSelector((state: RootState) => state.BOOKDATES);
    const {users, authUser, userError, userSuccess, message} = useSelector((state: RootState) => state.USERS);

    const loadBookdatesByBooking = useCallback(async () => {
       if(authUser) {
        await dispatch(getBookdatesByHomeAndCurrentTimeAction(homeId) as any)
       }
    }, [authUser, dispatch])

    useEffect(() => {
        setIsLoading(true);
        setMarkedDays({});
        dispatch(clearBookdates() as any);
        loadBookdatesByBooking().then(() => setIsLoading(false));    
    }, [authUser, dispatch])

    useEffect(() => {      
        bookdates.forEach((bo : BOOKDATE) => {
            markedDays[bo.date] = { color: "#FF5A5F", key: bo.bookingId};
        });
    }, [bookdates, authUser])


  return (
    <Modal
    isVisible={isVisble}
    // onBackdropPress={() => setIsVisible(false)}
    // onBackButtonPress={() => setIsVisible(false)}
    swipeDirection="down"
    // onSwipeComplete={() => setIsVisible(prev => !prev)}
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
            </View>
        {markedDays && bookdates && (
            <CalendarList
                minDate={currentDay}
                current={currentDay}
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
        )}
        </View>
    </Modal>
  )
}

export default HostHomeDetailedCalendar

const styles = StyleSheet.create({})