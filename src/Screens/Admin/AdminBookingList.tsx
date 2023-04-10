import { Alert, Image, Keyboard, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useState, useLayoutEffect, useCallback } from 'react'
import { useTailwind } from 'tailwind-rn/dist'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from '@rneui/themed';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, CompositeNavigationProp, RouteProp, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootStackParamList } from '../../Navigators/MainStack';
import { HostBottomTabProps } from '../../Navigators/HostStack';
import { RootState } from '../../Store/store';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getHostByAuthUser } from '../../Store/Actions/HostAction';
import LoadingComponent from '../../Component/LoadingComponent';
import { AdminBottomTabProps } from '../../Navigators/AdminStack';
import AdminOldBookingScreen from './AdminOldBookingScreen';
import AdminUpcomingBookingScreen from './AdminUpcomingBookingScreen';


type AdminBookingListNavigationProp = CompositeNavigationProp<
NativeStackNavigationProp<RootStackParamList, "AdminBookingList">,
BottomTabNavigationProp<AdminBottomTabProps>>;

type AdminBookingListRouteProp = RouteProp<RootStackParamList, "AdminBookingList">;


const Tab = createMaterialTopTabNavigator();
const AdminBookingList = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const tw = useTailwind();
    const {users, otherUser, authUser, userError, userSuccess, message} = useSelector((state: RootState) => state.USERS);
    const dispatch = useDispatch();
    const navigation = useNavigation<AdminBookingListNavigationProp>();
    const {params} = useRoute<AdminBookingListRouteProp>();
    const {userId, homeId} = params;

    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => (
                <View style={tw('bg-white py-4 px-4 flex-row items-center')}>
                    <TouchableOpacity style={tw('mr-4')} onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={tw('text-2xl text-black')}>Bookings</Text>
                </View>
            )
        })
    }, [])

    const loadHost = useCallback(async () => {
        await dispatch(getHostByAuthUser() as any)
    }, [authUser, dispatch])
    
    useEffect(() => {
        setIsLoading(true)
        loadHost().then(() => setIsLoading(false))
    }, [dispatch, authUser])

    if(isLoading) {
        return <LoadingComponent/>
    }

  return (
    <View style={tw('bg-white flex-1')}>
       <Tab.Navigator
           screenOptions={{
            tabBarActiveTintColor: "gray",
            tabBarLabelStyle: {fontSize: 14, color: "gray", fontWeight: 'bold'},
            tabBarStyle: {marginTop: 0, paddingTop: 0}
            }}
            tabBarPosition='top'
            style={tw('flex-1')}
        >
            <Tab.Screen name="AdminUpcomingBookingScreen" children={() =>       <AdminUpcomingBookingScreen homeId={homeId} userId={userId}></AdminUpcomingBookingScreen>} options={{tabBarLabel: "Upcoming"}}/>

            <Tab.Screen name="AdminOldBookingScreen" children={() => <AdminOldBookingScreen ></AdminOldBookingScreen>} options={{tabBarLabel: "Checked out"}}/>
        </Tab.Navigator>
    </View>
  )
}

export default AdminBookingList

const styles = StyleSheet.create({})