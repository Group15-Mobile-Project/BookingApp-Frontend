import { Alert, Image, Keyboard, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTailwind } from 'tailwind-rn/dist'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from '@rneui/themed';
import { useDispatch, useSelector } from 'react-redux';
import { ChangePasswordAction, ResetUser } from '../Store/Actions/UserAction';
import { RootState } from '../Store/store';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigators/MainStack';


const ChangePassword = () => {
    const [password, setPassword] = useState<string>("")
    const [newPassword, setNewPassword] = useState<string>("")
    const [confirmPassword, setConfirmPasword] = useState<string>("")
    const tw = useTailwind()
    const {users, authUser, userError, userSuccess, message} = useSelector((state: RootState) => state.USERS)
    const dispatch = useDispatch()
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
    useEffect(() => {
        if(userSuccess) {
            Alert.alert("changed password successfully")
            dispatch(ResetUser() as any)
        }
        if(userError) {
            Alert.alert("Changing password failed")
            dispatch(ResetUser() as any)
        }
    }, [dispatch, ChangePassword, userSuccess, userError])

    const submitFunction = async () => {
        if( password && password.length > 0 && newPassword && newPassword.length > 0 && confirmPassword && confirmPassword.length > 0) {
           await  dispatch(ChangePasswordAction({currentPassword: password, newPassword, confirmPassword}) as any)
           setPassword("")
           setNewPassword("")
           setConfirmPasword("")
        } else {
            Alert.alert("please fill all required information")
        }   
    }
    const navigateToSignUp = () => {
        navigation.navigate("Login")
    }
  return (
   <KeyboardAvoidingView style={tw('flex-1')}>
    <TouchableWithoutFeedback style={tw('flex-1')} onPress={Keyboard.dismiss}>
    <SafeAreaView style={tw('flex-1 items-center justify-center px-4')}>
      <TextInput secureTextEntry={true} value={password}  placeholder="Your Current Password" onChangeText={(text: string) => setPassword(text)} style={tw('w-full border border-gray-400 py-2 px-4 rounded-lg text-lg mb-6')} onSubmitEditing={submitFunction}></TextInput>
      <TextInput secureTextEntry={true} value={newPassword}  placeholder="New Password" onChangeText={(text: string) => setNewPassword(text)} style={tw('w-full border border-gray-400 py-2 px-4 rounded-lg text-lg mb-6')} onSubmitEditing={submitFunction}></TextInput>
      <TextInput secureTextEntry={true} value={confirmPassword}  placeholder="Confirm new Password" onChangeText={(text: string) => setConfirmPasword(text)} style={tw('w-full border border-gray-400 py-2 px-4 rounded-lg text-lg mb-6')} onSubmitEditing={submitFunction}></TextInput>
      <Button  color="#03b1fc" containerStyle={tw('w-full rounded-lg mb-6')} size='lg' title='Change Password' onPress={submitFunction}></Button>
    </SafeAreaView>
    </TouchableWithoutFeedback>
   </KeyboardAvoidingView>
  )
}

export default ChangePassword

const styles = StyleSheet.create({})