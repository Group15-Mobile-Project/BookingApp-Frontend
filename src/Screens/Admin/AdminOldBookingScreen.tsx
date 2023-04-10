import { Alert, ScrollView, StyleSheet, Text, Touchable, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootState } from '../../Store/store';
import { useDispatch, useSelector } from 'react-redux';
import { ListRenderItem, FlatList } from 'react-native';
import { useTailwind } from 'tailwind-rn/dist'
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { BOOKING, NOTIFICATION } from '../../Model';
import { getOldBookingByHomeAction, getOldBookingByTenantAction, getUpcomingBookingByHomeAction, getUpcomingBookingByHostAction, getUpcomingBookingByTenantAction } from '../../Store/Actions/BookingAction';
import HostBookingCard from '../../Component/HostBookingCard';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { HostBottomTabProps } from '../../Navigators/HostStack';
import { RootStackParamList } from '../../Navigators/MainStack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LoadingComponent from '../../Component/LoadingComponent';
import { AdminBottomTabProps } from '../../Navigators/AdminStack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import AdmingBookingCard from '../../Component/AdmingBookingCard';


type AdminBookingListNavigationProp = CompositeNavigationProp<
NativeStackNavigationProp<RootStackParamList, "AdminBookingList">,
BottomTabNavigationProp<AdminBottomTabProps>>;

const AdminOldBookingScreen = ({userId, homeId}: {userId?: number, homeId?: number}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
  const tw = useTailwind();
  const {users, authUser, userError, userSuccess, message} = useSelector((state: RootState) => state.USERS);
  const {booking, oldbookings, bookingSuccess, bookingError, countDiscount} = useSelector((state: RootState) => state.BOOKINGS);
  const dispatch = useDispatch();
  const windownWith = useWindowDimensions().width;
  const navigation = useNavigation<AdminBookingListNavigationProp>();

  const loadoldbookingsByTenants = useCallback(async () => {
      setIsRefreshing(true)
      console.log("upcoming bookings");
      if(userId) {
        await dispatch(getOldBookingByTenantAction(userId) as any);
      } else if(homeId) {
        await dispatch(getOldBookingByHomeAction(homeId) as any);
      }
      
      setIsRefreshing(false)
    }, [authUser, dispatch])
  
    useEffect(() => {
        setIsLoading(true)
        loadoldbookingsByTenants().then(() => setIsLoading(false))
    }, [dispatch, authUser])
  
    const handleRenderItem: ListRenderItem<any> = ({item}: {item: BOOKING}) => (
      <AdmingBookingCard booking={item} upcoming={false} onPress={() => navigation.navigate("DetailBookingScreenAdmin", {bookingId: item?.id})}></AdmingBookingCard>
  )

  if(oldbookings && oldbookings.length == 0) {
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
            onRefresh={loadoldbookingsByTenants}
            data={oldbookings?.filter((bo: BOOKING) => bo.status == "ACCECPTED" || bo.status == "PENDING").sort((a: BOOKING, b: BOOKING) => (new Date(a.checkInDate).getTime()) - (new Date(b.checkInDate).getTime()))}
            // data={upcomingbookings?.sort((a: BOOKING, b: BOOKING) => (new Date(a.checkInDate).getTime()) - (new Date(b.checkInDate).getTime()))}
            keyExtractor={(item: any) => item.id}
            renderItem={handleRenderItem}
            showsVerticalScrollIndicator={false}
        >
        </FlatList>
    </View>
  )
}

export default AdminOldBookingScreen

const styles = StyleSheet.create({})