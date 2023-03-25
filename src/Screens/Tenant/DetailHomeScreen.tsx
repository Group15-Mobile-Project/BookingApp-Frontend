import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { HOME, HOMEREVIEW } from '../../Model'
import { useTailwind } from 'tailwind-rn/dist'
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useWindowDimensions } from 'react-native';
import { HOST_URL } from '../../Store/store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootState } from '../../Store/store';
import { RootStackParamList } from '../../Navigators/MainStack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getHomesByHomeIdAction } from '../../Store/Actions/HomeAction';
import { ListRenderItem } from 'react-native';
import { FlatList } from 'react-native';
import HomeCardDots from '../../Component/HomeCardDots';
import { TouchableOpacity } from 'react-native';
import HomeDetailMap from '../../Component/HomeDetailMap';
import { getReviewsByHomeAction } from '../../Store/Actions/HomeReviewAction';
import HomeDetailReviewCard from '../../Component/HomeDetailReviewCard';
import HomeDetailCalendar from '../../Component/HomeDetailCalendar';
import { getBookdatesByHomeAndCurrentTimeAction } from '../../Store/Actions/BookDateAction';
import { Button } from '@rneui/base';

type DetailHomeProp = RouteProp<RootStackParamList, "DetailHomeScreen">;
const imageDefault =[
    "wallpaper.jpg_a776d37b-97c9-4bd6-b4ca-1f342de06161",
    "Cabin-in-the-city-Best-Airbnbs-in-Ontario-819x1024.jpeg_89abc5d3-cd57-4fae-92ed-96bb77daf640",
    "dormir-dans-une-ferme-en-suède-best-airbnb-in-south-sweden-main.jpg_c83de24f-f4d0-4367-96ef-96d261a99e94"
  ]

