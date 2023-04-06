import { Alert, ScrollView, StyleSheet, Text, Touchable, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootState } from '../../Store/store';
import { RootStackParamList } from '../../Navigators/MainStack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute, CompositeNavigationProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getHomesByHomeIdAction } from '../../Store/Actions/HomeAction';
import { ListRenderItem } from 'react-native';
import { FlatList } from 'react-native';
import { useTailwind } from 'tailwind-rn/dist'
import { createBookingAction, getCountDiscountAction } from '../../Store/Actions/BookingAction';
import BookingHomeCard from '../../Component/BookingHomeCard';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import HomeDetailCalendar from '../../Component/HomeDetailCalendar';
import BookingGuestModal from '../../Component/BookingGuestModal';
import { Button } from '@rneui/base';
import { HomesStackParamList } from '../../Navigators/HomesStack';
import { getBookdatesByHomeAndCurrentTimeAction } from '../../Store/Actions/BookDateAction';

type BookingNavigationProp = CompositeNavigationProp<
NativeStackNavigationProp<RootStackParamList, "BookingScreen">,
NativeStackNavigationProp<HomesStackParamList>>;

type DetailHomeProp = RouteProp<RootStackParamList, "BookingScreen">;

const imageDefault =[
    "wallpaper.jpg_a776d37b-97c9-4bd6-b4ca-1f342de06161",
    "Cabin-in-the-city-Best-Airbnbs-in-Ontario-819x1024.jpeg_89abc5d3-cd57-4fae-92ed-96bb77daf640",
    "dormir-dans-une-ferme-en-suède-best-airbnb-in-south-sweden-main.jpg_c83de24f-f4d0-4367-96ef-96d261a99e94"
]


