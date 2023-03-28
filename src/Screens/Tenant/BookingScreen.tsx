import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootState } from '../../Store/store';
import { RootStackParamList } from '../../Navigators/MainStack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getHomesByHomeIdAction } from '../../Store/Actions/HomeAction';
import { ListRenderItem } from 'react-native';
import { FlatList } from 'react-native';
import { useTailwind } from 'tailwind-rn/dist'
import Entypo from 'react-native-vector-icons/Entypo';
import { getCountDiscountAction } from '../../Store/Actions/BookingAction';

type DetailHomeProp = RouteProp<RootStackParamList, "BookingScreen">;
const imageDefault =[
    "wallpaper.jpg_a776d37b-97c9-4bd6-b4ca-1f342de06161",
    "Cabin-in-the-city-Best-Airbnbs-in-Ontario-819x1024.jpeg_89abc5d3-cd57-4fae-92ed-96bb77daf640",
    "dormir-dans-une-ferme-en-suède-best-airbnb-in-south-sweden-main.jpg_c83de24f-f4d0-4367-96ef-96d261a99e94"
  ]


const BookingScreen = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isBookingDiscount, setIsBookingDiscount] = useState<boolean>(false);
    const tw = useTailwind()
    const windownWith = useWindowDimensions().width;
    const {home, homeSuccess, homeError} = useSelector((state: RootState) => state.HOMES)
    const {reviews, reviewSuccess, reviewError} = useSelector((state: RootState) => state.HOMEREVIEWS)
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>() 
    const {params} = useRoute<DetailHomeProp>();
    const {homeId, checkIn, checkOut}= params;
    const dispatch = useDispatch()
    const currentDate = new Date();

    const loadCountDiscount = useCallback(async () => {
        if(homeId && checkIn && checkOut) {
            await dispatch(getCountDiscountAction(homeId, checkIn, checkOut) as any)
        }
    }, [homeId, dispatch])

    useEffect(() => {
        setIsLoading(true)
        loadCountDiscount().then(() => setIsLoading(false))
    }, [homeId, checkIn, checkOut, dispatch])

  return (
    <View>
      <Text>BookingScreen</Text>
    </View>
  )
}

export default BookingScreen

const styles = StyleSheet.create({})