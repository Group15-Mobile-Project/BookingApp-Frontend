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
import { getOldBookingByTenantAction, getUpcomingBookingByTenantAction } from '../../Store/Actions/BookingAction';

const TenantOldBookingScreen = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
    const tw = useTailwind();
    const {users, authUser, userError, userSuccess, message} = useSelector((state: RootState) => state.USERS);
    const {booking, oldbookings, bookingSuccess, bookingError, countDiscount} = useSelector((state: RootState) => state.BOOKINGS);
    const dispatch = useDispatch();
    const navigation = useNavigation<BookingsListNavigationProp>();
    const windownWith = useWindowDimensions().width;

    const loadOldBookingsByTenants = useCallback(async () => {
        setIsRefreshing(true)
        console.log("old bookings");
        await dispatch(getOldBookingByTenantAction(authUser?.id) as any)
        setIsRefreshing(false)
      }, [authUser, dispatch])
    
      useEffect(() => {
          setIsLoading(true)
          loadOldBookingsByTenants().then(() => setIsLoading(false))
      }, [dispatch, authUser])
    
      const handleRenderItem: ListRenderItem<any> = ({item}: {item: BOOKING}) => (
        <BookingCard booking={item} onPress={() => navigation.navigate('ConfirmedBookingScreen', {bookingId: item?.id})}></BookingCard>
    )

    if(oldbookings && oldbookings.length == 0) {
      return (
        <View style={tw('bg-white flex-1 px-2 items-center justify-center')}>
          <Text style={tw('text-2xl font-bold text-black')}>No Bookings</Text>
        </View>
      )
  }

  return (
    <View style={tw('bg-white flex-1 px-2')}>
        <FlatList
            refreshing={isRefreshing}
            onRefresh={loadOldBookingsByTenants}
            data={oldbookings.sort((a: BOOKING, b: BOOKING) => (new Date(a.checkInDate).getTime()) - (new Date(b.checkInDate).getTime()))}
            keyExtractor={(item: any) => item.id}
            renderItem={handleRenderItem}
            showsVerticalScrollIndicator={false}
        >
        </FlatList>
    </View>
  )
}

export default TenantOldBookingScreen

const styles = StyleSheet.create({})