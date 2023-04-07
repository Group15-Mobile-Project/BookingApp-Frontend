import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import React from 'react'
import { NOTIFICATION } from '../Model'
import { useDispatch } from 'react-redux'
import { useTailwind } from 'tailwind-rn/dist'
import { Image } from '@rneui/base'
import { HOST_URL } from '../Store/store'
import { Pressable } from 'react-native'
import { updateReadingNotifyAction } from '../Store/Actions/NotificationAction'
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native'
import { TenantBottomTabProps } from '../Navigators/TenantStack'
import { RootStackParamList } from '../Navigators/MainStack'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { HostBottomTabProps } from '../Navigators/HostStack'


const statusText ={
    CANCEL_BOOKING: "the booking is cancelled by",
    PENDING_BOOKING: "you have a pending booking",
    HOME_REVIEW: "leave your home a review",
    UPDATE_BOOKING: "the booking is updated by"
};

type NotificationCardNavigationProp = CompositeNavigationProp<
NativeStackNavigationProp<HostBottomTabProps, "HostInboxScreen">,
NativeStackNavigationProp<RootStackParamList>
>;

const HostNotificationCard = ({notify}: {notify: NOTIFICATION}) => {
    const tw = useTailwind();
    const windownWith = useWindowDimensions().width;
    const dispatch = useDispatch();
    const navigation = useNavigation<NotificationCardNavigationProp>();
    if(notify?.read == true) {
        return null;
    }

    const navigateToNotification = async () => {
        await dispatch(updateReadingNotifyAction(notify.id) as any);
         if(notify.status == "HOME_REVIEW") {
            //  navigation.navigate('DetailHomeScreen', {homeId: notify?.homeId});
            navigation.navigate('HostDetailBookingScreen', {bookingId: notify?.bookingId ?? 0});
         }
         if(notify.status == "PENDING_BOOKING" || notify.status == "UPDATE_BOOKING") {
             navigation.navigate('HostDetailBookingScreen', {bookingId: notify?.bookingId ?? 0});
         }       
    }

  return (
    <Pressable onPress={navigateToNotification} style={[tw('border border-gray-300 rounded-lg my-2 px-2 w-full')]} key={notify?.id}>
        <View style={tw('flex-row items-center justify-start')}>
            <Image source={{uri: HOST_URL + "/api/images/image/" + notify?.host?.user?.imgUrls}} style={[tw('rounded-full mr-4'), {width: 40, height: 40, resizeMode: 'cover'}]}></Image>      
            <View style={tw(' items-start justify-start')}>
                <Text style={tw(' text-lg text-gray-400 font-bold')}>{notify?.host?.user?.username}</Text>
                <Text style={tw(' text-base text-gray-400 font-bold')}>{new Date(notify?.dateCreated).toLocaleString('en-us',{ month:'short', year:'numeric', day: 'numeric'})}</Text>
            </View>
        </View>
      
        {notify.status == "CANCEL_BOOKING" && <Text style={tw('mt-4 my-2 text-lg text-black font-bold')}>{statusText["CANCEL_BOOKING"]} {notify.host.user.username}</Text>}
        {notify.status == "PENDING_BOOKING" && <Text style={tw('mt-4 my-2 text-lg text-black font-bold')}>{statusText["PENDING_BOOKING"]}</Text>}
        {notify.status == "UPDATE_BOOKING" && <Text style={tw('mt-4 my-2 text-lg text-black font-bold')}>{statusText["UPDATE_BOOKING"]} {notify.host.user.username}</Text>}
        {notify.status == "HOME_REVIEW" && <Text style={tw('mt-4 my-2 text-lg text-black font-bold')}>{notify.host.user.username} {statusText["HOME_REVIEW"]}</Text>}
    </Pressable>
  )
}

export default HostNotificationCard

const styles = StyleSheet.create({})