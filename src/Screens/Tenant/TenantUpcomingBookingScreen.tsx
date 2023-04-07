import { Alert, ScrollView, StyleSheet, Text, Touchable, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootState } from '../../Store/store';
import { RootStackParamList } from '../../Navigators/MainStack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute, CompositeNavigationProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { ListRenderItem, FlatList } from 'react-native';
import { useTailwind } from 'tailwind-rn/dist'
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Button } from '@rneui/base';
import { HomesStackParamList } from '../../Navigators/HomesStack';
import { getNotificationsByTenantAction } from '../../Store/Actions/NotificationAction';
import NotificationCard from '../../Component/NotificationCard';
import { BOOKING, NOTIFICATION } from '../../Model';
import { TenantBottomTabProps } from '../../Navigators/TenantStack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { BookingsListNavigationProp } from './BookingsListScreen';
import BookingCard from '../../Component/BookingCard';
import { getUpcomingBookingByTenantAction } from '../../Store/Actions/BookingAction';
import LoadingComponent from '../../Component/LoadingComponent';

const TenantUpcomingBookingScreen = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
    const tw = useTailwind();
    const {users, authUser, userError, userSuccess, message} = useSelector((state: RootState) => state.USERS);
    const {booking, upcomingbookings, bookingSuccess, bookingError, countDiscount} = useSelector((state: RootState) => state.BOOKINGS);
    const dispatch = useDispatch();
    const navigation = useNavigation<BookingsListNavigationProp>();
    const windownWith = useWindowDimensions().width;

    const loadUpcomingBookingsByTenants = useCallback(async () => {
        setIsRefreshing(true)
        console.log("upcoming bookings");
        await dispatch(getUpcomingBookingByTenantAction(authUser?.id) as any)
        setIsRefreshing(false)
      }, [authUser, dispatch])
    
      useEffect(() => {
          setIsLoading(true)
          loadUpcomingBookingsByTenants().then(() => setIsLoading(false))
      }, [dispatch, authUser])
    
      const handleRenderItem: ListRenderItem<any> = ({item}: {item: BOOKING}) => (
        <BookingCard booking={item} onPress={() => navigation.navigate('ConfirmedBookingScreen', {bookingId: item?.id})}></BookingCard>
    )

    if(upcomingbookings && upcomingbookings.length == 0) {
        return (
            <View style={tw('bg-white flex-1 px-2 items-center justify-center')}>
                <Text style={tw('text-2xl font-bold text-black')}>No Bookings</Text>
            </View>
          )
    }

    if(isLoading) {
      return <LoadingComponent/>
    }

  return (
    <View style={tw('bg-white flex-1 px-2')}>
        <FlatList
            refreshing={isRefreshing}
            onRefresh={loadUpcomingBookingsByTenants}
            data={upcomingbookings.sort((a: BOOKING, b: BOOKING) => (new Date(a.checkInDate).getTime()) - (new Date(b.checkInDate).getTime()))}
            keyExtractor={(item: any) => item.id}
            renderItem={handleRenderItem}
            showsVerticalScrollIndicator={false}
        >
        </FlatList>
    </View>
  )
}

export default TenantUpcomingBookingScreen

const styles = StyleSheet.create({})