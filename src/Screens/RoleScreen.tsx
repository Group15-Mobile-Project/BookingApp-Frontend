import { Alert, Image, Keyboard, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTailwind } from 'tailwind-rn/dist'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from '@rneui/themed';
import { useDispatch, useSelector } from 'react-redux';
import {  ResetUser, updateToHostAction } from '../Store/Actions/UserAction';
import { RootState } from '../Store/store';
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigators/MainStack';
import { HomesStackParamList } from '../Navigators/HomesStack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { TenantBottomTabProps } from '../Navigators/TenantStack';

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


  return (
    <SafeAreaView style={tw('flex-1 items-center justify-center px-4')}>
        <Button  color="#FF5A5F" containerStyle={tw('w-full rounded-lg mb-6')} size='lg' title='Tenant' onPress={tenantNavigation}></   Button>
        <Button  color="#FF5A5F" containerStyle={tw('w-full rounded-lg mt-6')} size='lg' title='Host' onPress={hostNavigation}></Button>
    </SafeAreaView>
  )
}

export default RoleScreen

const styles = StyleSheet.create({})