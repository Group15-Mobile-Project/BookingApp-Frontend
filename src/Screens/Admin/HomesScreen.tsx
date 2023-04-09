import { Alert, FlatList, Image, Keyboard, KeyboardAvoidingView, ListRenderItem, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useTailwind } from 'tailwind-rn/dist'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from '@rneui/themed';
import { useDispatch, useSelector } from 'react-redux';
import {  ResetUser, updateToHostAction } from '../../Store/Actions/UserAction';
import { RootState } from '../../Store/store';
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../Navigators/MainStack';
import { CATEGORY, HOME } from '../../Model';
import HomeCardMain from '../../Component/HomeCardMain';
import { getHomesAction, getHomesByCategoryAction } from '../../Store/Actions/HomeAction';
import { getCategoriesAction } from '../../Store/Actions/CategoryAction';
import HomeCategoryCard from '../../Component/HomeCategoryCard';
import Entypo from 'react-native-vector-icons/Entypo';
import { useWindowDimensions } from 'react-native';
import { HomesStackParamList } from '../../Navigators/HomesStack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { getWishlistByAuthUserAction } from '../../Store/Actions/WishlistAction';
import LoadingComponent from '../../Component/LoadingComponent';
import { AdminBottomTabProps } from '../../Navigators/AdminStack';
import AdminHomeCardMain from '../../Component/AdminHomeCardMain';

type HomesScreenNavigationProp = CompositeNavigationProp<
BottomTabNavigationProp<AdminBottomTabProps, "HomesScreen">,
NativeStackNavigationProp<RootStackParamList>>;


const HomesScreen = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [query, setQuery] = useState<string>("");
    const tw = useTailwind();
    const {users, authUser, userError, userSuccess, message} = useSelector((state: RootState) => state.USERS);
    const {homes, homeSuccess, homeError} = useSelector((state: RootState) => state.HOMES);
    const dispatch = useDispatch();
    const navigation = useNavigation<HomesScreenNavigationProp>();
    const windownWith = useWindowDimensions().width;

    const handleGetHomes = useCallback(async () => {
        setIsRefreshing(true);
        await dispatch(getHomesAction() as any);
        setIsRefreshing(false);
    }, [ dispatch]);

    useEffect(() => {
        setIsLoading(true)
        handleGetHomes().then(() => setIsLoading(false))
    }, [ dispatch])

    useEffect(() => {
        if(query && query.length > 0) {
            console.log(query);
        }
    }, [query])

    const handleRenderItem: ListRenderItem<any> = ({item}: {item: HOME}) => (
        <AdminHomeCardMain item={item}></AdminHomeCardMain>
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
                    onRefresh={handleGetHomes}
                    data={query && query.length > 0 ? homes.filter((ho: HOME) => ho.title.toLowerCase().includes(query.toLowerCase())) : homes}
                    keyExtractor={(item: any) => item.id}
                    renderItem={handleRenderItem}
                    showsVerticalScrollIndicator={false}
                    >
                </FlatList>
            </SafeAreaView>
        </TouchableWithoutFeedback>
   </KeyboardAvoidingView>
  )
}

export default HomesScreen

const styles = StyleSheet.create({})