import { Alert, ScrollView, StyleSheet, Text, Touchable, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useTailwind } from 'tailwind-rn/dist'
import { BOOKING } from '../Model';
import { Badge, Image } from '@rneui/base';
import { HOST_URL } from '../Store/store';


const bookingStatus = {
    PENDING: "PENDING",
    ACCECPTED: "ACCECPTED",
    UNACCEPTED: "UNACCEPTED"
};

const HostBookingCard = ({booking, onPress, upcoming}: {booking: BOOKING, onPress?: () => void, upcoming: boolean}) => {
    
    const [duration, setDuration] = useState<number>(0);
    const [isUpcoming, setIsUpcoming] = useState<boolean>(true);
    const tw = useTailwind();
    const currentDay = new Date();

    useEffect(() => {
        if(booking) {
            if(upcoming) {  
                const timeleft = Math.round(((new Date(booking.checkInDate).getTime()) - currentDay.getTime()) / 1000 / 60 / 60 / 24);
                setDuration(timeleft);
            } else {       
                const timeleft = Math.round((currentDay.getTime() - (new Date(booking.checkOutDate).getTime())) / 1000 / 60 / 60 / 24);
                setDuration(timeleft);
            }
        }
    }, [booking])

    return (
        <View style={[tw('relative rounded-lg my-2 py-2 border border-gray-300 mb-4'), {borderWidth: 2}]}>
            {booking?.status == bookingStatus.ACCECPTED ? (
                 <Badge badgeStyle={tw('items-center justify-center  h-8')} containerStyle={tw('absolute top-2 right-4 ')} value="ACCPETED" status="success" />
             ) : booking?.status == bookingStatus.PENDING ? (
                <Badge badgeStyle={tw('items-center justify-center  h-8')} containerStyle={tw('absolute top-2 right-4')} value="PENDING" status="primary" />
             ): (
                <></>
             )}
            <TouchableOpacity onPress={onPress}>
                <View style={tw('ml-4 mb-4')}>
                    {upcoming ? (
                        <Text style={tw('text-2xl font-bold text-black')}>Arrives in {duration} {duration > 1 ? "days" : "day"}</Text>
                    ) : (
                        <Text style={tw('text-2xl font-bold text-black')}>Checked out {duration} {duration > 1 ? "days" : "day"} ago</Text>
                    )}
                    <Text style={tw('text-lg font-bold text-gray-400')}>{booking?.home?.address}, {booking?.home?.city.name}</Text>
                </View>
                <View style={tw('flex-row items-center justify-between w-full mb-2')}>          
                    <View style={tw('ml-4 flex items-start justify-start')}>
                        <Text style={tw('text-2xl font-bold text-black mb-2')}>{booking?.tenant?.username}</Text>
                        <Text style={tw('text-lg font-bold text-gray-400')}>{booking?.checkInDate && new Date(booking?.checkInDate ).toLocaleString('en-us',{ day: 'numeric', month:'short'})} - {booking?.checkOutDate && new Date(booking?.checkOutDate).toLocaleString('en-us',{ day: 'numeric', month:'short', year: 'numeric'})} </Text>
                    </View>
                    <Image source={{uri: HOST_URL + "/api/images/image/" + booking?.tenant?.imgUrls}} style={[tw('rounded-full mr-4'), {width: 70, height: 70, resizeMode: 'cover'}]}></Image> 
                </View>
            </TouchableOpacity>
            <View style={[tw('w-full bg-gray-300'), {height: 1}]}></View>
            <TouchableOpacity style={tw('flex items-center justify-center w-full py-2')}>
                <Text style={tw('text-2xl font-bold text-black')}>Message</Text>
            </TouchableOpacity>
        </View>
    )
}

export default HostBookingCard

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