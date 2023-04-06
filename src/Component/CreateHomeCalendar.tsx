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

interface DiscountFormCalendarProp {
    isVisble: boolean, 
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>, 
    chosenDay: string | null, 
    setChosenDay: React.Dispatch<React.SetStateAction<string | null>>,
    openDate?: string | null, 
}
const currentDay = new Date().toLocaleDateString('en-CA');

const CreateHomeCalendar = ({isVisble, setIsVisible, chosenDay, setChosenDay, openDate}: DiscountFormCalendarProp) => {
    const [isStart, setIsStart] = useState<boolean>(false);
    const [isEnd, setIsEnd] = useState<boolean>(false);
    const [isBetween, setIsBetween] = useState<boolean>(false);
    const windownHeigh = useWindowDimensions().height;
    const tw = useTailwind();
    const dispatch = useDispatch();
    const [markedDays, setMarkedDays] = useState<any>({});
    const [daySelected, setDaySelected] = useState<string | null>(null);

    const addDaySelected = (day: DateData) => {
        console.log(day);
      setMarkedDays({});
      setMarkedDays({[day.dateString] : {color: "#FF5A5F"}});
      setDaySelected(day.dateString);
    }  

    const saveFunction = () => {
        if(daySelected) {
            setChosenDay(daySelected);
            setIsVisible(false);
        }
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
        <View style={[tw('w-full bg-white relative'), {maxHeight: windownHeigh - 100, borderTopRightRadius: 20, borderTopLeftRadius: 20}]}>
            <View style={tw('flex-row items-center justify-between mt-4 ')}>         
                <TouchableOpacity onPress={() => setIsVisible(false)} style={tw('ml-4')}>
                    <Ionicons name="arrow-back" size={28} color="black" />
                </TouchableOpacity>
                <Button onPress={saveFunction} title="Save" buttonStyle={tw('w-20 h-12 rounded-lg bg-white')} titleStyle={tw('text-black font-bold')} containerStyle={tw('bg-white')}></Button>
            </View>
            <CalendarList
                // style={[tw('w-full rounded-lg'), {maxHeight: windownHeigh - 100}]}
                minDate={openDate ? openDate : currentDay}
                current={currentDay}
                hideExtraDays={true}
                enableSwipeMonths={true}
                onDayPress={day => addDaySelected(day)}
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

export default CreateHomeCalendar

const styles = StyleSheet.create({})