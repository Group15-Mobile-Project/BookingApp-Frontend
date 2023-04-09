import { Alert, FlatList, Image, Keyboard, KeyboardAvoidingView, ListRenderItem, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, ScrollView } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useTailwind } from 'tailwind-rn/dist'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from '@rneui/themed';
import { useDispatch, useSelector } from 'react-redux';
import {  ResetUser, getUserByIdAction, updateToHostAction } from '../../Store/Actions/UserAction';
import { HOST_URL, RootState } from '../../Store/store';
import { useNavigation, CompositeNavigationProp, RouteProp, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../Navigators/MainStack';
import { CATEGORY, HOME } from '../../Model';
import HomeCardMain from '../../Component/HomeCardMain';
import { getHomesAction, getHomesByCategoryAction, getHomesByCityAction, getHomesByHostAction } from '../../Store/Actions/HomeAction';
import { getCategoriesAction } from '../../Store/Actions/CategoryAction';
import HomeCategoryCard from '../../Component/HomeCategoryCard';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useWindowDimensions } from 'react-native';
import { HomesStackParamList } from '../../Navigators/HomesStack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { getWishlistByAuthUserAction } from '../../Store/Actions/WishlistAction';
import LoadingComponent from '../../Component/LoadingComponent';
import { AdminBottomTabProps } from '../../Navigators/AdminStack';
import AdminHomeCardMain from '../../Component/AdminHomeCardMain';
import HomeReviewUserProfile from '../../Component/HomeReviewUserProfile';
import TenantReviewUserProfile from '../../Component/TenantReviewUserProfile';
import { getReviewsByHostAction } from '../../Store/Actions/HomeReviewAction';
import { getTenantReviewsByTenant } from '../../Store/Actions/TenantReviewAction';
import HostProfileHomeCard from '../../Component/HostProfileHomeCard';
import UserProfileHomeCard from '../../Component/UserProfileHomeCard';
import AdminDetailedHome from './AdminDetailedHome';
import AdminProfileHomeCard from '../../Component/AdminProfileHomeCard';

type UserProfileScreenAdminNavigationProp = CompositeNavigationProp<
NativeStackNavigationProp<RootStackParamList, "UserProfileScreenAdmin">,
BottomTabNavigationProp<AdminBottomTabProps>>;

