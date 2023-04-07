import { Alert, ListRenderItem, Pressable, ScrollView, StyleSheet, Text, Touchable, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React, { useCallback, useEffect, useState, useLayoutEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { HOST_URL, RootState } from '../../Store/store';
import { RootStackParamList } from '../../Navigators/MainStack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute, CompositeNavigationProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useTailwind } from 'tailwind-rn/dist'
import { createBookingAction, getBookingByIdAction, getCountDiscountAction } from '../../Store/Actions/BookingAction';
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
import { getTenantReviewByHostAndTenant } from '../../Store/Actions/TenantReviewAction';
import ConfirmBookingTenantReviewCard from '../../Component/ConfirmBookingTenantReviewCard';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { TenantBottomTabProps } from '../../Navigators/TenantStack';
import { BOOKING } from '../../Model';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import TenantUpcomingBookingScreen from './TenantUpcomingBookingScreen';
import TenantOldBookingScreen from './TenantOldBookingScreen';

export type BookingsListNavigationProp = CompositeNavigationProp<
NativeStackNavigationProp<RootStackParamList, "BookingsListScreen">,
BottomTabNavigationProp<TenantBottomTabProps>>;

const Tab = createMaterialTopTabNavigator();
const BookingsListScreen = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
    const tw = useTailwind();
    const {users, authUser, userError, userSuccess, message} = useSelector((state: RootState) => state.USERS);
    const dispatch = useDispatch();
    const navigation = useNavigation<BookingsListNavigationProp>();
    const windownWith = useWindowDimensions().width;

    // const loadBookingsByTenants = useCallback(async () => {
    //     setIsRefreshing(true)
    //     // await dispatch(getWishlistByAuthUserAction() as any)
    //     setIsRefreshing(false)
    //   }, [authUser, dispatch])
    
    //   useEffect(() => {
    //       setIsLoading(true)
    //       loadBookingsByTenants().then(() => setIsLoading(false))
    //   }, [dispatch, authUser])
    
    //   const handleRenderItem: ListRenderItem<any> = ({item}: {item: BOOKING}) => (
    //     <></>
    // )

  return (
    <View style={tw('bg-white flex-1')}>
       <Tab.Navigator
           screenOptions={{
            tabBarActiveTintColor: "gray",
            tabBarLabelStyle: {fontSize: 14, color: "gray", fontWeight: 'bold'},
            tabBarStyle: {marginTop: 0, paddingTop: 0}

            }}
            tabBarPosition='top'
            style={tw('flex-1')}
        >
            <Tab.Screen name="TenantUpcomingBooking" children={() => <TenantUpcomingBookingScreen ></TenantUpcomingBookingScreen>} options={{tabBarLabel: "Upcoming"}}/>
            <Tab.Screen name="TenantOldBooking" children={() => <TenantOldBookingScreen ></TenantOldBookingScreen>} options={{tabBarLabel: "Checked Out"}}/>
        </Tab.Navigator>
    </View>
  )
}

export default BookingsListScreen

const styles = StyleSheet.create({})