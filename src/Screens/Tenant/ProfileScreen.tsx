import { Alert, ScrollView, StyleSheet, Text, Touchable, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { HOST_URL, RootState } from '../../Store/store';
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
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import HomeDetailCalendar from '../../Component/HomeDetailCalendar';
import BookingGuestModal from '../../Component/BookingGuestModal';
import { Button, Image } from '@rneui/base';
import { HomesStackParamList } from '../../Navigators/HomesStack';
import { TenantBottomTabProps } from '../../Navigators/TenantStack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import LoadingComponent from '../../Component/LoadingComponent';

const imageDefault = [
    "wallpaper.jpg_a776d37b-97c9-4bd6-b4ca-1f342de06161",
    "Cabin-in-the-city-Best-Airbnbs-in-Ontario-819x1024.jpeg_89abc5d3-cd57-4fae-92ed-96bb77daf640",
    "dormir-dans-une-ferme-en-suède-best-airbnb-in-south-sweden-main.jpg_c83de24f-f4d0-4367-96ef-96d261a99e94"
];

type ProfileScreenNavigationProp = CompositeNavigationProp<
BottomTabNavigationProp<TenantBottomTabProps, "ProfileScreen">,
NativeStackNavigationProp<RootStackParamList>
>;

const ProfileScreen = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const tw = useTailwind();
    const {users, authUser, userError, userSuccess, message} = useSelector((state: RootState) => state.USERS);
    const dispatch = useDispatch();
    const navigation = useNavigation<ProfileScreenNavigationProp>();
    const windownWith = useWindowDimensions().width;

    const navigateToUserProfileScreen = () => {
        navigation.navigate('UserProfileScreen', {userId: authUser?.id});
    };
    const navigateToBookingsListScreen = () => {
      navigation.navigate('BookingsListScreen');
    }
    const navigateToChangePasswordScreen = () => {
      navigation.navigate('ChangePassword');
    }

    if(isLoading) {
      return <LoadingComponent/>
  }

  return (
    <SafeAreaView style={tw('flex-1 bg-white')}>
      <Text style={tw('text-3xl font-bold text-black mt-6 ml-4 mb-4')}>Profile</Text>
      <View style={tw('px-4')}>
        <View style={tw('flex-row items-center justify-start pb-4 border-b-2 border-gray-200')}>
            <Image source={{uri: HOST_URL + "/api/images/image/" + authUser?.imgUrls}} style={[tw('rounded-full mr-4'), {width: 60, height: 60, resizeMode: 'cover'}]}></Image>      
            <View style={tw(' items-start justify-start flex-1')}>
                <Text style={tw(' text-lg text-black font-bold')}>{authUser.username}</Text>
                <Text style={tw(' text-base')}>show Profile</Text>
            </View>
            <TouchableOpacity onPress={navigateToUserProfileScreen} style={tw('')}>
                <AntDesign name="right" size={28} color="black" /> 
            </TouchableOpacity>
        </View>
      </View>
      <Text style={tw('text-2xl font-bold text-black mt-6 ml-4 mb-4')}>Settings</Text>
      <View style={tw('w-full px-4  my-2')}>
        <View style={tw('flex-row items-center justify-start pb-4 border-b-2 border-gray-200')}>
            <Ionicons name="person-circle-outline" size={32} color="black" />
            <Text style={tw('text-lg text-black ml-2 flex-1')}>Update Information</Text>
            <TouchableOpacity onPress={() => navigation.navigate("UpdateProfileScreen")} style={tw('')}>
                <AntDesign name="right" size={28} color="black" /> 
            </TouchableOpacity>
        </View>
      </View>
      <View style={tw('w-full px-4  my-2')}>
        <View style={tw('flex-row items-center justify-start pb-4 border-b-2 border-gray-200')}>
            <AntDesign name="calendar" size={32} color="black" />
            <Text style={tw('text-lg text-black ml-2 flex-1')}>Bookings</Text>
            <TouchableOpacity onPress={navigateToBookingsListScreen} style={tw('')}>
                <AntDesign name="right" size={28} color="black" /> 
            </TouchableOpacity>
        </View>
      </View>
      <View style={tw('w-full px-4  my-2')}>
        <View style={tw('flex-row items-center justify-start pb-4 border-b-2 border-gray-200')}>
            <Ionicons name="shield-outline" size={32} color="black" />
            <Text style={tw('text-lg text-black ml-2 flex-1')}>Change Password</Text>
            <TouchableOpacity onPress={navigateToChangePasswordScreen} style={tw('')}>
                <AntDesign name="right" size={28} color="black" /> 
            </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({})