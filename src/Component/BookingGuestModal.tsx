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
import { getBookdatesByHomeAndCurrentTimeAction } from '../Store/Actions/BookDateAction';
import IncreaseDecreaseNumber from './IncreaseDecreaseNumber';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface BookingGuestModalProp {
    isVisble: boolean, 
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>, 
    guests: number,
    setGuests: React.Dispatch<React.SetStateAction<number>>
}
const currentDay = new Date().toLocaleDateString('en-CA');

const BookingGuestModal = ({isVisble, setIsVisible, guests, setGuests}: BookingGuestModalProp) => {
    const windownHeigh = useWindowDimensions().height;
    const tw = useTailwind();
    const dispatch = useDispatch();
    const [num, setNum] = useState<number>(0);

    useEffect(() => {
       if(guests) {
        setNum(guests);
       }
    }, [guests])

    
    const saveGuests = () => {
        setGuests(num);
        setIsVisible(false);
     }

     const cancelGuests = () => {
        setGuests(num);
        setIsVisible(false);
     }
  
    
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
        <View style={[tw('w-full bg-white'), {height: 250, borderTopRightRadius: 20, borderTopLeftRadius: 20}]}>
            <View style={tw('w-full px-4 py-2 mt-4')}>
                <TouchableOpacity onPress={cancelGuests} style={tw('flex-row')}>
                    <AntDesign name="close" size={24} color="black" /> 
                    <Text style={tw('ml-4 font-bold text-black text-lg')}>Guests</Text>
                </TouchableOpacity>
            </View>
            <View style={[tw('w-full bg-gray-200'), {height: 2}]}></View>
            <View style={[tw('w-full flex-row items-center justify-between py-4 px-4')]}>
                <View style={tw('items-start justify-start w-full flex-1')}> 
                    <Text style={tw('text-2xl font-bold text-black')}>Guests</Text>
                </View>
                <IncreaseDecreaseNumber currentNum={num} setCurrentNum={setNum}></IncreaseDecreaseNumber>
            </View>
            <View style={[tw('bg-white flex-row items-center justify-between absolute w-full bottom-0 px-2 py-2'), {zIndex: 10}, styles.shadow]}>  
                <Button onPress={cancelGuests}  title="Cancel" buttonStyle={tw('w-20 h-12 rounded-lg bg-white')} titleStyle={tw('text-black font-bold')} ></Button>
                <Button onPress={saveGuests}  title="Save" buttonStyle={tw('w-20 h-12 rounded-lg bg-zinc-700')} titleStyle={tw('text-white font-bold')} ></Button>
        </View>
        </View> 
    </Modal>
  )
}

export default BookingGuestModal

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