const BookingScreen = () => {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [isGuestVisible, setIsGuestVisible] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [checkin, setCheckin] = useState<string | null>(null);
    const [checkout, setCheckout] = useState<string | null>(null);
    const [guests, setGuests] = useState<number>(2);
    const [isBookingDiscount, setIsBookingDiscount] = useState<boolean>(false);
    const tw = useTailwind()
    const windownWith = useWindowDimensions().width;
    const {home, homeSuccess, homeError} = useSelector((state: RootState) => state.HOMES)
    const {reviews, reviewSuccess, reviewError} = useSelector((state: RootState) => state.HOMEREVIEWS);
    const {booking,  bookingSuccess, bookingError, countDiscount} = useSelector((state: RootState) => state.BOOKINGS);
    const {bookdates, bookdateSuccess, bookdateError} = useSelector((state: RootState) => state.BOOKDATES);
    const navigation = useNavigation<BookingNavigationProp>() 
    const {params} = useRoute<DetailHomeProp>();
    const {homeId, checkIn, checkOut, capacity}= params;
    const dispatch = useDispatch()
    const currentDate = new Date();

    const loadCountDiscount = useCallback(async () => {
        if(homeId && checkIn && checkOut && capacity) {
            await dispatch(getCountDiscountAction(homeId, checkIn, checkOut) as any)
        }
    }, [homeId, dispatch, checkIn, checkOut, capacity, guests, checkin, checkout])

    const loadChangeCountDiscount = useCallback(async () => {
        if(homeId && checkin && checkout && guests) {
            await dispatch(getCountDiscountAction(homeId, checkin, checkout) as any)
        }
    }, [homeId, dispatch, guests, checkin, checkout])

    const loadBookdatesByHome = useCallback(async () => {
        if(homeId) {
            await dispatch(getBookdatesByHomeAndCurrentTimeAction(homeId) as any)
        }
    }, [homeId, dispatch])

    useEffect(() => {
        loadBookdatesByHome();
    }, [homeId])

    useEffect(() => {
        setIsLoading(true);
        if(checkIn && checkOut && capacity) {
            setCheckin(checkIn);
            setCheckout(checkOut);
            setGuests(capacity);
        };
        console.log("count discount");
        loadCountDiscount().then(() => setIsLoading(false))
        
    }, [homeId, checkIn, checkOut, dispatch, capacity])

    useEffect(() => {
        setIsLoading(true);
        console.log("checkin: " + checkin);
        console.log("checkout: " + checkout);
        loadChangeCountDiscount().then(() => setIsLoading(false))
    }, [checkin, checkout, guests])

    const OpenModalCalendar = () => {
        setIsVisible(true)
    }
    const OpenModalGuestNumber = ()  => {
        setIsGuestVisible(true)
    }

    const createBookingFunction = async () => {
        if(guests > home.capacity) {
            Alert.alert("number of guest must be less than or equal to " + home.capacity)
        }
        if(guests <= home.capacity && checkin && checkout && countDiscount && countDiscount.homeId == home.id) {
            const {days, priceAfterDiscount, totalPrice} = countDiscount;
            const bookingForm = {
                guests: guests,
                days: days,
                priceAfterDiscount: priceAfterDiscount,
                homeId: home.id,
                checkInDate: checkin,
                checkOutDate: checkout,
                totalPrice: totalPrice
            }
            await dispatch(createBookingAction(bookingForm) as any);   
            navigation.navigate('BookingsListScreen');  
        }
    }

  return (
    <ScrollView style={tw('flex-1 relative')}>
        {home && <BookingHomeCard item={home} showPrice={true}></BookingHomeCard>}
        <View style={[tw('w-full bg-gray-300'), {height: 8}]}></View>
        <View style={tw('w-full py-2 px-4')}>
            <Text style={tw('text-2xl font-bold text-black my-2')}>Your Trip</Text>
            <View style={tw('flex-row items-center justify-between px-2 my-2')}>
                <View>
                    <Text style={tw('text-lg font-bold text-black')}>Dates</Text>
                    <Text style={tw('text-lg')}>{checkin && new Date(checkin).toLocaleString('en-us',{ day: 'numeric', month:'short'})} - {checkout && new Date(checkout).toLocaleString('en-us',{ day: 'numeric', month:'short'})} </Text>
                </View>
                <TouchableOpacity onPress={OpenModalCalendar} style={tw('')}>
                    <AntDesign name="edit" size={28} color="gray" /> 
                </TouchableOpacity>
            </View>
            <View style={tw('flex-row items-center justify-between px-2 my-2')}>
                <View>
                    <Text style={tw('text-lg font-bold text-black')}>Guest</Text>
                    <Text style={tw('text-lg')}>{guests}</Text>
                </View>
                <TouchableOpacity onPress={OpenModalGuestNumber} style={tw('')}>
                    <AntDesign name="edit" size={28} color="gray" /> 
                </TouchableOpacity>
            </View>
        </View>
        <View style={[tw('w-full bg-gray-300'), {height: 8}]}></View>
        <View style={tw('w-full py-2 px-4')}>
            <Text style={tw('text-2xl font-bold text-black my-2')}>Price Details</Text>
            <View style={tw('flex-row items-center justify-between px-2 my-2')}>
                <Text style={tw('text-lg')}>£{home?.price} * {countDiscount?.days} nights</Text>                  
                <Text style={tw('text-lg')}>£{Math.round(countDiscount?.totalPrice).toFixed(2)}</Text>  
            </View>
            <View style={tw('flex-row items-center justify-between px-2 my-2')}>
                <Text style={tw('text-lg')}>Discount</Text>                  
                <Text style={tw('text-lg')}>- £{Math.round(countDiscount?.discountPrice / 100 * 100).toFixed(2)}</Text>  
            </View>
            <View style={[tw('w-full bg-gray-300'), {height: 1}]}></View>
            <View style={tw('flex-row items-center justify-between px-2 my-2')}>
                <Text style={tw('text-lg')}>Total</Text>                  
                <Text style={tw('text-lg')}>£{Math.round(countDiscount?.priceAfterDiscount).toFixed(2)}</Text>  
            </View>
        </View>
        <View style={[tw('w-full bg-gray-300'), {height: 8}]}></View>
        <View style={tw('w-full flex-row items-center justify-center px-8 my-2')}>
            <AntDesign name="calendar" size={24} color="#FF5A5F" />                 
            <Text style={tw('text-lg font-bold text-black ml-6')}>Your reservation won't be confirmed until the host accepts your request within 48 hours</Text>  
        </View>
        <View style={[tw('w-full bg-gray-300'), {height: 8}]}></View>
        <Button onPress={createBookingFunction}  title="Request to book" buttonStyle={[tw('w-full h-12 rounded-lg bg-white'), {backgroundColor: "#FF5A5F" }]} titleStyle={tw('text-white font-bold')} containerStyle={tw('px-6 py-4')}></Button>
        {home && (
            <HomeDetailCalendar isVisble={isVisible} setIsVisible={setIsVisible} home={home} setCheckin={setCheckin} setCheckout={setCheckout} checkin={checkin} checkout={checkout} homeId={homeId}></HomeDetailCalendar>
        )}
        <BookingGuestModal isVisble={isGuestVisible} setIsVisible={setIsGuestVisible} guests={guests} setGuests={setGuests}></BookingGuestModal>
    </ScrollView>
  )
}

export default BookingScreen

const styles = StyleSheet.create({})