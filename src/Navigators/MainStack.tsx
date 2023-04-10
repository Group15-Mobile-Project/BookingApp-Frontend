import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../Screens/LoginScreen';
import SignUpScreen from '../Screens/SignUpScreen';
import ChangePassword from '../Screens/ChangePassword';
import RoleScreen from '../Screens/RoleScreen';
import MainHomes from '../Screens/Tenant/MainHomes';
import HomeSearchScreen from '../Screens/Tenant/HomeSearchScreen';
import SearchResultScreen from '../Screens/Tenant/SearchResultScreen';
import MapHomes from '../Screens/Tenant/MapHomes';
import DetailHomeScreen from '../Screens/Tenant/DetailHomeScreen';
import HomeReviewList from '../Screens/Tenant/HomeReviewList';
import BookingScreen from '../Screens/Tenant/BookingScreen';
import TenantStack from './TenantStack';
import MapWishlists from '../Screens/Tenant/MapWishlists';
import UserProfileScreen from '../Screens/Tenant/UserProfileScreen';
import ConfirmedBookingScreen from '../Screens/Tenant/ConfirmedBookingScreen';
import BookingsListScreen from '../Screens/Tenant/BookingsListScreen';
import ConversationScreen from '../Screens/Tenant/ConversationScreen';
import HostStack from './HostStack';
import HostDetailBookingScreen from '../Screens/Host/HostDetailBookingScreen';
import HostDetailedHome from '../Screens/Host/HostDetailedHome';
import UpdateHomeScreen from '../Screens/Host/UpdateHomeScreen';
import CreateHomeScreen from '../Screens/Host/CreateHomeScreen';
import DiscountForm from '../Screens/Host/DiscountForm';
import UpdateBookingScreen from '../Screens/Tenant/UpdateBookingScreen';
import UpdateProfileScreen from '../Screens/Tenant/UpdateProfileScreen';
import AdminStack from './AdminStack';
import { useSelector } from 'react-redux';
import { RootState } from '../Store/store';
import AdminDetailedHome from '../Screens/Admin/AdminDetailedHome';
import AdminHomeSearchScreen from '../Screens/Admin/AdminHomeSearchScreen';
import UserProfileScreenAdmin from '../Screens/Admin/UserProfileScreenAdmin';
import AdminBookingList from '../Screens/Admin/AdminBookingList';
import AdminOldBookingScreen from '../Screens/Admin/AdminOldBookingScreen';
import AdminUpcomingBookingScreen from '../Screens/Admin/AdminUpcomingBookingScreen';
import DetailBookingScreenAdmin from '../Screens/Admin/DetailBookingScreenAdmin';

export type RootStackParamList = {
    Login: undefined,
    SignUp: undefined,
    ChangePassword: undefined,
    RoleScreen: undefined,
    HomeSearchScreen: undefined,
    MapHomes: undefined,
    MapWishlists: undefined,
    DetailHomeScreen: {
      homeId: number
    },
    HomeReviewList: {
      homeId: number
    },
    BookingScreen: {
      homeId: number,
      checkIn: string,
      checkOut: string,
      capacity: number
    },
    ConfirmedBookingScreen: {
      bookingId: number
    },
    UserProfileScreen: {
      userId: number
    },
    TenantStack: undefined,
    BookingsListScreen: undefined,
    ConversationScreen: {
      chatId?: number,
      receiverId?: number
    },
    HostStack: undefined,
    HostDetailBookingScreen: {
      bookingId: number
    },
    HostDetailedHome: {
      homeId: number
    },
    UpdateHomeScreen: {
      homeId: number
    },
    CreateHomeScreen: undefined,
    DiscountForm: {
      homeId: number,
      discountId?: number
    },
    UpdateBookingScreen: {
      bookingId: number,
      homeId: number
    },
    UpdateProfileScreen: undefined,
    AdminStack: undefined,
    AdminDetailedHome: {
      homeId: number
    },
    AdminHomeSearchScreen: {
      categoryId?: number,
      city?: string
    },
    UserProfileScreenAdmin: {
      userId: number
    },
    AdminBookingList: {
      homeId?: number,
      userId?: number
    },
    DetailBookingScreenAdmin: {
      bookingId: number
    },
};
const stack = createNativeStackNavigator<RootStackParamList>();

