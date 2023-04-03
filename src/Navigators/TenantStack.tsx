import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { RootState } from '../Store/store';
import { NavigationContainer } from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MainHomes from '../Screens/Tenant/MainHomes';
import HomesStack from './HomesStack';
import WishListScreen from '../Screens/Tenant/WishListScreen';
import InBoxScreen from '../Screens/Tenant/InBoxScreen';
import ProfileScreen from '../Screens/Tenant/ProfileScreen';


export type TenantBottomTabProps = {
    HomesStack: undefined,
    WishListScreen: undefined,
    InBoxScreen: undefined,
    ProfileScreen: undefined
}

const tab = createBottomTabNavigator<TenantBottomTabProps>();
const TenantStack = () => {
    const {users, authUser, userSuccess, userError, message} = useSelector((state: RootState) => state.USERS)

  return (
        <tab.Navigator
        screenOptions={{
          tabBarShowLabel: false,
          tabBarInactiveTintColor: '#c7c9c9',
          tabBarActiveTintColor: '#FF5A5F'
        }}
        initialRouteName='HomesStack'
        >
            <tab.Screen 
                options={{
                headerShown: false,
                tabBarIcon: ({color}) => (
                    <AntDesign name="home" size={28} color={color} />
                    )
                }} 
                name="HomesStack" 
                component={HomesStack}
            ></tab.Screen>
            <tab.Screen 
                options={{
                headerShown: false,
                tabBarIcon: ({color}) => (
                    <AntDesign name="hearto" size={28} color={color} />
                    )
                }} 
                name="WishListScreen" 
                component={WishListScreen}
            ></tab.Screen>
            <tab.Screen 
                options={{
                headerShown: false,
                tabBarIcon: ({color}) => (
                    <Ionicons name="chatbox-outline" size={28} color={color} />
                    )
                }} 
                name="InBoxScreen" 
                component={InBoxScreen}
            ></tab.Screen>
            <tab.Screen 
                options={{
                headerShown: false,
                tabBarIcon: ({color}) => (
                    <Ionicons name="person-circle-outline" size={32} color={color} />
                    )
                }} 
                name="ProfileScreen" 
                component={ProfileScreen}
            ></tab.Screen>

            
        </tab.Navigator>
  )
}

export default TenantStack

const styles = StyleSheet.create({})
