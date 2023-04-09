import { Alert, Image, Keyboard, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useState, useLayoutEffect, useCallback } from 'react'
import { useTailwind } from 'tailwind-rn/dist'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from '@rneui/themed';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootStackParamList } from '../../Navigators/MainStack';
import { HostBottomTabProps } from '../../Navigators/HostStack';
import { RootState } from '../../Store/store';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import HostOldBookingsScreen from './HostOldBookingsScreen';
import HostUpcomingBookingsScreen from './HostUpcomingBookingsScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getHostByAuthUser } from '../../Store/Actions/HostAction';
import LoadingComponent from '../../Component/LoadingComponent';


type BookingListScreentNavigationProp = CompositeNavigationProp<
BottomTabNavigationProp<HostBottomTabProps, "BookingListScreent">,
NativeStackNavigationProp<RootStackParamList>>;
const Tab = createMaterialTopTabNavigator();

const BookingListScreent = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const tw = useTailwind()
    const {users, authUser, userError, userSuccess, message} = useSelector((state: RootState) => state.USERS)
    const dispatch = useDispatch()
    const navigation = useNavigation<BookingListScreentNavigationProp>()

    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => (
                <View style={tw('bg-white py-4 px-4 flex-row items-center')}>
                    <TouchableOpacity style={tw('mr-4')} onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={tw('text-2xl text-black')}>Guests' Reservations</Text>
                </View>
            )
        })
    }, [])

    const loadHost = useCallback(async () => {
        await dispatch(getHostByAuthUser() as any)
    }, [authUser, dispatch])
    
    useEffect(() => {
        setIsLoading(true)
        loadHost().then(() => setIsLoading(false))
    }, [dispatch, authUser])

    if(isLoading) {
        return <LoadingComponent/>
    }

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
            <Tab.Screen name="HostUpcomingBookingsScreen" children={() => <HostUpcomingBookingsScreen ></HostUpcomingBookingsScreen>} options={{tabBarLabel: "Upcoming"}}/>
            <Tab.Screen name="HostOldBookingsScreen" children={() => <HostOldBookingsScreen ></HostOldBookingsScreen>} options={{tabBarLabel: "Checked out"}}/>
        </Tab.Navigator>
    </View>
  )
}

export default BookingListScreent

const styles = StyleSheet.create({})