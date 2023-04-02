import { Alert, ScrollView, StyleSheet, Text, Touchable, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootState } from '../../Store/store';
import { RootStackParamList } from '../../Navigators/MainStack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute, CompositeNavigationProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getHomesByHomeIdAction } from '../../Store/Actions/HomeAction';
import { ListRenderItem } from 'react-native';
import { FlatList } from 'react-native';
import { useTailwind } from 'tailwind-rn/dist'
import { createBookingAction, getCountDiscountAction } from '../../Store/Actions/BookingAction';
import BookingHomeCard from '../../Component/BookingHomeCard';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import HomeDetailCalendar from '../../Component/HomeDetailCalendar';
import BookingGuestModal from '../../Component/BookingGuestModal';
import { Button } from '@rneui/base';
import { HomesStackParamList } from '../../Navigators/HomesStack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import NotificationsScreen from './NotificationsScreen';
import MesssagesScreen from './MesssagesScreen';

const Tab = createMaterialTopTabNavigator();
const InBoxScreen = () => {
    const {users, authUser, userError, userSuccess, message} = useSelector((state: RootState) => state.USERS);
    const tw = useTailwind()
    const windownWith = useWindowDimensions().width;
    const dispatch = useDispatch();

  return (
    <SafeAreaView style={tw('flex-1 bg-white')}>
        <Text style={tw('text-3xl font-bold text-black my-4 ml-4')}>Inbox</Text>
        <Tab.Navigator
          screenOptions={{
              tabBarActiveTintColor: "gray",
              tabBarLabelStyle: {fontSize: 14, color: "gray", fontWeight: 'bold'},
              tabBarStyle: {marginTop: 0, paddingTop: 0}

          }}
          tabBarPosition='top'
          style={tw('flex-1')}
        >   
            <Tab.Screen name="SearchTags" children={() => <MesssagesScreen></MesssagesScreen>} options={{tabBarLabel: "Messages"}}/>
            <Tab.Screen name="SearchPosts"  options={{tabBarLabel: "Notifications"}} children={() => <NotificationsScreen ></NotificationsScreen>}/>
           
           
        </Tab.Navigator>
    </SafeAreaView >
  )
}

export default InBoxScreen

const styles = StyleSheet.create({})