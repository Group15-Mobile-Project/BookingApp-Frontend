import { Alert,  Keyboard, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTailwind } from 'tailwind-rn/dist'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from '@rneui/themed';
import { useDispatch, useSelector } from 'react-redux';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { HOST_URL, RootState } from '../Store/store';
import { Register, ResetUser } from '../Store/Actions/UserAction';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigators/MainStack';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import axios from 'axios';
import { ImageData } from '../Model';

const SignUpScreen = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [imageurl, setImageurl] = useState<string | null>(null);
    const tw = useTailwind();
    const {users, authUser, authError, authSuccess, message} = useSelector((state: RootState) => state.USERS);
    const dispatch = useDispatch();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    useEffect(() => {
        if( authError) {
            Alert.alert("signup failed");
            dispatch(ResetUser() as any);
        }
        if(authSuccess && authUser?.roles?.includes("USER") ) {
            console.log("auth role: " + authUser?.roles);
            Alert.alert("signup successfully");
            navigation.navigate('RoleScreen');
            dispatch(ResetUser() as any);
        }
    }, [authSuccess, authError, message, dispatch])


    const uploadImageFunction = async () => {
        const images: any = await launchImageLibrary({
            mediaType: 'photo',
            quality: 1
        })
        console.log(images)
        const formdata = new FormData();
        if(!images.canceled) {
                console.log(images.assets[0])
                const split = images.assets[0].uri.split('/')
                const fileNameDot = split[split.length - 1].split(".")
                const fileName = fileNameDot[0]
                const imageFile = {
                    uri: images.assets[0].uri,
                    type: images.assets[0].type,
                    name: fileName
                }
                console.log(imageFile)
               formdata.append("file",  JSON.parse(JSON.stringify(imageFile)))         
        }
        console.log(formdata)
        const res = await axios.post(HOST_URL + "/api/images/singleImage", formdata, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        const data: ImageData = await res.data;
        console.log(res.data)
        setImageurl(data.image)
    }

    const submitFunction = async () => {
        if(username && username.length > 0 && password && password.length > 0 && confirmPassword && confirmPassword.length > 0 && email && email.length > 0 && imageurl) {
           await  dispatch(Register({username, email,  password, confirmPassword, imageurl}) as any)
           setUsername("")
           setPassword("")
           setImageurl(null)
           setConfirmPassword("")
           setEmail("")
        } else {
            Alert.alert("please fill all required information")
        }
    }

    const navigateToLogin = () => {
        navigation.navigate("Login");
    }

  return (
   <KeyboardAvoidingView style={tw('flex-1')}>
        <TouchableWithoutFeedback style={tw('flex-1')} onPress={Keyboard.dismiss}>
            <SafeAreaView style={tw('flex-1 items-center justify-center px-4')}>    
                <TextInput value={username} placeholder="username" onChangeText={(text: string) => setUsername(text)} style={tw('w-full border border-gray-400 py-2 px-4 rounded-lg text-lg mb-6')}></TextInput>
                <TextInput value={email} placeholder="email" onChangeText={(text: string) => setEmail(text)} style={tw('w-full border border-gray-400 py-2 px-4 rounded-lg text-lg mb-6')}></TextInput>
                <TextInput secureTextEntry={true} value={password}  placeholder="Password" onChangeText={(text: string) => setPassword(text)} style={tw('w-full border border-gray-400 py-2 px-4 rounded-lg text-lg mb-6')} onSubmitEditing={submitFunction}></TextInput>
                <TextInput secureTextEntry={true} value={confirmPassword}  placeholder="confirm your Password" onChangeText={(text: string) => setConfirmPassword(text)} style={tw('w-full border border-gray-400 py-2 px-4 rounded-lg text-lg mb-6')} onSubmitEditing={submitFunction}></TextInput>
                <TouchableOpacity  style={[tw('w-full rounded-lg mb-6 py-2 font-bold px-6'), {backgroundColor: "#03b1fc"}]}  onPress={uploadImageFunction}>
                    <Text style={tw('text-base text-white')}>Your Avartar</Text>
                </TouchableOpacity>
                <Button  color="#03b1fc" containerStyle={tw('w-full rounded-lg mb-6')} size='lg' title='Sign Up' onPress={submitFunction}></Button>
                <View style={tw('flex flex-row')}>
                    <Text style={tw('text-base text-gray-400 mr-4')}> have an account?</Text>
                    <TouchableOpacity activeOpacity={0.2} onPress={navigateToLogin}>
                        <Text style={tw('text-base text-zinc-700 mr-4')}>Login</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
   </KeyboardAvoidingView>
  )
}

export default SignUpScreen

const styles = StyleSheet.create({})