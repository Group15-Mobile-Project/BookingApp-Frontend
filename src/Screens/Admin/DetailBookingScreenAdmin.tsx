import { Alert, Pressable, ScrollView, StyleSheet, Text, Touchable, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React, { useCallback, useEffect, useState, useLayoutEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { HOST_URL, RootState } from '../../Store/store';
import { RootStackParamList } from '../../Navigators/MainStack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute, CompositeNavigationProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useTailwind } from 'tailwind-rn/dist'
import { acceptBookingAction, clearBooking, createBookingAction, getBookingByIdAction, getCountDiscountAction, unacceptBookingAction } from '../../Store/Actions/BookingAction';
import BookingHomeCard from '../../Component/BookingHomeCard';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Button, Image } from '@rneui/base';
import { HomesStackParamList } from '../../Navigators/HomesStack';
import ConfirmedBookingCalendar from '../../Component/ConfirmedBookingCalendar';
import { addHomeReviewAction, getReviewByHomeAndUserAction } from '../../Store/Actions/HomeReviewAction';
import HomeDetailReviewCard from '../../Component/HomeDetailReviewCard';
import { TextInput } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { addTenantReview, getTenantReviewByHostAndTenant } from '../../Store/Actions/TenantReviewAction';
import ConfirmBookingTenantReviewCard from '../../Component/ConfirmBookingTenantReviewCard';
import LoadingComponent from '../../Component/LoadingComponent';
import { AdminBottomTabProps } from '../../Navigators/AdminStack';

type BookingNavigationProp = CompositeNavigationProp<
NativeStackNavigationProp<RootStackParamList, "DetailBookingScreenAdmin">,
NativeStackNavigationProp<AdminBottomTabProps>>;

type DetailHomeProp = RouteProp<RootStackParamList, "DetailBookingScreenAdmin">;

const DetailBookingScreenAdmin = () => {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [rating, setRating] = useState<number>(5);
    const [addingReview, setAddingReview] = useState<boolean>(false);
    const [reviewDescription, setReviewDescription] = useState<string |null>(null);
    const [tenantRating, setTenantRating] = useState<number>(5);
    const [addingTenantReview, setAddingTenantReview] = useState<boolean>(false);
    const [tenantReviewDescription, setTenantReviewDescription] = useState<string |null>(null);
    const tw = useTailwind()
    const windownWith = useWindowDimensions().width;
    const currentDate = new Date();
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [isReview, setIsReview] = useState<boolean>(false);
    const {home, homeSuccess, homeError} = useSelector((state: RootState) => state.HOMES)
    const {reviews, review, reviewSuccess, reviewError} = useSelector((state: RootState) => state.HOMEREVIEWS);
    const {tenantReview, tenantReviewSuccess, tenantReviewError} = useSelector((state: RootState) => state.TENANTREVIEWS);
    const {booking, bookingSuccess, bookingError, countDiscount} = useSelector((state: RootState) => state.BOOKINGS);
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
    }, [bookingId, dispatch, bookingId])

    const loadHomeReviewByHomeAndUser = useCallback(async () => {
        if(booking) {
            console.log("load home review");
            await dispatch(getReviewByHomeAndUserAction(booking?.home?.id, booking?.tenant?.id) as any);
        }
    }, [booking, dispatch, bookingId])
    const loadTenantReviewByTenantAndHost = useCallback(async () => {
        if(booking) {
            console.log("load tenant review");
            await dispatch(getTenantReviewByHostAndTenant(booking?.home?.owner?.id, booking?.tenant?.id) as any);
        }
    }, [booking, dispatch, bookingId])
    useLayoutEffect(() => {
        if( bookingId) {
            navigation.setOptions({
                title: "Guest's Booking"
            })
        }
    }, [bookingId])

    useEffect(() => {
        dispatch(clearBooking() as any);
        setIsLoading(true);
        console.log("load booking by id");
        loadBooking().then(() => setIsLoading(false));
    }, [bookingId, dispatch])

    useEffect(() => {
        if(bookingId && booking) {
            loadHomeReviewByHomeAndUser();
            loadTenantReviewByTenantAndHost();
            const checkin = new Date(booking?.checkInDate);
            let duration = (checkin.getTime() - currentDate.getTime()) / 1000 / 60 / 60 / 24;
            setTimeLeft(duration);
        }
    }, [booking, bookingId])


    const OpenModalCalendar = () => {
        setIsVisible(true)
    }

    const navigateToUserProfileScreen = () => {
        navigation.navigate("UserProfileScreen", {userId: booking?.tenant?.id});
    }

    

    if(isLoading) {
        return <LoadingComponent/>
    }
   
  return (
    <ScrollView style={tw('flex-1 relative')}>
        {booking && <BookingHomeCard item={booking?.home}showPrice={false} onPress={() => navigation.navigate("DetailHomeScreen", {homeId: booking?.home?.id})}></BookingHomeCard>}
        {booking?.status == "PENDING" && (
            <View style={[tw('w-full bg-green-600 px-6 py-4 items-center justify-center')]}>
                <Text style={tw('text-white text-lg font-bold')}>Booking is Pending</Text>
            </View>
        )}
        {booking?.status == "ACCECPTED" && (
            <View style={[tw('w-full bg-green-600 px-6 py-4 items-center justify-center')]}>
                <Text style={tw('text-white text-lg font-bold')}>Booking is Accepted</Text>
            </View>
        )}
        {booking?.status == "UNACCEPTED" && (
            <View style={[tw('w-full bg-red-600 px-6 py-4 items-center justify-center')]}>
                <Text style={tw('text-white text-lg font-bold')}>Booking is Rejected</Text>
            </View>
        )}   
        <View style={tw('w-full px-4 my-2 flex-row items-center justify-start')}>
            <TouchableOpacity onPress={navigateToUserProfileScreen} >
                <Image source={{uri: HOST_URL + "/api/images/image/" + booking?.tenant?.imgUrls}} style={[tw(' mb-2 rounded-full'), {width: 80, height: 80, resizeMode: 'cover'}]}></Image>
            </TouchableOpacity>    
            <Text style={tw('text-lg font-bold text-black mb-4 ml-4')}>Booking is made by {booking?.tenant?.username}</Text>
        </View>
        <View style={[tw('w-full bg-gray-300'), {height: 8}]}></View>
        <View style={tw('w-full py-2 px-4')}>
            <Text style={tw('text-2xl font-bold text-black my-2')}>The Booking</Text>
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
                <Text style={tw('text-lg')}>£{booking?.home?.price} * {booking?.days} nights</Text>                  
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
        <View>
            {review && review?.home?.id == booking?.home?.id && (
                <View>
                    <View style={[tw('w-full bg-gray-300'), {height: 8}]}></View>
                    <View style={tw('w-full py-2 px-4')}>
                        <Text style={tw('text-2xl font-bold text-black my-2 mb-4')}>Review from Tenant</Text>
                        <HomeDetailReviewCard item={review}></HomeDetailReviewCard>
                    </View>
                </View>
            )}
            
        </View>
        <View style={[tw('w-full bg-gray-300'), {height: 8}]}></View> 
        <View style={tw('w-full py-2 px-4')}>
            {tenantReview && tenantReview?.home?.id == booking?.home?.id && (
                <>
                    <Text style={tw('text-2xl font-bold text-black my-2 mb-4')}>Review from Host</Text>  
                    <ConfirmBookingTenantReviewCard item={tenantReview}></ConfirmBookingTenantReviewCard>   
                </>
            )}
           
        </View>
        {booking && (
            <ConfirmedBookingCalendar isVisble={isVisible} setIsVisible={setIsVisible}  bookingId={bookingId} booking={booking}></ConfirmedBookingCalendar>
        )}
    </ScrollView>
  )
}

export default DetailBookingScreenAdmin

const styles = StyleSheet.create({})