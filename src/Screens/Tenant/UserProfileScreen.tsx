import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { HOME, HOMEREVIEW } from '../../Model'
import { useTailwind } from 'tailwind-rn/dist'
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useWindowDimensions } from 'react-native';
import { HOST_URL } from '../../Store/store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootState } from '../../Store/store';
import { RootStackParamList } from '../../Navigators/MainStack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute, CompositeNavigationProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getHomesByHomeIdAction, getHomesByHostAction } from '../../Store/Actions/HomeAction';
import { ListRenderItem } from 'react-native';
import { FlatList } from 'react-native';
import HomeCardDots from '../../Component/HomeCardDots';
import { TouchableOpacity } from 'react-native';
import HomeDetailMap from '../../Component/HomeDetailMap';
import { getReviewsByHomeAction, getReviewsByHostAction } from '../../Store/Actions/HomeReviewAction';
import HomeDetailReviewCard from '../../Component/HomeDetailReviewCard';
import { getBookdatesByHomeAndCurrentTimeAction } from '../../Store/Actions/BookDateAction';
import { Button } from '@rneui/base';
import IncreaseDecreaseNumber from '../../Component/IncreaseDecreaseNumber';
import { HomesStackParamList } from '../../Navigators/HomesStack';
import { getUserByIdAction } from '../../Store/Actions/UserAction';
import UserProfileHomeCard from '../../Component/UserProfileHomeCard';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import HomeReviewUserProfile from '../../Component/HomeReviewUserProfile';
import TenantReviewUserProfile from '../../Component/TenantReviewUserProfile';
import { getTenantReviewsByTenant } from '../../Store/Actions/TenantReviewAction';


type UserProfileNavigationProp = CompositeNavigationProp<
NativeStackNavigationProp<RootStackParamList, "UserProfileScreen">,
NativeStackNavigationProp<HomesStackParamList>>;
type UserProfileProp = RouteProp<RootStackParamList, "UserProfileScreen">;

const imageDefault = [
    "wallpaper.jpg_a776d37b-97c9-4bd6-b4ca-1f342de06161",
    "Cabin-in-the-city-Best-Airbnbs-in-Ontario-819x1024.jpeg_89abc5d3-cd57-4fae-92ed-96bb77daf640",
    "dormir-dans-une-ferme-en-suède-best-airbnb-in-south-sweden-main.jpg_c83de24f-f4d0-4367-96ef-96d261a99e94"
];

const Tab = createMaterialTopTabNavigator();
const UserProfileScreen = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isGuests, setIsGuests]  = useState<boolean>(true);
    const [isHosts, setIsHosts]  = useState<boolean>(false);
    const navigation = useNavigation<UserProfileNavigationProp>() 
    const {params} = useRoute<UserProfileProp>();
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
        <UserProfileHomeCard  home={item}></UserProfileHomeCard>
    )
    const showReviewsFromGuests = () => {
        setIsHosts(false);
        setIsGuests(true);
    }
    const showReviewsFromHosts = () => {
        setIsHosts(true);
        setIsGuests(false);
    }

  return (
   
    <ScrollView style={tw('w-full bg-white')}>
      <View style={tw('w-full px-4 my-2')}>
        <Image source={{uri: HOST_URL + "/api/images/image/" + imageDefault[0]}} style={[tw(' mb-2 rounded-full'), {width: 100, height: 100, resizeMode: 'cover'}]}></Image>  
        <Text style={tw('text-2xl font-bold text-black mb-4')}>Hi, I'm {otherUser?.username}</Text>
        {otherUser?.hasHost && (
            <View style={tw('flex-row items-start justify-start w-full mb-2')}>
                <Entypo name='medal' color="#FF5A5F" size={24}></Entypo>
                <Text style={tw('text-lg text-black ml-4')}>SuperHost</Text>
            </View>
        )}
        <View style={tw('flex-row items-start justify-start w-full mb-2')}>
            <Entypo name='star' color="#FF5A5F" size={24}></Entypo>
            <Text style={tw('text-lg text-black ml-4')}>Identity verified</Text>
        </View>
        <View style={tw('flex-row items-start justify-start w-full mb-2')}>
            <MaterialCommunityIcons name='shield-check' color="#FF5A5F" size={24}></MaterialCommunityIcons>
            <Text style={tw('text-lg text-black ml-4')}>{otherUser?.reviewNums} {otherUser?.reviewNums > 1 ? "Reviews": "Review"}</Text>
        </View>
        <View style={[tw('w-full bg-gray-300 mt-2'), {height: 2}]}></View>
      </View>
      <View style={tw('w-full px-4 my-2')}> 
        <Text style={tw('text-2xl font-bold text-black mb-4')}>{otherUser?.username} confirmed</Text>
        <View style={tw('flex-row items-start justify-start w-full mb-2')}>
            <Entypo name='check' color="#FF5A5F" size={24}></Entypo>
            <Text style={tw('text-lg text-black ml-4')}>Identity </Text>
        </View>
        <View style={tw('flex-row items-start justify-start w-full mb-2')}>
            <Entypo name='check' color="#FF5A5F" size={24}></Entypo>
            <Text style={tw('text-lg text-black ml-4')}>Email address</Text>
        </View>
        <View style={[tw('w-full bg-gray-300 mt-2'), {height: 2}]}></View>
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

export default UserProfileScreen

const styles = StyleSheet.create({})