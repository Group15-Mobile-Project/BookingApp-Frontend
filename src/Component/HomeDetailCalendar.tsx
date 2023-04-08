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

interface HomeDetailCalendarProp {
    isVisble: boolean, 
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>, 
    home: HOME,
    checkout: string | null, 
    setCheckout: React.Dispatch<React.SetStateAction<string | null>>, 
    checkin: string | null, 
    setCheckin: React.Dispatch<React.SetStateAction<string | null>>,
    homeId: number
}
const currentDay = new Date().toLocaleDateString('en-CA');



const HomeDetailCalendar = ({isVisble, setIsVisible, home, checkin, checkout, setCheckin, setCheckout, homeId}: HomeDetailCalendarProp) => {
    const [isStart, setIsStart] = useState<boolean>(false);
    const [isEnd, setIsEnd] = useState<boolean>(false);
    const [startDay, setStarDay] = useState<string | null>(null);
    const [endDay, setEndDay] = useState<string | null>(null);
    const [isBetween, setIsBetween] = useState<boolean>(false);
    const windownHeigh = useWindowDimensions().height;
    const tw = useTailwind();
    const dispatch = useDispatch();
    const [markedDays, setMarkedDays] = useState<any>({});
    const {bookdates, bookdateSuccess, bookdateError} = useSelector((state: RootState) => state.BOOKDATES);

    const loadBookdatesByHome = useCallback(async () => {
        if(homeId) {
            await dispatch(getBookdatesByHomeAndCurrentTimeAction(homeId) as any)
        }
    }, [homeId, dispatch])

    useEffect(() => {
        setMarkedDays({});
        dispatch(clearBookdates() as any);
        loadBookdatesByHome();
        setStarDay(checkin);
        setEndDay(checkout);
    }, [homeId, checkin, checkout])

    useEffect(() => {
        bookdates.forEach((bo : BOOKDATE) => {
            markedDays[bo.date] = {disabled: true, disableTouchEvent: true}
        })
    }, [bookdates, home])

    useEffect(() => {
        if(home?.discount) {
            const current = new Date();
            const startDiscount = new Date(home?.discount?.openDate);
            const closeDiscount = new Date(home?.discount?.closeDate);
            console.log(home?.discount);
            if(current.getTime() <= closeDiscount.getTime()) {
                setIsBetween(true);
            } else {
                setIsBetween(false);
            }
        }
    }, [home])

    const addDaySelected = (day: DateData) => {
        console.log('selected day', day);
        if(!isStart || (isStart && isEnd)) {
            if(startDay && endDay) {
                deleteChosenDays(startDay, endDay);
            }
            setMarkedDays({...markedDays ,[day.dateString]: {startingDay: true, color: "#03b1fc"}})
            setStarDay(day.dateString);
            if(!isStart) {
                setIsStart(!isStart)
            }  
            setIsEnd(false)    
        } else if(isStart && !isEnd) {
            let checkInFormat = new Date(startDay ?? "");
            let checkOutFormat = new Date(day.dateString);
            console.log("checkin: " + checkInFormat)
            console.log("checkout: " + checkOutFormat)
            console.log(checkOutFormat.getDate() - checkInFormat.getDate())
            if(checkOutFormat.getDate() - checkInFormat.getDate() > 0) {
                const diffDay = checkOutFormat.getDate() - checkInFormat.getDate();
                addMiddleDays(checkInFormat, checkOutFormat, diffDay);
                setEndDay(day.dateString);
                setIsEnd(!isEnd)
            }
        }
    }   
    const addMiddleDays = (checkin: Date, checkout: Date, diffDay: number) => {
        let middleDay = checkin;
        let i: number = 1;
        while(i <= diffDay)  {
            if(i == diffDay) {
                middleDay.setDate(middleDay.getDate() + 1);
                console.log(middleDay.toLocaleDateString('en-CA'));
                markedDays[middleDay.toLocaleDateString('en-CA')] = {endingDay: true,color: "#03b1fc"}
                i++;
            } else {
                middleDay.setDate(middleDay.getDate() + 1);
                console.log(middleDay.toLocaleDateString('en-CA'));
                markedDays[middleDay.toLocaleDateString('en-CA')] = {color: "#03b1fc"}
                i++;
            }
        }
        setMarkedDays({...markedDays});
     }
     const deleteChosenDays = (checkin: string, checkout: string) => {
        let checkInFormat = new Date(checkin);
        let checkOutFormat = new Date(checkout);
        const diffDay = checkOutFormat.getDate() - checkInFormat.getDate();
        console.log("diffday: " + diffDay);
        let middleDay  = checkInFormat;
        middleDay.setDate(middleDay.getDate() + 1)
        let i: number = 1;
        while(i < diffDay)  {
            console.log(middleDay.toLocaleString('en-CA'));
            delete markedDays[middleDay.toLocaleDateString('en-CA')];    
            i++;
            middleDay.setDate(middleDay.getDate() + 1);
            
        }
        delete markedDays[checkin ?? ""];
        delete markedDays[checkout ?? ""];
        setMarkedDays({...markedDays});
     }

     const saveDate = () => {
        console.log("checkin: " + checkin);
        console.log("checkout: " + checkout);
        setCheckin(startDay);
        setCheckout(endDay)
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
        <View style={[tw('w-full bg-white relative'), {maxHeight: windownHeigh - 100, borderTopRightRadius: 20, borderTopLeftRadius: 20}]}>
            <View style={tw('flex-row items-center justify-between mt-4 ')}>         
                <TouchableOpacity onPress={() => setIsVisible(false)} style={tw('ml-4')}>
                    <Ionicons name="arrow-back" size={28} color="black" />
                </TouchableOpacity>
                <Button  title="Clear" buttonStyle={tw('w-20 h-12 rounded-lg bg-white')} titleStyle={tw('text-black font-bold')} containerStyle={tw('bg-white')}></Button>
            </View>
            <CalendarList
                // style={[tw('w-full rounded-lg'), {maxHeight: windownHeigh - 100}]}
                minDate={currentDay}
                maxDate={home.closeBooking}
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
        <View style={[tw('bg-white flex-row items-center justify-between absolute w-full bottom-0 px-2 py-2'), {zIndex: 10}, styles.shadow]}>  
            {home?.discount && isBetween ? (
                <View>
                    <Text style={[tw('ml-4 text-gray-400 font-bold text-lg'), {textDecorationLine: 'line-through'}]}>£{home.price}</Text>
                    <Text style={tw('ml-4 text-black font-bold text-lg')}>£{Math.round(home.price - (home?.discount?.discountRate * home.price / 100))} night</Text>
                    <Text style={[tw('ml-4 text-gray-400 font-bold text-base') ]}> {home?.discount?.openDate && new Date(home?.discount?.openDate).toLocaleString('en-us',{ day: 'numeric', month:'short'})} - {new Date(home?.discount?.closeDate) && new Date(home?.discount?.closeDate).toLocaleString('en-us',{ day: 'numeric', month:'short'})}</Text>
                </View>
            ) : (
                <Text style={tw('ml-4 text-black font-bold text-lg')}>£{home.price} night</Text>
            )}
            <Button onPress={saveDate}  title="Save" buttonStyle={tw('w-20 h-12 rounded-lg bg-zinc-700')} titleStyle={tw('text-white font-bold')} ></Button>
        </View>
    </Modal>
  )
}

export default HomeDetailCalendar

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