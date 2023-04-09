import { Alert, Image, Keyboard, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, ListRenderItem, FlatList } from 'react-native'
import React, { useEffect, useState, useLayoutEffect, useCallback } from 'react'
import { useTailwind } from 'tailwind-rn/dist'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from '@rneui/themed';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootStackParamList } from '../../Navigators/MainStack';
import { HostBottomTabProps } from '../../Navigators/HostStack';
import { HOST_URL, RootState } from '../../Store/store';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { getHostByAuthUser } from '../../Store/Actions/HostAction';
import LoadingComponent from '../../Component/LoadingComponent';
import { AdminBottomTabProps } from '../../Navigators/AdminStack';
import { getCitiesAction } from '../../Store/Actions/CityAction';
import { getCountriesAction } from '../../Store/Actions/CountryAction';
import { CATEGORY, CITY, COUNTRY, USER } from '../../Model';
import { getCategoriesAction } from '../../Store/Actions/CategoryAction';
import HomeCategoryCard from '../../Component/HomeCategoryCard';
import { getAllUsersForAdminAction } from '../../Store/Actions/UserAction';

type CategoryScreenNavigationProp = CompositeNavigationProp<
BottomTabNavigationProp<AdminBottomTabProps, "UsersListScreen">,
NativeStackNavigationProp<RootStackParamList>>;

const UsersListScreen = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [query, setQuery] = useState<string>("");
    const tw = useTailwind()
    const dispatch = useDispatch()
    const navigation = useNavigation<CategoryScreenNavigationProp>()
    const {users, authUser, userError, userSuccess, message} = useSelector((state: RootState) => state.USERS)
    const {category, categories, categorySuccess, categoryError} = useSelector((state: RootState) => state.CATEGORIES);
  
    const handleGetUsers = useCallback(async () => {
      setIsRefreshing(true);
      await dispatch(getAllUsersForAdminAction() as any);
      setIsRefreshing(false);
    }, [ dispatch]);
  
    useEffect(() => {
      setIsLoading(true)
      handleGetUsers().then(() => setIsLoading(false));
    }, [dispatch])
  
    const handleRenderUser: ListRenderItem<any> = ({item}: {item: USER}) => (
      <TouchableOpacity onPress={() => navigation.navigate("UserProfileScreenAdmin", {userId: item.id})} style={tw('my-2 w-full flex-row mx-auto rounded-2xl border border-gray-200 items-center justify-between')}>
        <Image source={{uri: HOST_URL + "/api/images/image/" + item.imgUrls}} style={[tw('rounded-lg'), {width: 100, height: 140, resizeMode: 'cover'}]}></Image> 
        <View style={tw('flex-1 items-start justify-center px-6 py-2')}>
            <View style={tw('flex-row mb-2')}>
                <Text style={tw("text-gray-400 text-lg")}>Username: </Text>
                <Text style={tw("text-black text-lg")}>{item.username}</Text>
            </View>
            <View style={tw('flex-row mb-2')}>
                <Text style={tw("text-gray-400 text-lg")}>Email: </Text>
                <Text style={tw("text-black text-lg")}>{item.email}</Text>
            </View>
            {/* {item.hasHost && (
                <View style={tw('flex-row mb-2')}>
                    <Text style={tw("text-gray-400 text-lg")}>Host: </Text>
                    <Text style={tw("text-black text-lg")}>Active host</Text>
                </View>
            )} */}
            {item.rating && (
                <View style={tw('flex-row mb-2')}>
                    <Text style={tw("text-gray-400 text-lg")}>Rating: </Text>
                    <Text style={tw("text-black text-lg")}>{item?.rating}</Text>
                </View>
            )}
        </View>  
      </TouchableOpacity>
    )
  
    if(isLoading) {
      return <LoadingComponent/>
    }
  
    return (
    <KeyboardAvoidingView style={tw('flex-1')}>
        <TouchableWithoutFeedback style={tw('flex-1')} onPress={Keyboard.dismiss}>
            <SafeAreaView style={tw('flex-1 bg-white relative')}> 
                <View style={[tw('relative px-2 mt-2 mb-4')]}>
                    <TextInput value={query} onChangeText={(text: string) => setQuery(text)} style={tw('text-black rounded-full py-2 text-lg pl-12 bg-gray-100 text-black')} placeholder="Search by title" ></TextInput>
                    <TouchableOpacity  style={tw('mx-2 absolute top-2 left-2')}>
                        <Entypo name="magnifying-glass" size={28} color="black" />
                    </TouchableOpacity>
                </View>
                <FlatList
                    refreshing={isRefreshing}
                    onRefresh={handleGetUsers}
                    data={query && query.length > 0 ? users.filter((ho: USER) => ho.username.toLowerCase().includes(query.toLowerCase()) || ho.email.toLowerCase().includes(query.toLowerCase())) : users}
                    keyExtractor={(item: any) => item.id}
                    renderItem={handleRenderUser}
                    showsVerticalScrollIndicator={false}
                    style={tw('px-4')}
                    >
                </FlatList>
            </SafeAreaView>
        </TouchableWithoutFeedback>
   </KeyboardAvoidingView>
    )
}

export default UsersListScreen

const styles = StyleSheet.create({})