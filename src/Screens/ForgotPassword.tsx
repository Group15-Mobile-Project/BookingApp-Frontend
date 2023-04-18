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

const ForgotPassword = () => {
    const [email, setEmail] = useState<string>("")
    const [message, setMessage] = useState<string | null>(null)
    const tw = useTailwind()
    const text: string = "hello"
    const {users, authUser, authError, authSuccess} = useSelector((state: RootState) => state.USERS)
    const dispatch = useDispatch()
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

    

    const submitFunction = async () => {
        console.log("login")
        if(email && email.length > 0) {
            try {
                const res = await axios.put(HOST_URL + "/api/users/forgotPassword?email=" + email, {}, {});
                const data = await res.data;
                console.log(data)
                setEmail("")
                setMessage(data);
            } catch (err) {
                Alert.alert("sending email failed");    
            }
          
        } else {
            Alert.alert("please fill all required information")
        }
        
    }

    const navigateToSignUp = () => {
        navigation.navigate("SignUp")
    }
    const navigateToLogin = () => {
        navigation.navigate("Login")
    }

  return (

    <KeyboardAvoidingView style={tw('flex-1')}>
        <TouchableWithoutFeedback style={tw('flex-1')} onPress={Keyboard.dismiss}>
            <SafeAreaView style={tw('flex-1 items-start justify-start mt-20 px-4')}>                 
                <Text style={tw('text-2xl my-6 text-black font-bold')}>Reset Password</Text>
                {/* <Text style={tw('text-base text-black mb-10')}>your password will be reset and sent to your email, please use the new password to login and update your own password</Text> */}
                <TextInput value={email} placeholder="Your email" onChangeText={(text: string) => setEmail(text)} style={tw('w-full border border-gray-400 py-2 px-4 rounded-lg text-lg mb-6')}></TextInput>
                <Button  color="#03b1fc" containerStyle={tw('w-full rounded-lg mb-6')} size='lg' title='Send' onPress={submitFunction}></Button>
                <View style={tw('flex flex-row mx-auto')}>
                    <Text style={tw('text-base text-gray-400 mr-4')}>Don't have an account?</Text>
                    <TouchableOpacity activeOpacity={0.2} onPress={navigateToSignUp}>
                        <Text style={tw('text-base text-zinc-700 mr-4')}>Sign Up</Text>
                    </TouchableOpacity>
                </View>        
                {message && (
                    <View style={tw('mt-20  items-center justify-center')}>
                        <Text style={tw('text-lg text-red-500 mb-4')}>{message} , please check your email, use the new password to login and update your own password</Text>
                        <TouchableOpacity style={tw('w-24 h-12 rounded-lg bg-[#03b1fc] items-center justify-center')} activeOpacity={0.2} onPress={navigateToLogin}>
                            <Text style={[tw('text-lg text-white font-bold')]}>Login</Text>
                        </TouchableOpacity>
                    </View>
                    
                )}  
            </SafeAreaView>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>

  )
}

export default ForgotPassword

const styles = StyleSheet.create({})