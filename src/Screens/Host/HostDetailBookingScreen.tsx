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

type BookingNavigationProp = CompositeNavigationProp<
NativeStackNavigationProp<RootStackParamList, "HostDetailBookingScreen">,
NativeStackNavigationProp<HomesStackParamList>>;

type DetailHomeProp = RouteProp<RootStackParamList, "HostDetailBookingScreen">;

const imageDefault =[
    "wallpaper.jpg_a776d37b-97c9-4bd6-b4ca-1f342de06161",
    "Cabin-in-the-city-Best-Airbnbs-in-Ontario-819x1024.jpeg_89abc5d3-cd57-4fae-92ed-96bb77daf640",
    "dormir-dans-une-ferme-en-suède-best-airbnb-in-south-sweden-main.jpg_c83de24f-f4d0-4367-96ef-96d261a99e94"
  ]


const HostDetailBookingScreen = () => {
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

    const addReviewToServer = async () => {
        if(reviewDescription) {
            const obj ={
                rating: rating,
                content: reviewDescription,
                homeId: booking?.home?.id,
                bookingId: booking?.id,
                userId: authUser?.id
            };
            // await dispatch(addHomeReviewAction(obj) as any);
            console.log(obj);
            setReviewDescription(null);
            setRating(5);
            setAddingReview(false);
        } else {
            Alert.alert("please type your description")
        }       
    }
    const addTenantReviewToServer = async () => {
        if(tenantReviewDescription) {
            const obj ={
                rating: tenantRating,
                content: tenantReviewDescription,
                homeId: booking?.home?.id,
                bookingId: booking?.id,
                tenantId: booking?.tenant?.id
            };
            // await dispatch(addTenantReview(obj) as any);
            console.log(obj);
            setTenantReviewDescription(null);
            setTenantRating(5);
            setAddingTenantReview(false);
        } else {
            Alert.alert("please type your description")
        }       
    }

    const acceptBookingFunction = async () => {
        if(booking) {
            await dispatch(acceptBookingAction(booking?.id) as any);
        }
    }
    const rejectBookingFunction = async () => {
        if(booking) {
            await dispatch(unacceptBookingAction(booking?.id) as any);
        }
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
                <Image source={{uri: HOST_URL + "/api/images/image/" + imageDefault[0]}} style={[tw(' mb-2 rounded-full'), {width: 80, height: 80, resizeMode: 'cover'}]}></Image>
            </TouchableOpacity>    
            <Text style={tw('text-lg font-bold text-black mb-4 ml-4')}>Booking is made by {booking?.tenant?.username}</Text>
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
        {booking?.status == "PENDING"  && (
            <>
                <View style={[tw('w-full bg-gray-300'), {height: 8}]}></View>
                <View>
                    <Button onPress={acceptBookingFunction}  title="Accept Booking" buttonStyle={[tw('w-full h-12 rounded-lg bg-green-600')]} titleStyle={tw('text-white font-bold')} containerStyle={tw('px-6 py-4')}></Button>
                    <Button onPress={rejectBookingFunction} title="Reject Booking" buttonStyle={[tw('w-full h-12 rounded-lg bg-white'), {backgroundColor: "#FF5A5F" }]} titleStyle={tw('text-white font-bold')} containerStyle={tw('px-6 py-4')}></Button>
                </View>                     
             </>
        )}
        <View style={[tw('w-full bg-gray-300'), {height: 8}]}></View>
        <View style={tw('w-full py-2 px-4')}>
            {review && review?.home?.id == booking?.home?.id && (
                <>
                    <Text style={tw('text-2xl font-bold text-black my-2 mb-4')}>Review from Tenant</Text>
                    <HomeDetailReviewCard item={review}></HomeDetailReviewCard>
                </>
 
            )}
            {(!review  ||  review?.home?.id != booking?.home?.id) && booking?.tenant?.id == authUser?.id &&(
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
                         <Button onPress={addReviewToServer} title="Add Review for Home"  buttonStyle={[tw('w-full h-12 rounded-lg bg-white'), {backgroundColor: "#FF5A5F" }]} titleStyle={tw('text-white font-bold')} containerStyle={tw('px-2 py-4')}></Button>
                    
                    </View>
                    </TouchableWithoutFeedback>
                )}
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
            {(!tenantReview  ||  tenantReview?.home?.id != booking?.home?.id) && booking?.home?.owner?.id == authUser?.hostId &&(
                <View>
                    <Button onPress={() => setAddingTenantReview(!addingTenantReview)}  title="Leave your review" buttonStyle={[tw('w-full h-12 rounded-lg bg-green-600')]} titleStyle={tw('text-white font-bold')} containerStyle={tw('px-2 py-4')}></Button>
                    {addingTenantReview && (
                    <TouchableWithoutFeedback>
                        <View style={tw('w-full my-2')}>
                            <TextInput style={tw('w-full mb-2 rounded-full bg-gray-200 border-2 border border-gray-400 px-4 py-2')}  onChangeText={(text) => setTenantReviewDescription(text)} placeholder='Your review...' value={tenantReviewDescription ?? ""}></TextInput>
                            <View style={tw('bg-gray-200 mb-2 w-full rounded-full')}>
                                <Picker
                                selectedValue={tenantRating}
                                onValueChange={(itemValue: number) => {
                                    setTenantRating(itemValue)
                                }}
                                dropdownIconColor="white"
                                mode={Picker.MODE_DROPDOWN}
                                style={tw('text-center font-bold text-lg')}
                                >
                                {[1, 2, 3, 4, 5].map(rate => <Picker.Item key={rate} label={rate.toString()} value={rate}></Picker.Item>)}
                                </Picker>
                            </View>
                            <Button onPress={addTenantReviewToServer} title="Add Review for Tenant"  buttonStyle={[tw('w-full h-12 rounded-lg bg-white'), {backgroundColor: "#FF5A5F" }]} titleStyle={tw('text-white font-bold')} containerStyle={tw('px-2 py-4')}></Button>
                        
                        </View>
                    </TouchableWithoutFeedback>
                    )}
                </View>
            )}
        </View>
        {booking && (
            <ConfirmedBookingCalendar isVisble={isVisible} setIsVisible={setIsVisible}  bookingId={bookingId} booking={booking}></ConfirmedBookingCalendar>
        )}
    </ScrollView>
  )
}

export default HostDetailBookingScreen

const styles = StyleSheet.create({})