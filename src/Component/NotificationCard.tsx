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


const statusText ={
    ACCECPTED_BOOKING: "your booking is accepted by",
    UNACCEPTED_BOOKING: "your booking is rejected by",
    TENANT_REVIEW: "leave you a review"
};

type NotificationCardNavigationProp = CompositeNavigationProp<
NativeStackNavigationProp<TenantBottomTabProps, "InBoxScreen">,
NativeStackNavigationProp<RootStackParamList>
>;
 
const NotificationCard = ({notify}: {notify: NOTIFICATION}) => {
    const tw = useTailwind();
    const windownWith = useWindowDimensions().width;
    const dispatch = useDispatch();
    const navigation = useNavigation<NotificationCardNavigationProp>();
    if(notify?.read == true) {
        return null;
    }

  
    const navigateToNotification = async () => {
        await dispatch(updateReadingNotifyAction(notify?.id) as any);
        navigation.navigate('ConfirmedBookingScreen', {bookingId: notify?.bookingId ?? 0});
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
        {notify?.status == "ACCECPTED_BOOKING" && <Text style={tw('mt-4 my-2 text-lg text-black font-bold')}>{statusText["ACCECPTED_BOOKING"]} {notify?.host.user.username}</Text>}
        {notify?.status == "UNACCEPTED_BOOKING" && <Text style={tw('mt-4 my-2 text-lg text-black font-bold')}>{statusText["UNACCEPTED_BOOKING"]} {notify?.host.user.username}</Text>}
        {notify?.status == "TENANT_REVIEW" && <Text style={tw('mt-4 my-2 text-lg text-black font-bold')}>{notify?.host.user.username} {statusText["TENANT_REVIEW"]}</Text>}
    </Pressable>
  )
}

export default NotificationCard

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