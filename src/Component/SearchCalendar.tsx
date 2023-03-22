import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTailwind } from 'tailwind-rn/dist'
import { useDispatch } from 'react-redux'
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import { DateData } from 'react-native-calendars/src/types';
import { now } from 'moment';
import { Button } from '@rneui/base';

interface SEARCHCALENDAR {
    checkIn: string,
    setCheckIn: React.Dispatch<React.SetStateAction<string>>,
    checkOut: string,
    setCheckOut: React.Dispatch<React.SetStateAction<string>>,
    showCalendar: boolean,
    setShowCalendar: React.Dispatch<React.SetStateAction<boolean>>
}

const currentDay = new Date().toLocaleDateString('en-CA');
const SearchCalendar = ({checkIn, checkOut, setCheckIn, setCheckOut,showCalendar, setShowCalendar}: SEARCHCALENDAR) => {
    const [isStart, setIsStart] = useState<boolean>(false);
    const [isEnd, setIsEnd] = useState<boolean>(false);
    const [closeDate, setCloseDate] = useState<string>("");
    const [startDate, setStartDate] = useState<string>("");
    const tw = useTailwind()
    const dispatch = useDispatch()
    const [markedDays, setMarkedDays] = useState<any>({})

    useEffect(() => {
        if(Object.keys(markedDays).length == 0 && checkIn && checkOut) {
            addDaysFromCheckInAndCheckOut()
        }
    }, [checkIn, checkOut])

    const clearDays = () => {
        setCheckIn("")
        setCheckOut("")
        setIsEnd(false);
        setIsStart(false);
        setStartDate("");
        setCloseDate("");
        setMarkedDays({})
    }

    const addDaySelected = (day: DateData) => {
        console.log('selected day', day);
        if(!isStart || (isStart && isEnd)) {
            setMarkedDays({[day.dateString]: {startingDay: true, color: "#FF5A5F"}})
            setStartDate(day.dateString);
            if(!isStart) {
                setIsStart(!isStart)
            }  
            setIsEnd(false)    
        } else if(isStart && !isEnd) {
            let checkInFormat = new Date(startDate);
            let checkOutFormat = new Date(day.dateString);
            console.log("checkin: " + checkInFormat)
            console.log("checkout: " + checkOutFormat)
            console.log(checkOutFormat.getDate() - checkInFormat.getDate())
            if(checkOutFormat.getDate() - checkInFormat.getDate() > 0) {
                const diffDay = checkOutFormat.getDate() - checkInFormat.getDate();
                addMiddleDays(checkInFormat, checkOutFormat, diffDay);
                setCloseDate(day.dateString);
                setIsEnd(!isEnd)
            }
        }
    }
     const addDaysFromCheckInAndCheckOut = () => {
        console.log("checkin: " + checkIn);
        console.log("checkout: " + checkOut);
        setMarkedDays({});
        setIsStart(true)
        setStartDate(checkIn)
        let checkInFormat = new Date(checkIn);
        let checkOutFormat = new Date(checkOut);
        if(checkOutFormat.getDate() - checkInFormat.getDate() > 0) {
            const diffDay = checkOutFormat.getDate() - checkInFormat.getDate();
            addMiddleDays(checkInFormat, checkOutFormat, diffDay);
            setMarkedDays({...markedDays, [checkIn]: {startingDay: true, color: "#FF5A5F"}});
            setCloseDate(checkOut);
            setIsEnd(true)
        }
        
        console.log("start date: " + startDate);
        console.log("close date: " + closeDate);
     }

     const addMiddleDays = (checkin: Date, checkout: Date, diffDay: number) => {
        let middleDay = checkin;
        let i: number = 1;
        let newMarkedDays = {};
        while(i <= diffDay)  {
            if(i == diffDay) {
                middleDay.setDate(middleDay.getDate() + 1);
                console.log(middleDay.toLocaleDateString('en-CA'));
                markedDays[middleDay.toLocaleDateString('en-CA')] = {endingDay: true,color: "#FF5A5F"}
                i++;
            } else {
                middleDay.setDate(middleDay.getDate() + 1);
                console.log(middleDay.toLocaleDateString('en-CA'));
                markedDays[middleDay.toLocaleDateString('en-CA')] = {color: "#FF5A5F"}
                i++;
            }
        }
        setMarkedDays({...markedDays, ...newMarkedDays});
     }

     const doneFunction = () => {
        setShowCalendar(!showCalendar)
        setCheckIn(startDate);
        setCheckOut(closeDate);
     }

  return (
    <>
      <Calendar
        style={tw('w-full rounded-lg')}
        
        minDate={currentDay}
        current={checkIn ? checkIn : currentDay}
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
        <View style={tw('flex-row items-center justify-between mt-2 ')}>
            <Button onPress={clearDays} title="Clear" buttonStyle={tw('w-20 h-12 rounded-lg bg-zinc-700')} titleStyle={tw('text-white font-bold')}></Button>
            <Button onPress={doneFunction} title="Done" buttonStyle={tw('w-20 h-12 rounded-lg bg-zinc-700')} titleStyle={tw('text-white font-bold')}></Button>
        </View>
    </>
  )
}

export default SearchCalendar

const styles = StyleSheet.create({})