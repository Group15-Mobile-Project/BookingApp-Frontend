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
import CountryScreen from '../Screens/Admin/CountryScreen';
import CategoryScreen from '../Screens/Admin/CategoryScreen';
import HomesScreen from '../Screens/Admin/HomesScreen';
import UsersListScreen from '../Screens/Admin/UsersListScreen';


export type AdminBottomTabProps = {
    CountryScreen: undefined,
    CategoryScreen: undefined,
    HomesScreen: undefined,
    UsersListScreen: undefined
  
}

const tab = createBottomTabNavigator<AdminBottomTabProps>();

const AdminStack = () => {
    const {users, authUser, userSuccess, userError, message} = useSelector((state: RootState) => state.USERS)

    return (
        <tab.Navigator
            screenOptions={{
                tabBarShowLabel: false,
                tabBarInactiveTintColor: '#c7c9c9',
                tabBarActiveTintColor: '#03b1fc'
            }}
            initialRouteName='HomesScreen'
        >
            <tab.Screen 
                options={{
                    tabBarIcon: ({color}) => (
                        <FontAwesome name="home" size={28} color={color} />
                    ),
                    headerShown: false
                }} 
                name="HomesScreen" 
                component={HomesScreen}
            ></tab.Screen>
            <tab.Screen 
                options={{
                    tabBarIcon: ({color}) => (
                        <FontAwesome name="globe" size={28} color={color} />
                    ),
                    headerShown: false
                }} 
                name="CountryScreen" 
                component={CountryScreen}
            ></tab.Screen>
            <tab.Screen 
                options={{
                    tabBarIcon: ({color}) => (
                        <Entypo name="list" size={28} color={color} />
                    ),
                    headerShown: false
                }} 
                name="CategoryScreen" 
                component={CategoryScreen}
            ></tab.Screen>
            <tab.Screen 
                options={{
                    tabBarIcon: ({color}) => (
                        <Ionicons name="people" size={28} color={color} />
                    ),
                    headerShown: false
                }} 
                name="UsersListScreen" 
                component={UsersListScreen}
            ></tab.Screen>
        </tab.Navigator>
    )
}

export default AdminStack

const styles = StyleSheet.create({})