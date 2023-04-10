import { Alert, Image, Keyboard, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTailwind } from 'tailwind-rn/dist'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from '@rneui/themed';
import { useDispatch, useSelector } from 'react-redux';
import {  LogOutAction, ResetUser, updateToHostAction } from '../Store/Actions/UserAction';
import { RootState } from '../Store/store';
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigators/MainStack';
import { HomesStackParamList } from '../Navigators/HomesStack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { TenantBottomTabProps } from '../Navigators/TenantStack';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';

type RoleScreenNavigationProp = CompositeNavigationProp<
NativeStackNavigationProp<RootStackParamList, "RoleScreen">,
BottomTabNavigationProp<TenantBottomTabProps>>;

const RoleScreen = () => {
    const tw = useTailwind()
    const {users, authUser, userError, userSuccess, message} = useSelector((state: RootState) => state.USERS)
    const dispatch = useDispatch()
    const navigation = useNavigation<RoleScreenNavigationProp>()
    const tenantNavigation = () => {
        navigation.navigate('TenantStack')
    } 
    const hostNavigation = async () => {
        if(authUser.roles.includes("HOST")) {
            console.log("has host");
            navigation.navigate('HostStack');
        } else {
            console.log("update to host");
            await dispatch(updateToHostAction() as any)
            navigation.navigate('HostStack');
        }
    }

    const logout = async () => {
        await dispatch(LogOutAction() as any);
        navigation.goBack();
    }


  return (
    <SafeAreaView style={tw('flex-1 items-center justify-center px-4')}>
        <TouchableOpacity onPress={tenantNavigation} style={[tw('w-1/3 rounded-2xl mb-6 bg-[#03b1fc] items-center justify-center text-lg font-bold text-white'), {height: 100}]}>
            <Text style={tw(' text-lg font-bold text-white')}>Tenant</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={hostNavigation} style={[tw('w-1/3 rounded-2xl mb-6 bg-[#03b1fc] items-center justify-center text-lg font-bold text-white'), {height: 100}]}>
            <Text style={tw(' text-lg font-bold text-white')}>Host</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={logout} style={tw('px-4 py-4 mt-4 rounded-full bg-[#FF5A5F] justify-center items-center')}>
            <AntDesign name='logout' color="white" size={30}></AntDesign>
        </TouchableOpacity>
    </SafeAreaView>
  )
}

export default RoleScreen

const styles = StyleSheet.create({})