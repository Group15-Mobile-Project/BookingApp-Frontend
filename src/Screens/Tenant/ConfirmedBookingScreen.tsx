import { Alert, Pressable, ScrollView, StyleSheet, Text, Touchable, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React, { useCallback, useEffect, useState, useLayoutEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { HOST_URL, RootState } from '../../Store/store';
import { RootStackParamList } from '../../Navigators/MainStack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute, CompositeNavigationProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getHomesByHomeIdAction } from '../../Store/Actions/HomeAction';
import { ListRenderItem } from 'react-native';
import { FlatList } from 'react-native';
import { useTailwind } from 'tailwind-rn/dist'
import { createBookingAction, getBookingByIdAction, getCountDiscountAction } from '../../Store/Actions/BookingAction';
import BookingHomeCard from '../../Component/BookingHomeCard';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import HomeDetailCalendar from '../../Component/HomeDetailCalendar';
import BookingGuestModal from '../../Component/BookingGuestModal';
import { Button, Image } from '@rneui/base';
import { HomesStackParamList } from '../../Navigators/HomesStack';
import { getBookdatesByBookingAction, getBookdatesByHomeAndCurrentTimeAction } from '../../Store/Actions/BookDateAction';
import ConfirmedBookingCalendar from '../../Component/ConfirmedBookingCalendar';
import { duration } from 'moment';
import { Timeline } from 'react-native-calendars';
import { addHomeReviewAction, getReviewByHomeAndUserAction } from '../../Store/Actions/HomeReviewAction';
import HomeDetailReviewCard from '../../Component/HomeDetailReviewCard';
import { TextInput } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native';
import { Picker } from '@react-native-picker/picker';

type BookingNavigationProp = CompositeNavigationProp<
NativeStackNavigationProp<RootStackParamList, "ConfirmedBookingScreen">,
NativeStackNavigationProp<HomesStackParamList>>;

type DetailHomeProp = RouteProp<RootStackParamList, "ConfirmedBookingScreen">;

const imageDefault =[
    "wallpaper.jpg_a776d37b-97c9-4bd6-b4ca-1f342de06161",
    "Cabin-in-the-city-Best-Airbnbs-in-Ontario-819x1024.jpeg_89abc5d3-cd57-4fae-92ed-96bb77daf640",
    "dormir-dans-une-ferme-en-suède-best-airbnb-in-south-sweden-main.jpg_c83de24f-f4d0-4367-96ef-96d261a99e94"
  ]

const ConfirmedBookingScreen = () => {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [rating, setRating] = useState<number>(5);
    const [addingReview, setAddingReview] = useState<boolean>(false);
    const [reviewDescription, setReviewDescription] = useState<string |null>(null);
    const tw = useTailwind()
    const windownWith = useWindowDimensions().width;
    const currentDate = new Date();
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [isReview, setIsReview] = useState<boolean>(false);
    const {home, homeSuccess, homeError} = useSelector((state: RootState) => state.HOMES)
    const {reviews, review, reviewSuccess, reviewError} = useSelector((state: RootState) => state.HOMEREVIEWS);
    const {booking, bookings, bookingSuccess, bookingError, countDiscount} = useSelector((state: RootState) => state.BOOKINGS);
    const {bookdates, bookdateSuccess, bookdateError} = useSelector((state: RootState) => state.BOOKDATES);
    const {users, authUser, userError, userSuccess, message} = useSelector((state: RootState) => state.USERS);
    const navigation = useNavigation<BookingNavigationProp>() 
    const {params} = useRoute<DetailHomeProp>();
    const {bookingId}= params;
    const dispatch = useDispatch()
 

    const loadBooking = useCallback(async () => {
        if(bookingId) {
            await dispatch(getBookingByIdAction(bookingId) as any)
        }
    }, [bookingId, dispatch])

    const loadHomeReviewByHomeAndAuthUser = useCallback(async () => {
        if(booking) {
            console.log("load home review");
            await dispatch(getReviewByHomeAndUserAction(booking?.home?.id) as any);
        }
    }, [booking, dispatch])

    useLayoutEffect(() => {
        if( bookingId) {
            navigation.setOptions({
                title: "Your Booking"
            })
        }
    }, [bookingId])

    useEffect(() => {
        setIsLoading(true);
        console.log("load booking by id");
        loadBooking().then(() => setIsLoading(false));
    }, [bookingId, dispatch])

    useEffect(() => {
        if(bookingId && booking) {
            loadHomeReviewByHomeAndAuthUser()
           const checkin = new Date(booking?.checkInDate);
           let duration = (checkin.getTime() - currentDate.getTime()) / 1000 / 60 / 60 / 24;
           setTimeLeft(duration);
        }
    }, [booking])


    const OpenModalCalendar = () => {
        setIsVisible(true)
    }

    const navigateToUserProfileScreen = () => {
        navigation.navigate("UserProfileScreen", {userId: booking?.tenant?.id});
    }

    const addReviewToServer = async () => {

        if(reviewDescription) {
            const obj ={
                rating: rating,
                content: reviewDescription,
                homeId: booking?.home?.id,
                bookingId: booking?.id,
                userId: authUser?.id
            };
            await dispatch(addHomeReviewAction(obj) as any);
            console.log(obj);
            setReviewDescription(null);
            setRating(5);
            setAddingReview(false);
        } else {
            Alert.alert("please type your description")
        }       
    }
   
  return (
    <ScrollView style={tw('flex-1 relative')}>
        {booking && <BookingHomeCard item={booking?.home}showPrice={false} onPress={() => navigation.navigate("DetailHomeScreen", {homeId: booking?.home?.id})}></BookingHomeCard>}
        <View style={[tw('w-full bg-gray-300'), {height: 8}]}></View>
        {booking?.status == "PENDING" && (
             <Button  title="Booking is Pending" buttonStyle={[tw('w-full h-12 rounded-lg bg-green-600')]} titleStyle={tw('text-white font-bold')} containerStyle={tw('px-6 py-4')}></Button>
        )}
        {booking?.status == "ACCECPTED" && (
             <Button  title="Booking is Accepted" buttonStyle={[tw('w-full h-12 rounded-lg bg-green-600')]} titleStyle={tw('text-white font-bold')} containerStyle={tw('px-6 py-4')}></Button>
        )}
        {booking?.status == "UNACCEPTED" && (
             <Button  title="Booking is Rejected" buttonStyle={[tw('w-full h-12 rounded-lg bg-green-600')]} titleStyle={tw('text-white font-bold')} containerStyle={tw('px-6 py-4')}></Button>
        )}
        <View style={[tw('w-full bg-gray-300'), {height: 8}]}></View>
        <View style={tw('w-full px-4 my-2 flex-row items-center justify-start')}>
            <TouchableOpacity onPress={navigateToUserProfileScreen} >
                <Image source={{uri: HOST_URL + "/api/images/image/" + imageDefault[0]}} style={[tw(' mb-2 rounded-full'), {width: 80, height: 80, resizeMode: 'cover'}]}></Image>
            </TouchableOpacity>    
            <Text style={tw('text-2xl font-bold text-black mb-4 ml-4')}>Tenant is {booking?.tenant?.username}</Text>
        </View>
        <View style={[tw('w-full bg-gray-300'), {height: 8}]}></View>
        <View style={tw('w-full py-2 px-4')}>
            <Text style={tw('text-2xl font-bold text-black my-2')}>Your Booking</Text>
            <Text style={tw('text-base font-bold text-gray-400 my-2')}>{booking?.bookingCode}</Text>
            <View style={tw('flex-row items-center justify-between px-2 my-2')}>
                <View>
                    <Text style={tw('text-lg font-bold text-black')}>Dates</Text>
                    <Text style={tw('text-lg')}>{booking?.checkInDate && new Date(booking?.checkInDate ).toLocaleString('en-us',{ day: 'numeric', month:'short'})} - {booking?.checkOutDate && new Date(booking?.checkOutDate).toLocaleString('en-us',{ day: 'numeric', month:'short'})} </Text>
                </View>
                <TouchableOpacity onPress={OpenModalCalendar} style={tw('')}>
                    <AntDesign name="calendar" size={28} color="gray" /> 
                </TouchableOpacity>
            </View>
            <View style={tw('flex-row items-center justify-between px-2 my-2')}>
                <View>
                    <Text style={tw('text-lg font-bold text-black')}>Guest</Text>
                    <Text style={tw('text-lg')}>{booking?.guests}</Text>
                </View>
                <TouchableOpacity style={tw('')}>
                    <Ionicons name="people" size={28} color="gray" /> 
                </TouchableOpacity>
            </View>
        </View>
        <View style={[tw('w-full bg-gray-300'), {height: 8}]}></View>
        <View style={tw('w-full py-2 px-4')}>
            <Text style={tw('text-2xl font-bold text-black my-2')}>Price Details</Text>
            <View style={tw('flex-row items-center justify-between px-2 my-2')}>
                <Text style={tw('text-lg')}>£{home?.price} * {countDiscount?.days} nights</Text>                  
                <Text style={tw('text-lg')}>£{Math.round(booking?.totalPrice).toFixed(2)}</Text>  
            </View>
            <View style={tw('flex-row items-center justify-between px-2 my-2')}>
                <Text style={tw('text-lg')}>Discount</Text>                  
                <Text style={tw('text-lg')}>- £{Math.round((booking?.totalPrice - booking?.priceAfterDiscount) / 100 * 100).toFixed(2)}</Text>  
            </View>
            <View style={[tw('w-full bg-gray-300'), {height: 1}]}></View>
            <View style={tw('flex-row items-center justify-between px-2 my-2')}>
                <Text style={tw('text-lg')}>Total</Text>                  
                <Text style={tw('text-lg')}>£{Math.round(booking?.priceAfterDiscount).toFixed(2)}</Text>  
            </View>
        </View>
        <View style={[tw('w-full bg-gray-300'), {height: 8}]}></View>
            {timeLeft > 14 ? (
                 <Button  title="Cancel Booking" buttonStyle={[tw('w-full h-12 rounded-lg bg-white'), {backgroundColor: "#FF5A5F" }]} titleStyle={tw('text-white font-bold')} containerStyle={tw('px-6 py-4')}></Button>
            ): (
                <Text style={tw('text-lg px-4 my-4 font-bold text-black')}>Cannot cancel your booking after 14 days when your booking starts</Text>  
            )}    
        <View style={[tw('w-full bg-gray-300'), {height: 8}]}></View>
        <View style={tw('w-full py-2 px-4')}>
            <Text style={tw('text-2xl font-bold text-black my-2 mb-4')}>Tenant's Review</Text>
            {review && review?.home?.id == booking?.home?.id ? (
                <HomeDetailReviewCard item={review}></HomeDetailReviewCard>
            ): (
                <View>
                    <Button onPress={() => setAddingReview(!addingReview)}  title="Leave your review" buttonStyle={[tw('w-full h-12 rounded-lg bg-green-600')]} titleStyle={tw('text-white font-bold')} containerStyle={tw('px-2 py-4')}></Button>
                    {addingReview && (
                    <TouchableWithoutFeedback>
                    <View style={tw('w-full my-2')}>
                        <TextInput style={tw('w-full mb-2 rounded-full bg-gray-200 border-2 border border-gray-400 px-4 py-2')}  onChangeText={(text) => setReviewDescription(text)} placeholder='Your review...' value={reviewDescription ?? ""}></TextInput>
                        <View style={tw('bg-gray-200 mb-2 w-full rounded-full')}>
                            <Picker
                            selectedValue={rating}
                            onValueChange={(itemValue: number) => {
                                setRating(itemValue)
                            }}
                            dropdownIconColor="white"
                            mode={Picker.MODE_DROPDOWN}
                            style={tw('text-center font-bold text-lg')}
                            >
                            {[1, 2, 3, 4, 5].map(rate => <Picker.Item key={rate} label={rate.toString()} value={rate}></Picker.Item>)}
                            </Picker>
                        </View>
                         <Button onPress={addReviewToServer} title="Add Review"  buttonStyle={[tw('w-full h-12 rounded-lg bg-white'), {backgroundColor: "#FF5A5F" }]} titleStyle={tw('text-white font-bold')} containerStyle={tw('px-2 py-4')}></Button>
                    
                    </View>
                    </TouchableWithoutFeedback>
                )}
                </View>
            )}
        </View>
        <View style={[tw('w-full bg-gray-300'), {height: 8}]}></View>   
        {booking && (
            <ConfirmedBookingCalendar isVisble={isVisible} setIsVisible={setIsVisible}  bookingId={bookingId} booking={booking}></ConfirmedBookingCalendar>
        )}
    </ScrollView>
  )
}

export default ConfirmedBookingScreen

const styles = StyleSheet.create({})