import { Alert, FlatList, Image, Keyboard, KeyboardAvoidingView, ListRenderItem, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useTailwind } from 'tailwind-rn/dist'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from '@rneui/themed';
import { useDispatch, useSelector } from 'react-redux';
import {  ResetUser, updateToHostAction } from '../Store/Actions/UserAction';
import { RootState } from '../Store/store';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigators/MainStack';
import { HOME } from '../Model';
import HomeCardMain from '../Component/HomeCardMain';
import { getHomesAction } from '../Store/Actions/HomeAction';




const MainHomes = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
    const tw = useTailwind()
    const {users, authUser, userError, userSuccess, message} = useSelector((state: RootState) => state.USERS)
    const {homes, homeSuccess, homeError} = useSelector((state: RootState) => state.HOMES)
    const dispatch = useDispatch()
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()   
    const handleGetHomes = useCallback(async () => {
        setIsRefreshing(true)
        await dispatch(getHomesAction() as any)
        setIsRefreshing(false)
    }, [authUser, dispatch])

    useEffect(() => {
        setIsLoading(true)
        handleGetHomes().then(() => setIsLoading(false))
      
    }, [])
    
    const handleRenderItem: ListRenderItem<any> = ({item}: {item: HOME}) => (
        <HomeCardMain item={item}></HomeCardMain>
    )

  return (
   <KeyboardAvoidingView style={tw('flex-1')}>
    <TouchableWithoutFeedback style={tw('flex-1')} onPress={Keyboard.dismiss}>
        <SafeAreaView style={tw('flex-1')}> 
            <FlatList
                refreshing={isRefreshing}
                onRefresh={handleGetHomes}
                data={homes}
                keyExtractor={(item: any) => item.id}
                renderItem={handleRenderItem}
                showsVerticalScrollIndicator={false}
                >
            </FlatList>
           
        </SafeAreaView>
    </TouchableWithoutFeedback>
   </KeyboardAvoidingView>
  )
}

export default MainHomes

const styles = StyleSheet.create({})