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
import { BOOKING } from '../../Model';

const BookingCard = ({booking, onPress}: {booking: BOOKING, onPress?: () => void}) => {
    const tw = useTailwind();
  return (
    <TouchableOpacity onPress={onPress} style={tw('rounded-lg my-2 py-2 px-2 border border-gray-300 border-2')}>
        <View style={tw('flex-row items-start justify-start w-full mb-2')}>
            <View style={[{width: "50%"}, tw('')]}>
                <Text style={tw('text-lg font-bold text-black')}>Booking Code: </Text>
            </View>   
            <View style={[{width: "50%"}, tw('')]}>
                <Text style={tw('text-base')}>{booking?.bookingCode}</Text>
            </View>
        </View>
        <View style={tw('flex-row items-start justify-start w-full mb-2')}>         
            <View style={[{width: "50%"}, tw('')]}>
                <Text style={tw('text-lg font-bold text-black mr-2')}>Dates:</Text> 
            </View>   
            <View style={{width: "50%"}}>
                <Text style={tw('text-base')}>{booking?.checkInDate && new Date(booking?.checkInDate ).toLocaleString('en-us',{ day: 'numeric', month:'short'})} - {booking?.checkOutDate && new Date(booking?.checkOutDate).toLocaleString('en-us',{ day: 'numeric', month:'short', year: 'numeric'})} </Text>
            </View>
        </View>
        <View style={tw('flex-row items-start justify-start w-full mb-2')}>         
            <View style={[{width: "50%"}, tw('')]}>
                <Text style={tw('text-lg font-bold text-black mr-2')}>Guests:</Text> 
            </View>   
            <View style={{width: "50%"}}>
                <Text style={tw('text-lg')}>{booking?.guests}</Text>
            </View>
        </View>
        <View style={tw('flex-row items-start justify-start w-full mb-2')}>         
            <View style={[{width: "50%"}, tw('')]}>
                <Text style={tw('text-lg font-bold text-black mr-2')}>TotalPrice:</Text> 
            </View>   
            <View style={{width: "50%"}}>
                <Text style={tw('text-lg')}>€{Math.round(booking?.totalPrice * 100 / 100).toFixed(2)}</Text>
            </View>
        </View>
        {booking?.totalPrice != booking?.priceAfterDiscount && (
            <View style={tw('flex-row items-start justify-start w-full mb-2')}>         
                <View style={[{width: "50%"}, tw('')]}>
                    <Text style={tw('text-lg font-bold text-black mr-2')}>Price after discount:</Text> 
                </View>   
                <View style={{width: "50%"}}>
                    <Text style={tw('text-lg')}>€{Math.round(booking?.priceAfterDiscount * 100 / 100).toFixed(2)}</Text>
                </View>
            </View>
        )}
        <View style={tw('flex-row items-start justify-start w-full mb-2')}>         
            <View style={[{width: "50%"}, tw('')]}>
                <Text style={tw('text-lg font-bold text-black mr-2')}>Renting address:</Text> 
            </View>   
            <View style={{width: "50%"}}>
                <Text style={tw('text-lg')}>{booking?.home?.address}, {booking?.home?.zipcode} {booking?.home?.city.name}, {booking?.home?.country.name}</Text>
            </View>
        </View>
    </TouchableOpacity>
  )
}

export default BookingCard

const styles = StyleSheet.create({})