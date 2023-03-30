import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainHomes from '../Screens/Tenant/MainHomes';
import SearchResultScreen from '../Screens/Tenant/SearchResultScreen';

export type HomesStackParamList = {
    MainHomes: undefined,
    SearchResultScreen: {
      citySearch: string,
      checkIn: string,
      checkOut: string,
      capacity: number
    },
   };

const stack = createNativeStackNavigator<HomesStackParamList>();
const HomesStack = () => {
  return (
    <stack.Navigator initialRouteName='MainHomes'>
        <stack.Screen component={MainHomes} options={{headerShown: false}} name="MainHomes"></stack.Screen>
        <stack.Screen component={SearchResultScreen}  options={{headerShown: false}} name="SearchResultScreen"></stack.Screen>
    </stack.Navigator>
  )
}

export default HomesStack

const styles = StyleSheet.create({})