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

type MainHomeNavigationProp = CompositeNavigationProp<
NativeStackNavigationProp<HomesStackParamList, "MainHomes">,
NativeStackNavigationProp<RootStackParamList>
>;

const MainHomes = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [categoryIndex, setCategoryIndex] = useState<number>(1);
    const tw = useTailwind();
    const {users, authUser, userError, userSuccess, message} = useSelector((state: RootState) => state.USERS);
    const {homes, homeSuccess, homeError} = useSelector((state: RootState) => state.HOMES);
    const {category, categories, categorySuccess, categoryError} = useSelector((state: RootState) => state.CATEGORIES);
    const {wishlist, wishlists, wishlistSuccess, wishlistError} = useSelector((state: RootState) => state.WISHLISTS);
    const dispatch = useDispatch();
    const navigation = useNavigation<MainHomeNavigationProp>();
    const windownWith = useWindowDimensions().width;

    const handleGetHomes = useCallback(async () => {
        setIsRefreshing(true);
        await dispatch(getHomesByCategoryAction(categoryIndex) as any);
        setIsRefreshing(false);
    }, [ dispatch, categoryIndex]);

    const handleGetCategories = useCallback(async () => {
        setIsRefreshing(true);
        await dispatch(getCategoriesAction() as any);
        setIsRefreshing(false);
    }, [ dispatch]);

    const loadWishlist = useCallback(async () => {
        setIsRefreshing(true);
        await dispatch(getWishlistByAuthUserAction() as any);
        setIsRefreshing(false);
    }, [authUser, dispatch])

    useEffect(() => {
        // setIsLoading(true)
        // handleGetCategories().then(() => setIsLoading(false));
        handleGetCategories()
    }, [dispatch])
    
    useEffect(() => {
        setIsLoading(true)
        handleGetHomes().then(() => loadWishlist()).then(() => setIsLoading(false))
    }, [categoryIndex, dispatch])
    
    const handleRenderItem: ListRenderItem<any> = ({item}: {item: HOME}) => (
        <HomeCardMain item={item}></HomeCardMain>
    )
    const handleRenderCategory: ListRenderItem<any> = ({item}: {item: CATEGORY}) => (
        <HomeCategoryCard categoryIndex={categoryIndex} setCategoryIndex={setCategoryIndex} item={item}></HomeCategoryCard>
    )
    const navigateToSearchScreen = () => {
        navigation.navigate('HomeSearchScreen');
    }

    const navigateToMapHome = () => {
        navigation.navigate("MapHomes");
    }

    if(isLoading) {
        return <LoadingComponent/>
    }

  return (
//    <KeyboardAvoidingView style={tw('flex-1')}>
//     <TouchableWithoutFeedback style={tw('flex-1')} onPress={Keyboard.dismiss}>
        <SafeAreaView style={tw('flex-1 bg-white relative')}> 
            <View style={[tw('relative px-2 mt-2')]}>
                <Button onPress={navigateToSearchScreen}  buttonStyle={tw('rounded-full py-2 text-lg pl-12 bg-gray-100 text-black')} title="Search" titleStyle={tw('text-black')}></Button>
                <TouchableOpacity  style={tw('mx-2 absolute top-2 left-2')}>
                    <Entypo name="magnifying-glass" size={28} color="black" />
                </TouchableOpacity>
            </View>
            <View style={tw('px-2')}>
                <FlatList
                    refreshing={isRefreshing}
                    onRefresh={handleGetCategories}
                    data={categories}
                    keyExtractor={(item: any) => item.id}
                    renderItem={handleRenderCategory}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    >
                </FlatList>
            </View>
            <FlatList
                refreshing={isRefreshing}
                onRefresh={handleGetHomes}
                data={homes}
                keyExtractor={(item: any) => item.id}
                renderItem={handleRenderItem}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
                >
            </FlatList>
            <TouchableOpacity onPress={navigateToMapHome}  style={[tw('mx-2 absolute bottom-4 bg-white p-2 rounded-full'), {zIndex: 10, left: windownWith/2 - 30}]}>
                <Entypo name="map" size={28} color="black" />
            </TouchableOpacity>
        </SafeAreaView>
//     </TouchableWithoutFeedback>
//    </KeyboardAvoidingView>
  )
}

export default MainHomes

const styles = StyleSheet.create({})