type UserProfileScreenAdminRouteProp = RouteProp<RootStackParamList, "UserProfileScreenAdmin">;
const UserProfileScreenAdmin = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isGuests, setIsGuests]  = useState<boolean>(true);
    const [isHosts, setIsHosts]  = useState<boolean>(false);
    const navigation = useNavigation<UserProfileScreenAdminNavigationProp>() 
    const {params} = useRoute<UserProfileScreenAdminRouteProp>();
    const {userId}= params;
    const dispatch = useDispatch();
    const tw = useTailwind()
    const windownWith = useWindowDimensions().width;
    const {users, authUser, otherUser, userError, userSuccess, message} = useSelector((state: RootState) => state.USERS);
    const {homes, homeSuccess, homeError} = useSelector((state: RootState) => state.HOMES);
    const {reviews, reviewSuccess, reviewError} = useSelector((state: RootState) => state.HOMEREVIEWS);
    const {tenantReviews, tenantReviewSuccess, tenantReviewError} = useSelector((state: RootState) => state.TENANTREVIEWS);

    const loadOtherUser = useCallback(async () => {
        if(userId) {
            await dispatch(getUserByIdAction(userId) as any)
        }
    }, [userId, dispatch])

    const loadHomesByHost = useCallback(async () => {
        if(otherUser) {
            console.log("hostId: " + (otherUser?.hostId));
            await dispatch(getHomesByHostAction(otherUser?.hostId) as any)
        }
    }, [otherUser,userId, dispatch])

    const loadHomeReviewsByHost = useCallback(async () => {
        if(otherUser) {
            console.log("hostId: " + (otherUser?.hostId));
            await dispatch(getReviewsByHostAction(otherUser?.hostId) as any)
        }
    }, [otherUser, userId, dispatch])
    const loadTenantReviewsByTenant = useCallback(async () => {
        if(userId) {
            console.log("tenantId: " + userId);
            await dispatch(getTenantReviewsByTenant(userId) as any)
        }
    }, [ userId, dispatch])
    useEffect(() => {
        setIsLoading(true);
        console.log(userId);
        loadOtherUser().then(() => setIsLoading(false));
    }, [userId, dispatch])

    useEffect(() => {
        loadHomesByHost().then(() => loadHomeReviewsByHost()).then(() => loadTenantReviewsByTenant());
    }, [userId, otherUser, dispatch])

    const handleRenderItem: ListRenderItem<any> = ({item}: {item: HOME}) => (
        <AdminProfileHomeCard home={item}></AdminProfileHomeCard>
    )
    const showReviewsFromGuests = () => {
        setIsHosts(false);
        setIsGuests(true);
    }
    const showReviewsFromHosts = () => {
        setIsHosts(true);
        setIsGuests(false);
    }

    if(isLoading) {
        return <LoadingComponent/>
    }

  return (
   
    <ScrollView style={tw('w-full bg-white')}>
        <View style={tw('w-full px-4 my-2')}>
            <Image source={{uri: HOST_URL + "/api/images/image/" + otherUser?.imgUrls}} style={[tw(' mb-2 rounded-full'), {width: 100, height: 100, resizeMode: 'cover'}]}></Image>  
            <Text style={tw('text-2xl font-bold text-black mb-4')}>Hi, I'm {otherUser?.username}</Text>
            {otherUser?.hasHost && (
                <View style={tw('flex-row items-start justify-start w-full mb-2')}>
                    <Entypo name='medal' color="#03b1fc" size={24}></Entypo>
                    <Text style={tw('text-lg text-black ml-4')}>SuperHost</Text>
                </View>
            )}
            <View style={tw('flex-row items-start justify-start w-full mb-2')}>
                <Entypo name='star' color="#03b1fc" size={24}></Entypo>
                <Text style={tw('text-lg text-black ml-4')}>Identity verified</Text>
            </View>
            <View style={tw('flex-row items-start justify-start w-full mb-2')}>
                <MaterialCommunityIcons name='shield-check' color="#03b1fc" size={24}></MaterialCommunityIcons>
                <Text style={tw('text-lg text-black ml-4')}>{otherUser?.reviewNums} {otherUser?.reviewNums > 1 ? "Reviews": "Review"}</Text>
            </View>
            <View style={[tw('w-full bg-gray-300 mt-2'), {height: 2}]}></View>
        </View>
        <View style={tw('w-full px-4 my-2')}> 
            <Text style={tw('text-2xl font-bold text-black mb-4')}>{otherUser?.username} confirmed</Text>
            <View style={tw('flex-row items-start justify-start w-full mb-2')}>
                <Entypo name='check' color="#03b1fc" size={24}></Entypo>
                <Text style={tw('text-lg text-black ml-4')}>Identity </Text>
            </View>
            <View style={tw('flex-row items-start justify-start w-full mb-2')}>
                <Entypo name='check' color="#03b1fc" size={24}></Entypo>
                <Text style={tw('text-lg text-black ml-4')}>Email address</Text>
            </View>
            <View style={[tw('w-full bg-gray-300 mt-2'), {height: 2}]}></View>
        </View>
        <View style={tw('w-full my-2 px-4')}>
            <View style={tw('w-full flex-row mb-2 items-center justify-between ')}>
                <View style={tw('items-start justify-start w-full flex-1')}> 
                    <Text style={tw('text-2xl font-bold text-black')}>Bookings</Text>
                </View>
                <TouchableOpacity  style={tw('')}>
                    <AntDesign name="right" size={28} color="black" /> 
                </TouchableOpacity>
            </View>
            <View style={[tw('w-full bg-gray-300 mb-2 mt-2'), {height: 2}]}></View>
        </View>
            {otherUser?.hasHost && (    
                <Text style={tw('text-2xl font-bold text-black mb-4 ml-4')}>Property's listing</Text>          
            )}
            {homes && otherUser && otherUser?.hasHost && (
                <FlatList
                    data={homes}
                    renderItem={handleRenderItem}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    snapToInterval={windownWith}
                    snapToAlignment={"center"}
                    decelerationRate={"fast"}
                />
            )}
        <View style={tw('w-full px-4 my-2')}>
            <View style={[tw('w-full bg-gray-300 mb-4 mt-4'), {height: 2}]}></View> 
            <Text style={tw('text-2xl font-bold text-black')}>{otherUser?.reviewNums} {otherUser?.reviewNums > 1 ? "Reviews": "Review"}</Text>
        </View>
            <View style={tw('flex-row w-full my-4')}>
                <Button onPress={showReviewsFromGuests} containerStyle={tw('w-1/2')} buttonStyle={tw(`bg-white  ${isGuests ? "border-b-4 border-gray-300" : ""}`)} titleStyle={tw('text-gray-500 text-lg font-bold')} title="From Guests"></Button>
                <Button onPress={showReviewsFromHosts} containerStyle={tw('w-1/2')}  buttonStyle={tw(`bg-white  ${isHosts ? "border-b-4 border-gray-300" : ""}`)}  titleStyle={tw('text-gray-500 text-lg font-bold')} title="From Hosts"></Button>
            </View>
            {isGuests && <HomeReviewUserProfile></HomeReviewUserProfile>}
            {isHosts && <TenantReviewUserProfile></TenantReviewUserProfile>}
        <View style={[tw('w-full bg-white mt-2'), {height: 4}]}></View>
    </ScrollView>
    
  )
}

export default UserProfileScreenAdmin

const styles = StyleSheet.create({})