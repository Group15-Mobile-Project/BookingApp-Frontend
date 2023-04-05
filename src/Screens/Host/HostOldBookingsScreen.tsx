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
import { getOldBookingByHostAction, getUpcomingBookingByHostAction, getUpcomingBookingByTenantAction } from '../../Store/Actions/BookingAction';
import HostBookingCard from '../../Component/HostBookingCard';

const HostOldBookingsScreen = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
  const tw = useTailwind();
  const {users, authUser, userError, userSuccess, message} = useSelector((state: RootState) => state.USERS);
  const {booking, oldbookings, bookingSuccess, bookingError, countDiscount} = useSelector((state: RootState) => state.BOOKINGS);
  const dispatch = useDispatch();
  const windownWith = useWindowDimensions().width;

  const loadoldbookingsByTenants = useCallback(async () => {
      setIsRefreshing(true)
      console.log("upcoming bookings");
      await dispatch(getOldBookingByHostAction(authUser?.hostId) as any)
      setIsRefreshing(false)
    }, [authUser, dispatch])
  
    useEffect(() => {
        setIsLoading(true)
        loadoldbookingsByTenants().then(() => setIsLoading(false))
    }, [dispatch, authUser])
  
    const handleRenderItem: ListRenderItem<any> = ({item}: {item: BOOKING}) => (
      <HostBookingCard booking={item} upcoming={false}></HostBookingCard>
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
          onRefresh={loadoldbookingsByTenants}
          data={oldbookings?.filter((bo: BOOKING) => bo.status == "ACCECPTED").sort((a: BOOKING, b: BOOKING) => (new Date(a.checkInDate).getTime()) - (new Date(b.checkInDate).getTime()))}
          keyExtractor={(item: any) => item.id}
          renderItem={handleRenderItem}
          showsVerticalScrollIndicator={false}
      >
      </FlatList>
  </View>
)
}

export default HostOldBookingsScreen

const styles = StyleSheet.create({})