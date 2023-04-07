import { Alert,  Keyboard, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTailwind } from 'tailwind-rn/dist'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from '@rneui/themed';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import axios from 'axios';
import { ImageData } from '../../Model';
import { RootStackParamList } from '../../Navigators/MainStack';
import { HOST_URL, RootState } from '../../Store/store';
import { TenantBottomTabProps } from '../../Navigators/TenantStack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Register, updateProfileAction } from '../../Store/Actions/UserAction';

const imageDefault = [
    "wallpaper.jpg_a776d37b-97c9-4bd6-b4ca-1f342de06161",
    "Cabin-in-the-city-Best-Airbnbs-in-Ontario-819x1024.jpeg_89abc5d3-cd57-4fae-92ed-96bb77daf640",
    "dormir-dans-une-ferme-en-suède-best-airbnb-in-south-sweden-main.jpg_c83de24f-f4d0-4367-96ef-96d261a99e94"
];

type UpdateProfileScreenNavigationProp = CompositeNavigationProp<
NativeStackNavigationProp<RootStackParamList, "UpdateProfileScreen">,
BottomTabNavigationProp<TenantBottomTabProps>
>;

const UpdateProfileScreen = () => {
    const [username, setUsername] = useState<string | null>("");
    const [email, setEmail] = useState<string | null>("");
    const [imageurl, setImageurl] = useState<string | null>(null);
    const tw = useTailwind();
    const {users, authUser, authError, authSuccess, message} = useSelector((state: RootState) => state.USERS);
    const dispatch = useDispatch();
    const navigation = useNavigation<UpdateProfileScreenNavigationProp>();

    
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
        await dispatch(updateProfileAction(username ?? "", email ?? "", imageurl ?? "") as any);
        console.log("imageurl: " + imageurl);
        console.log("username: " + username);
        console.log("email: " + email);
        setImageurl(null);
        setEmail(null);
        setUsername(null);
        navigation.goBack();    
    }

    const navigateToLogin = () => {
        navigation.navigate("Login");
    }

  return (
   <KeyboardAvoidingView style={tw('flex-1')}>
        <TouchableWithoutFeedback style={tw('flex-1')} onPress={Keyboard.dismiss}>
            <SafeAreaView style={tw('flex-1 items-center justify-center px-4')}>    
                <TextInput value={username ?? ""} placeholder="username" onChangeText={(text: string) => setUsername(text)} style={tw('w-full border border-gray-400 py-2 px-4 rounded-lg text-lg mb-6')}></TextInput>
                <TextInput value={email ?? ""} placeholder="email" onChangeText={(text: string) => setEmail(text)} style={tw('w-full border border-gray-400 py-2 px-4 rounded-lg text-lg mb-6')}></TextInput>
                <TouchableOpacity  style={[tw('w-full rounded-lg mb-6 py-2 font-bold px-6'), {backgroundColor: "#03b1fc"}]}  onPress={uploadImageFunction}>
                    <Text style={tw('text-base text-white')}>Your Avartar</Text>
                </TouchableOpacity>
                <Button  color="#03b1fc" containerStyle={tw('w-full rounded-lg mb-6')} size='lg' title='Update' onPress={submitFunction}></Button>
            </SafeAreaView>
        </TouchableWithoutFeedback>
   </KeyboardAvoidingView>
  )
}

export default UpdateProfileScreen

const styles = StyleSheet.create({})