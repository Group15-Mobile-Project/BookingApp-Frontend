import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../Screens/LoginScreen';
import SignUpScreen from '../Screens/SignUpScreen';
import ChangePassword from '../Screens/ChangePassword';
import RoleScreen from '../Screens/RoleScreen';
import MainHomes from '../Screens/Tenant/MainHomes';
import HomeSearchScreen from '../Screens/Tenant/HomeSearchScreen';
import SearchResultScreen from '../Screens/Tenant/SearchResultScreen';
import MapHomes from '../Screens/Tenant/MapHomes';
import DetailHomeScreen from '../Screens/Tenant/DetailHomeScreen';
import HomeReviewList from '../Screens/Tenant/HomeReviewList';
import BookingScreen from '../Screens/Tenant/BookingScreen';

export type RootStackParamList = {
    Login: undefined,
    SignUp: undefined,
    ChangePassword: undefined,
    RoleScreen: undefined,
    MainHomes: undefined,
    HomeSearchScreen: undefined,
    SearchResultScreen: {
      citySearch: string,
      checkIn: string,
      checkOut: string,
      capacity: number
    },
    MapHomes: undefined,
    DetailHomeScreen: {
      homeId: number
    },
    HomeReviewList: {
      homeId: number
    },
    BookingScreen: {
      homeId: number,
      checkIn: string,
      checkOut: string
    }
   };
const stack = createNativeStackNavigator<RootStackParamList>();

const MainStack = () => {
  return (
    <stack.Navigator >
        <stack.Screen component={LoginScreen} options={{headerShown: false}} name="Login"></stack.Screen>
        <stack.Screen component={SignUpScreen} options={{headerShown: false}} name="SignUp"></stack.Screen>
        <stack.Screen component={ChangePassword} options={{headerShown: false}} name="ChangePassword"></stack.Screen>
        <stack.Screen component={RoleScreen} options={{headerShown: false}} name="RoleScreen"></stack.Screen>
        <stack.Screen component={MainHomes} options={{headerShown: false}} name="MainHomes"></stack.Screen>
        <stack.Screen component={HomeSearchScreen}  options={{headerShown: false}} name="HomeSearchScreen"></stack.Screen>
        <stack.Screen component={SearchResultScreen}  options={{headerShown: false}} name="SearchResultScreen"></stack.Screen>
        <stack.Screen component={MapHomes} options={{title: "Back"}} name="MapHomes"></stack.Screen>
        <stack.Screen component={DetailHomeScreen} options={{headerShown: false}} name="DetailHomeScreen"></stack.Screen>
        <stack.Screen component={HomeReviewList} options={{title: "back"}} name="HomeReviewList"></stack.Screen>
        <stack.Screen component={BookingScreen} options={{title: "confirm"}} name="BookingScreen"></stack.Screen>
    </stack.Navigator>
  )
}

export default MainStack

const styles = StyleSheet.create({})