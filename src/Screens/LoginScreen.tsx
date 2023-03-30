import { Alert,  Keyboard, KeyboardAvoidingView, KeyboardAvoidingViewBase, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import useTailwind from 'tailwind-rn/dist/use-tailwind'
import axios from 'axios'
import { HOST_URL, RootState } from '../Store/store'
import { login, ResetUser } from '../Store/Actions/UserAction'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { RootStackParamList } from '../Navigators/MainStack'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Button } from '@rneui/themed';


const LoginScreen = () => {
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const tw = useTailwind()
    const text: string = "hello"
    const {users, authUser, userError, userSuccess, message} = useSelector((state: RootState) => state.USERS)
    const dispatch = useDispatch()
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

    useEffect(() => {
        if(userSuccess && authUser?.roles?.includes("USER") ) {
            console.log(authUser?.roles)
            dispatch(ResetUser() as any)
        }
        if(userSuccess && authUser?.roles?.includes("USER") ) {
           
            navigation.navigate('RoleScreen')
            dispatch(ResetUser() as any)
        }
        if(userError ) {
            Alert.alert("login failed")       
            dispatch(ResetUser() as any)
        }
        
    }, [userSuccess, userError, message, dispatch])

    

    const submitFunction = async () => {
        console.log("login")
        if(username && username.length > 0 && password && password.length > 0) {
           await  dispatch(login({username, password}) as any)
            console.log(username + " : " + password)
           setUsername("")
           setPassword("")
           if(authUser && authUser.role == "ADMIN") {
            // navigation.navigate("AdminHome")
           }
          
        } else {
            Alert.alert("please fill all required information")
        }
        
    }

    const navigateToSignUp = () => {
        navigation.navigate("SignUp")
    }

  return (

    <KeyboardAvoidingView style={tw('flex-1')}>
        <TouchableWithoutFeedback style={tw('flex-1')} onPress={Keyboard.dismiss}>
            <SafeAreaView style={tw('flex-1 items-center justify-center px-4')}>                 
                <TextInput value={username} placeholder="username" onChangeText={(text: string) => setUsername(text)} style={tw('w-full border border-gray-400 py-2 px-4 rounded-lg text-lg mb-6')}></TextInput>
                <TextInput secureTextEntry={true} value={password}  placeholder="Password" onChangeText={(text: string) => setPassword(text)} style={tw('w-full border border-gray-400 py-2 px-4 rounded-lg text-lg mb-6')} onSubmitEditing={submitFunction}></TextInput>
                <Button  color="#FF5A5F" containerStyle={tw('w-full rounded-lg mb-6')} size='lg' title='Log In' onPress={submitFunction}></Button>
                <View style={tw('flex flex-row')}>
                    <Text style={tw('text-base text-gray-400 mr-4')}>Don't have an account?</Text>
                    <TouchableOpacity activeOpacity={0.2} onPress={navigateToSignUp}>
                        <Text style={tw('text-base text-zinc-700 mr-4')}>Sign Up</Text>
                    </TouchableOpacity>
                </View>          
            </SafeAreaView>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>

  )
}

export default LoginScreen

const styles = StyleSheet.create({})