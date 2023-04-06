import { Alert, Pressable, ScrollView, StyleSheet, Text, Touchable, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React, { useCallback, useEffect, useState, useLayoutEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { HOST_URL, RootState } from '../../Store/store';
import { RootStackParamList } from '../../Navigators/MainStack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute, CompositeNavigationProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useTailwind } from 'tailwind-rn/dist'
import { cancelBookingAction, clearBooking, createBookingAction, getBookingByIdAction, getCountDiscountAction, updateBookingAction } from '../../Store/Actions/BookingAction';
import BookingHomeCard from '../../Component/BookingHomeCard';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Button, Image } from '@rneui/base';
import { HomesStackParamList } from '../../Navigators/HomesStack';
import { clearBookdates, getBookdatesByHomeAndCurrentTimeAction } from '../../Store/Actions/BookDateAction';
import { BOOKDATE } from '../../Model';
import { CalendarList, DateData } from 'react-native-calendars';

type UpdateBookingScreenNavigationProp = CompositeNavigationProp<
NativeStackNavigationProp<RootStackParamList, "UpdateBookingScreen">,
NativeStackNavigationProp<HomesStackParamList>>;

type UpdateBookingScreenRouteProp = RouteProp<RootStackParamList, "UpdateBookingScreen">;

const imageDefault =[
    "wallpaper.jpg_a776d37b-97c9-4bd6-b4ca-1f342de06161",
    "Cabin-in-the-city-Best-Airbnbs-in-Ontario-819x1024.jpeg_89abc5d3-cd57-4fae-92ed-96bb77daf640",
    "dormir-dans-une-ferme-en-suède-best-airbnb-in-south-sweden-main.jpg_c83de24f-f4d0-4367-96ef-96d261a99e94"
];


const UpdateBookingScreen = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const tw = useTailwind()
    const windownWith = useWindowDimensions().width;
    const currentDate = new Date().toLocaleDateString('en-CA');
    const currentTime = new Date().getTime();
    const [checkin, setCheckin] = useState<string | null>(null);
    const [checkout, setCheckout] = useState<string | null>(null);
    const {home, homeSuccess, homeError} = useSelector((state: RootState) => state.HOMES)
    const {booking, bookingSuccess, bookingError, countDiscount} = useSelector((state: RootState) => state.BOOKINGS);
    const {bookdates, bookdateSuccess, bookdateError} = useSelector((state: RootState) => state.BOOKDATES);
    const {users, authUser, userError, userSuccess, message} = useSelector((state: RootState) => state.USERS);
    const navigation = useNavigation<UpdateBookingScreenNavigationProp>() 
    const {params} = useRoute<UpdateBookingScreenRouteProp>();
    const {bookingId, homeId}= params;
    const dispatch = useDispatch();
    const windownHeigh = useWindowDimensions().height;
    const [isStart, setIsStart] = useState<boolean>(false);
    const [isEnd, setIsEnd] = useState<boolean>(false);
    const [isBetween, setIsBetween] = useState<boolean>(false);
    const [markedDays, setMarkedDays] = useState<any>({});
 

    const loadBooking = useCallback(async () => {
        if(bookingId) {
            await dispatch(getBookingByIdAction(bookingId) as any)
        }
    }, [bookingId, dispatch]);

    const loadBookdatesByHome = useCallback(async () => {
        if(homeId) {
            await dispatch(getBookdatesByHomeAndCurrentTimeAction(homeId) as any)
        }
    }, [homeId, dispatch]);

    const loadChangeCountDiscount = useCallback(async () => {
        if(homeId && checkin && checkout) {
            await dispatch(getCountDiscountAction(homeId, checkin, checkout) as any)
        }
    }, [homeId, dispatch, checkin, checkout])

    useEffect(() => {
        console.log("bookingId: " + bookingId);
        console.log("homeId: " + homeId);
        setMarkedDays({});
        dispatch(clearBookdates() as any);
        setIsLoading(true);
        loadBooking().then(() => loadBookdatesByHome()).then(() => setIsLoading(true));
        
    }, [homeId, bookingId])

    useEffect(() => {
        if(bookdates && bookingId) {
            bookdates.filter((bo: BOOKDATE) => bo.bookingId != bookingId).forEach((bo : BOOKDATE) => {
                markedDays[bo.date] = {disabled: true, disableTouchEvent: true}
            })
        }
        // if(booking) {
        //     setCheckin(booking?.checkInDate);
        //     setCheckout(booking?.checkOutDate);
        // }
    }, [bookdates, home, booking])

    useEffect(() => {
        if( checkin && checkout) {
            loadChangeCountDiscount();
        }
    }, [checkin, checkout, dispatch])

    const addDaySelected = (day: DateData) => {
        console.log('selected day', day);
        if(!isStart || (isStart && isEnd)) {
            if(checkin && checkout) {
                deleteChosenDays(checkin, checkout);
            }
            setMarkedDays({...markedDays ,[day.dateString]: {startingDay: true, color: "#FF5A5F"}})
            setCheckin(day.dateString);
            if(!isStart) {
                setIsStart(!isStart)
            }  
            setIsEnd(false)    
        } else if(isStart && !isEnd) {
            let checkInFormat = new Date(checkin ?? "");
            let checkOutFormat = new Date(day.dateString);
            console.log("checkin: " + checkInFormat)
            console.log("checkout: " + checkOutFormat)
            console.log(checkOutFormat.getDate() - checkInFormat.getDate())
            if(checkOutFormat.getDate() - checkInFormat.getDate() > 0) {
                const diffDay = checkOutFormat.getDate() - checkInFormat.getDate();
                addMiddleDays(checkInFormat, checkOutFormat, diffDay);
                setCheckout(day.dateString);
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
                markedDays[middleDay.toLocaleDateString('en-CA')] = {endingDay: true,color: "#FF5A5F"}
                i++;
            } else {
                middleDay.setDate(middleDay.getDate() + 1);
                console.log(middleDay.toLocaleDateString('en-CA'));
                markedDays[middleDay.toLocaleDateString('en-CA')] = {color: "#FF5A5F"}
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

     const updateBookingFunction =  async () => {
        if(countDiscount && checkin && checkout && bookingId) {
            const obj = {
                days: countDiscount?.days,
                totalPrice: countDiscount?.totalPrice,
                checkInDate: checkin,
                checkOutDate: checkout
            }
            console.log(obj);
            await dispatch(updateBookingAction(bookingId, obj) as any);
            Alert.alert("updated your booking successfully");
            navigation.goBack();
        }
     }
    

  return (
    <View style={tw('flex-1')}>
      <View style={[tw('w-full bg-white relative'), {maxHeight: windownHeigh - 100, borderTopRightRadius: 20, borderTopLeftRadius: 20}]}>
          
            <CalendarList
                minDate={currentTime < new Date(booking?.home?.openDate).getTime() ? booking?.home?.openDate : currentDate}
                maxDate={booking?.home?.closeBooking}
                current={currentDate}
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
        <View style={[tw('bg-white flex-row border border-gray-200 items-center justify-between absolute w-full bottom-0 px-2 py-2'), {zIndex: 10}, styles.shadow]}>  
            
            <View style={tw('my-2 flex-1')}>
               
                {countDiscount && countDiscount?.homeId == homeId && checkin && checkout && (
                    <>
                        <View style={tw('flex-row items-center justify-between mb-2')}>
                            <Text style={tw('font-bold text-lg')}>Check-In: </Text>
                            <Text style={tw('ml-4 text-black font-bold text-lg')}>{checkin && new Date(checkin).toLocaleString('en-us',{ day: 'numeric', month:'short', year: "numeric"})}</Text>
                        </View>
                        <View style={tw('flex-row items-center justify-between mb-2')}>
                            <Text style={tw('font-bold text-lg')}>Check-Out: </Text>
                            <Text style={tw('ml-4 text-black font-bold text-lg')}>{checkout && new Date(checkout).toLocaleString('en-us',{ day: 'numeric', month:'short', year: "numeric"})}</Text>
                        </View>
                        <View style={tw('flex-row items-center justify-between mb-2')}>
                            <Text style={tw('font-bold text-lg')}>Price: </Text>
                            <Text style={tw('ml-4 text-black font-bold text-lg')}>£{Math.round(countDiscount?.totalPrice).toFixed(2)}</Text>
                        </View>
                        <View style={tw('flex-row items-center justify-between mb-2')}>
                            <Text style={tw('font-bold text-lg')}>Discount: </Text>
                            <Text style={tw('ml-4 text-black font-bold text-lg')}>- £{Math.round(countDiscount?.discountPrice).toFixed(2)}</Text>
                        </View>
                        <View style={tw('flex-row items-center justify-between mb-2')}>
                            <Text style={tw('font-bold text-lg')}>Total Price: </Text>
                            <Text style={tw('ml-4 text-black font-bold text-lg')}>£{Math.round(countDiscount?.priceAfterDiscount).toFixed(2)}</Text>
                        </View>
                        <Button onPress={updateBookingFunction}  title="Update" buttonStyle={tw('w-full mx-auto h-12 rounded-lg bg-[#FF5A5F]')} titleStyle={tw('text-white font-bold')} containerStyle={tw('mx-auto w-2/3')} ></Button>
                    </>
                )}
                 
            </View>
           
        </View>
    </View>
  )
}

export default UpdateBookingScreen

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