const DetailHomeScreen = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [openDate, setOpenDate] = useState<Date | null>(null);
    const [isBetween, setIsBetween] = useState<boolean>(false);
    const [isBookingDiscount, setIsBookingDiscount] = useState<boolean>(false);
    const [closeDate, setCloseDate] = useState<Date | null>(null);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [like, setLike] = useState<boolean>(false);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [checkin, setCheckin] = useState<string | null>(null);
    const [checkout, setCheckout] = useState<string | null>(null); 
    const tw = useTailwind()
    const windownWith = useWindowDimensions().width;
    const {home, homeSuccess, homeError} = useSelector((state: RootState) => state.HOMES)
    const {reviews, reviewSuccess, reviewError} = useSelector((state: RootState) => state.HOMEREVIEWS)
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>() 
    const {params} = useRoute<DetailHomeProp>();
    const {homeId}= params;
    const dispatch = useDispatch()
    const currentDate = new Date();
    console.log(currentDate)

    const loadHome = useCallback(async () => {
        if(homeId) {
            await dispatch(getHomesByHomeIdAction(homeId) as any)
        }
    }, [homeId, dispatch])
    const loadHomeReviewsByHome = useCallback(async () => {
        if(homeId) {
            await dispatch(getReviewsByHomeAction(homeId) as any)
        }
    }, [homeId, dispatch])

    const loadBookdatesByHome = useCallback(async () => {
        if(homeId) {
            await dispatch(getBookdatesByHomeAndCurrentTimeAction(homeId) as any)
        }
    }, [homeId, dispatch])

    const checkBookingDiscount = useCallback(() => {
        if(checkin && checkout && home?.discount) {
            const checkinFormat = new Date(checkin);
            const startDiscount = new Date(home?.discount?.openDate);
            const closeDiscount = new Date(home?.discount?.closeDate);
            console.log(home?.discount);
            if(checkinFormat.getTime() <= closeDiscount.getTime() && checkinFormat.getTime() >= startDiscount.getTime()) {
                setIsBookingDiscount(true);
            } else {
                setIsBookingDiscount(false);
            }
        }
    }, [checkin, checkout, home])

    useEffect(() => {
        checkBookingDiscount()
    }, [home, dispatch, checkin, checkout])
    
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

    useEffect(() =>{
        setIsLoading(true);
        loadHome().then(() => loadHomeReviewsByHome()).then(() => loadBookdatesByHome()).then(() => setIsLoading(false));
        if(home) {
            setOpenDate(new Date(home?.openBooking));
            setCloseDate(new Date(home?.closeBooking));
        }
    }, [homeId, dispatch])

    const handleRenderItem: ListRenderItem<any> = ({item}: {item: HOME}) => (
        <Image source={{uri: HOST_URL + "/api/images/image/" + item}} style={[tw(' mb-2'), {width: windownWith, height: 300, resizeMode: 'cover'}]}></Image>       
    )

    const handleRenderReviews: ListRenderItem<any> = ({item}: {item: HOMEREVIEW}) => (
        <HomeDetailReviewCard item={item} ></HomeDetailReviewCard>
    )

    const onViewableItemsChanged = useRef(({viewableItems, changed}: {viewableItems: any, changed: any}) => {
        console.log(viewableItems[0])
        if(viewableItems.length > 0) {
            setActiveIndex(viewableItems[0].index)
        }
    })
    const likeHome = async () => {
        setLike(!like)
      }

    const navigateToHostScreen = async () => {

    }

    const navigateToReviewsScreen = () => {
        navigation.navigate("HomeReviewList", {homeId: homeId})
    }

    const OpenModalCalendar = () => {
        setIsVisible(true)
    }

  return (
    <View style={tw('flex-1')}>
        <ScrollView style={tw('flex-1 relative')}>
        {home && 
        <>
            <View style={tw('w-full items-center justify-center mb-2')}>
                <FlatList
                    data={ imageDefault}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    snapToAlignment='center'
                    decelerationRate='fast'
                    snapToInterval={windownWith}
                    viewabilityConfig={{
                    viewAreaCoveragePercentThreshold: 50,
                    }}
                    onViewableItemsChanged={onViewableItemsChanged.current}
                    keyExtractor={(item: string) => item}
                    renderItem={handleRenderItem}
                    >
                </FlatList>
                <HomeCardDots arrayLength={imageDefault.length} activeIndex={activeIndex}></HomeCardDots>
            </View>
            <View style={tw('absolute top-2 w-full items-center justify-between px-4')}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={[tw('absolute top-2 left-8 bg-white p-2 rounded-full'), {zIndex: 10}]}>
                    <AntDesign name="arrowleft" size={28} color="black" />            
                </TouchableOpacity>
                <TouchableOpacity onPress={likeHome} style={[tw('absolute top-2 right-8 bg-white p-2 rounded-full'), {zIndex: 10}]}>
                    {!like ? (
                    <Entypo name="heart-outlined" size={28} color="black" />
                    ): (
                    <Entypo name="heart" size={28} color="red" />
                    )}
                </TouchableOpacity>
            </View>
            <View style={tw('w-full my-2 pl-4 pr-4')}>
                <Text style={tw('text-2xl font-bold text-black')}>{home.title}</Text>
                <View style={tw('flex-row items-center justify-start my-2')}>
                {home?.rating && (
                    <View style={tw('flex-row items-center justify-center mr-2')}>
                        <Entypo name="star" size={24} color="black" />
                        <Text style={tw('text-lg ml-2')}>{home?.rating && (Math.round(home?.rating * 100) / 100).toFixed(2)} -</Text>
                        {home?.reviewNums && <Text style={[tw('text-lg ml-2 text-black'), {textDecorationLine: 'underline'}]}>{home?.reviewNums} {home?.reviewNums > 1 ? "reviews" : "review"}</Text>}
                    </View>
                )}
                <Text style={tw('text-lg ml-2')}>{home?.city?.name},</Text>
                <Text style={tw('text-lg ml-2')}>{home?.country?.name}</Text>
                </View>
                <View style={[tw('w-full my-4 bg-gray-400'), {height: 1}]}></View>
            </View>
            <View style={tw('w-full my-2 pl-4 pr-4')}>
                <View style={tw('flex-row items-center justify-between w-full mb-4')}>
                    <Text style={tw('text-2xl font-bold text-black flex-1 mr-2')}>The property hosted by {home?.owner?.user?.username}</Text>
                    <Pressable onPress={navigateToHostScreen}>
                        <Image source={{uri: HOST_URL + "/api/images/image/" + imageDefault[0]}} style={[tw('rounded-full'), {width: 60, height: 60, resizeMode: 'cover'}]}></Image> 
                    </Pressable>
                </View>
                <View style={tw('flex-row items-center justify-start mb-2')}>
                <Text style={tw('text-lg ml-2')}>{home?.capacity} guest -</Text>
                <Text style={tw('text-lg ml-2')}>{home?.bedrooms} {home?.bedrooms > 1 ? "bedrooms" : "bedroom"} -</Text>
                <Text style={tw('text-lg ml-2')}>{home?.beds} {home?.beds > 1 ? "beds" : "bed"} </Text>
                </View>
                <View style={[tw('w-full my-4 bg-gray-400'), {height: 1}]}></View>
            </View>
            <View style={tw('w-full my-2 pl-4 pr-4')}>
                <View style={tw('flex-row items-start justify-start w-full mb-4')}>
                    <MaterialCommunityIcons name="door-open" size={28} color="black" /> 
                    <Text style={tw('text-lg ml-4 font-bold text-black')}>Self check-in</Text>
                </View>
                <View style={tw('flex-row items-start justify-start w-full mb-4')}>
                    <AntDesign name="calendar" size={28} color="black" /> 
                    <Text style={tw('text-lg ml-4 font-bold text-black')}>Free cancellation before 14 days of the reservation</Text>
                </View>
                <View style={[tw('w-full my-4 bg-gray-400'), {height: 1}]}></View>
            </View>
            {/* {home && <HomeDetailMap home={home}></HomeDetailMap>} */}
            {home?.reviewNums > 0 && home?.rating  && reviews && reviews.length > 0 && (
                <View style={tw('w-full my-2 pl-4 pr-4')}>
                    <View style={tw('flex-row items-start justify-start w-full mb-4')}>
                        <Entypo name="star" size={24} color="black" />
                        <Text style={tw('text-lg ml-2 text-black font-bold')}>{home?.rating && (Math.round(home?.rating * 100) / 100).toFixed(2)} -</Text>
                        {home?.reviewNums && <Text style={[tw('text-lg ml-2 text-black font-bold')]}>{home?.reviewNums} {home?.reviewNums > 1 ? "reviews" : "review"}</Text>}
                    </View>
            {reviews && reviews.length > 0 && (
                <FlatList
                data={reviews && reviews.length > 5 ? reviews.slice(5) : reviews}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                snapToAlignment='center'
                decelerationRate='fast'
                snapToInterval={windownWith - 20}
                viewabilityConfig={{
                viewAreaCoveragePercentThreshold: 50,
                }}
                keyExtractor={(item: string) => item}
                renderItem={handleRenderReviews}
                >
                </FlatList>
            )}
            {reviews && reviews.length < 5 &&  (
                <TouchableOpacity onPress={navigateToReviewsScreen} style={tw('w-full h-14 border border-zinc-700 items-center justify-center rounded-lg mx-auto mt-8')}>
                    <Text style={tw('text-lg text-black')}>Show all {home?.reviewNums} reviews</Text>
                </TouchableOpacity>
            )}
                <View style={[tw('w-full my-4 bg-gray-400'), {height: 1}]}></View>
            </View>
            )}
            <View style={tw('w-full my-2 px-4')}>
                <View style={tw('w-full flex-row items-center justify-between ')}>
                    <View style={tw('items-start justify-start w-full flex-1')}> 
                        <Text style={tw('text-2xl font-bold text-black')}>Availability</Text>
                        <Text style={tw('text-lg mt-4')}>  {currentDate && currentDate.toLocaleString('en-us',{ day: 'numeric', month:'short', year:'numeric'})} - {closeDate && closeDate.toLocaleString('en-us',{ day: 'numeric', month:'short', year:'numeric'})} </Text>
                    </View>
                    <TouchableOpacity onPress={OpenModalCalendar} style={tw('')}>
                        <AntDesign name="right" size={28} color="black" /> 
                    </TouchableOpacity>
                </View>
                <View style={[tw('w-full my-4 bg-gray-400'), {height: 1}]}></View>
            </View>
            <View style={tw('w-full my-2 px-4')}>   
                <Text style={tw('text-2xl font-bold text-black')}>House Rules</Text>
                <Text style={tw('text-lg mt-4')}> check in after 12:00</Text>
                <Text style={tw('text-lg mt-2')}> check out before 12:00</Text>           
                <Text style={tw('text-lg mt-2')}>{home.capacity} guest maximum</Text>        
                <View style={[tw('w-full my-4 bg-gray-400'), {height: 1}]}></View>
            </View>
            <View style={tw('w-full my-2 px-4')}>   
                <Text style={tw('text-2xl font-bold text-black')}>Cancellation polication</Text>
                <Text style={tw('text-lg mt-4')}>Free of charge for cancellation before 14 days when the reservation starts</Text>
                <View style={[tw('w-full my-4 bg-gray-400'), {height: 1}]}></View>
            </View>
        </>}
            { home && (
                <HomeDetailCalendar isVisble={isVisible} setIsVisible={setIsVisible} home={home} setCheckin={setCheckin} setCheckout={setCheckout} checkin={checkin} checkout={checkout}></HomeDetailCalendar>
            )}
        </ScrollView>
        <View style={[tw('bg-white flex-row items-center justify-between absolute w-full bottom-0 px-2 py-2'), {zIndex: 10}, styles.shadow]}>  
            {checkin && checkout ? (
                <View>
                    {isBookingDiscount ? (
                        <View>
                            <Text style={[tw('ml-4 text-gray-400 font-bold text-lg'), {textDecorationLine: 'line-through'}]}>£{home.price}</Text>
                            <Text style={tw('ml-4 text-black font-bold text-lg')}>£{Math.round(home.price - (home?.discount?.discountRate * home.price / 100))} night</Text>
                        </View>
                    ):(
                        <Text style={tw('ml-4 text-black font-bold text-lg')}>£{home.price} night</Text>
                    )}
                    <Text style={[tw('ml-4 text-gray-400 font-bold text-base') ]}> {checkin && new Date(checkin).toLocaleString('en-us',{ day: 'numeric', month:'short'})} - {checkout && new Date(checkout).toLocaleString('en-us',{ day: 'numeric', month:'short'})}</Text>
                </View>
            ):(
                <>
                    {home?.discount && isBetween ? (
                        <View>
                            <Text style={[tw('ml-4 text-gray-400 font-bold text-lg'), {textDecorationLine: 'line-through'}]}>£{home.price}</Text>
                            <Text style={tw('ml-4 text-black font-bold text-lg')}>£{Math.round(home.price - (home?.discount?.discountRate * home.price / 100))} night</Text>
                            <Text style={[tw('ml-4 text-gray-400 font-bold text-base') ]}> {home?.discount?.openDate && new Date(home?.discount?.openDate).toLocaleString('en-us',{ day: 'numeric', month:'short'})} - {home?.discount?.closeDate && new Date(home?.discount?.closeDate).toLocaleString('en-us',{ day: 'numeric', month:'short'})}</Text>
                        </View>
                    ) : (
                        <Text style={tw('ml-4 text-black font-bold text-lg')}>£{home.price} night</Text>
                    )}
                </>
            )}
            <Button   title="Reserve" buttonStyle={tw('w-20 h-12 rounded-lg bg-zinc-700')} titleStyle={tw('text-white font-bold')} ></Button>
        </View>
    </View>
  )
}

export default DetailHomeScreen

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