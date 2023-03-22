import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../Screens/LoginScreen';
import SignUpScreen from '../Screens/SignUpScreen';
import ChangePassword from '../Screens/ChangePassword';
import RoleScreen from '../Screens/RoleScreen';
import MainHomes from '../Screens/MainHomes';
import HomeSearchScreen from '../Screens/HomeSearchScreen';
import SearchResultScreen from '../Screens/SearchResultScreen';

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
    }
   };
const stack = createNativeStackNavigator<RootStackParamList>()

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
    </stack.Navigator>
  )
}

export default MainStack

const styles = StyleSheet.create({})