const MainStack = () => {

  const {users, authUser, userSuccess, userError, message} = useSelector((state: RootState) => state.USERS)

  return (
    <stack.Navigator >
        <stack.Screen component={LoginScreen} options={{headerShown: false}} name="Login"></stack.Screen>
        <stack.Screen component={SignUpScreen} options={{headerShown: false}} name="SignUp"></stack.Screen>
        <stack.Screen component={ChangePassword} options={{title: "back"}} name="ChangePassword"></stack.Screen>
        <stack.Screen component={RoleScreen} options={{headerShown: false}} name="RoleScreen"></stack.Screen>
        <stack.Screen component={HomeSearchScreen}  options={{headerShown: false}} name="HomeSearchScreen"></stack.Screen>
        <stack.Screen component={MapHomes} options={{title: "Back"}} name="MapHomes"></stack.Screen>
        <stack.Screen component={MapWishlists} options={{title: "Back"}} name="MapWishlists"></stack.Screen>
        <stack.Screen component={DetailHomeScreen} options={{headerShown: false}} name="DetailHomeScreen"></stack.Screen>
        <stack.Screen component={HomeReviewList} options={{title: "back"}} name="HomeReviewList"></stack.Screen>
        <stack.Screen component={BookingScreen} options={{title: "confirm"}} name="BookingScreen"></stack.Screen>
        <stack.Screen component={ConfirmedBookingScreen} name="ConfirmedBookingScreen"></stack.Screen>
        <stack.Screen component={UserProfileScreen}   options={{title: "Back"}} name="UserProfileScreen"></stack.Screen>
        <stack.Screen component={BookingsListScreen}   options={{title: "List of Bookings"}} name="BookingsListScreen"></stack.Screen>
        <stack.Screen component={ConversationScreen}  name="ConversationScreen"></stack.Screen>
        <stack.Screen component={TenantStack} options={{headerShown: false}} name="TenantStack"></stack.Screen>
        <stack.Screen component={HostStack} options={{headerShown: false}} name="HostStack"></stack.Screen>
        <stack.Screen component={HostDetailBookingScreen} name="HostDetailBookingScreen"></stack.Screen>
        <stack.Screen component={HostDetailedHome} options={{headerShown: false}} name="HostDetailedHome"></stack.Screen>
        <stack.Screen component={UpdateHomeScreen} options={{title: "Update Home"}} name="UpdateHomeScreen"></stack.Screen>
        <stack.Screen component={CreateHomeScreen} options={{title: "New Home"}} name="CreateHomeScreen"></stack.Screen>
        <stack.Screen component={DiscountForm} options={{title: "Discount Form"}} name="DiscountForm"></stack.Screen>
        <stack.Screen component={UpdateBookingScreen} options={{title: "Update booking"}} name="UpdateBookingScreen"></stack.Screen>
        <stack.Screen component={UpdateProfileScreen} options={{title: "Update profile"}} name="UpdateProfileScreen"></stack.Screen>
        {authUser && authUser?.roles?.includes("ADMIN") && (
            <>
              <stack.Screen component={AdminStack} options={{headerShown: false}} name="AdminStack"></stack.Screen>
              <stack.Screen component={AdminDetailedHome} options={{headerShown: false}} name="AdminDetailedHome"></stack.Screen>
              <stack.Screen component={AdminHomeSearchScreen} options={{headerShown: false}} name="AdminHomeSearchScreen"></stack.Screen>
              <stack.Screen component={UserProfileScreenAdmin} options={{headerShown: false}} name="UserProfileScreenAdmin"></stack.Screen>
              <stack.Screen component={AdminBookingList} options={{title: "Bookings"}} name="AdminBookingList"></stack.Screen>
              <stack.Screen component={DetailBookingScreenAdmin} name="DetailBookingScreenAdmin"></stack.Screen>
            </>
        )}
    </stack.Navigator>
  )
}

export default MainStack

const styles = StyleSheet.create({})