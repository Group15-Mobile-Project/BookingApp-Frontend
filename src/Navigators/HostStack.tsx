import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { RootState } from '../Store/store';
import { NavigationContainer } from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MainHomes from '../Screens/Tenant/MainHomes';
import HomesStack from './HomesStack';
import BookingListScreent from '../Screens/Host/BookingListScreent';
import HostCalendar from '../Screens/Host/HostCalendar';
import HostInboxScreen from '../Screens/Host/HostInboxScreen';
import HostHomeListingScreen from '../Screens/Host/HostHomeListingScreen';
import InsightsScreen from '../Screens/Host/InsightsScreen';



export type HostBottomTabProps = {
    BookingListScreent: undefined,
    HostCalendar: undefined,
    HostInboxScreen: undefined,
    HostHomeListingScreen: undefined,
    InsightsScreen: undefined
}

const tab = createBottomTabNavigator<HostBottomTabProps>();
const HostStack = () => {
  const {users, authUser, userSuccess, userError, message} = useSelector((state: RootState) => state.USERS)

  return (
        <tab.Navigator
            screenOptions={{
                tabBarShowLabel: false,
                tabBarInactiveTintColor: '#c7c9c9',
                tabBarActiveTintColor: '#03b1fc'
            }}
            initialRouteName='BookingListScreent'
        >
            <tab.Screen 
                options={{
                    tabBarIcon: ({color}) => (
                        <FontAwesome name="envelope-open-o" size={28} color={color} />
                    )
                }} 
                name="BookingListScreent" 
                component={BookingListScreent}
            ></tab.Screen>
            <tab.Screen 
                options={{
                    tabBarIcon: ({color}) => (
                        <AntDesign name="calendar" size={28} color={color} />
                    )
                }} 
                name="HostCalendar" 
                component={HostCalendar}
            ></tab.Screen>
            <tab.Screen 
                options={{
                    headerShown: false,
                    tabBarIcon: ({color}) => (
                        <Ionicons name="chatbox-outline" size={32} color={color} />
                    )
                }} 
                name="HostInboxScreen" 
                component={HostInboxScreen}
            ></tab.Screen>
            <tab.Screen 
                options={{
                    tabBarIcon: ({color}) => (
                        <FontAwesome5 name="warehouse" size={24} color={color} />
                    )
                }} 
                name="HostHomeListingScreen" 
                component={HostHomeListingScreen}
            ></tab.Screen>
            <tab.Screen 
                options={{
                    tabBarIcon: ({color}) => (
                        <Ionicons name="md-stats-chart-outline" size={28} color={color} />
                    )
                }} 
                name="InsightsScreen" 
                component={InsightsScreen}
            ></tab.Screen>
        </tab.Navigator>
  )
}

export default HostStack

const styles = StyleSheet.create({})