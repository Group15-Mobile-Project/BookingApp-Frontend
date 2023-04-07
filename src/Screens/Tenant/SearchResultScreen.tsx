import { FlatList, Keyboard, KeyboardAvoidingView, ListRenderItem, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, useWindowDimensions, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useTailwind } from 'tailwind-rn/dist'
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootState } from '../../Store/store';
import { RootStackParamList } from '../../Navigators/MainStack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute, CompositeNavigationProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getHomesBySearchQueryAction } from '../../Store/Actions/HomeAction';
import HomeCardMain from '../../Component/HomeCardMain';
import { HOME } from '../../Model';
import Entypo from 'react-native-vector-icons/Entypo'
import { HomesStackParamList } from '../../Navigators/HomesStack';
import LoadingComponent from '../../Component/LoadingComponent';


type SearchResultNavigationProp = CompositeNavigationProp<
NativeStackNavigationProp<HomesStackParamList, "SearchResultScreen">,
NativeStackNavigationProp<RootStackParamList>>;

type SearchResultRouteProp = RouteProp<HomesStackParamList, "SearchResultScreen">

const SearchResultScreen = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const tw = useTailwind()
    const dispatch = useDispatch()
    const {homes, homeSuccess, homeError} = useSelector((state: RootState) => state.HOMES)
    const navigation = useNavigation<SearchResultNavigationProp>(); 
    const {params} = useRoute<SearchResultRouteProp>()
    const {capacity, checkIn, checkOut, citySearch} = params;
    const windownWith = useWindowDimensions().width;

    const loadHomesBySearchQuery = useCallback(async () => {
        setIsRefreshing(true);
        await dispatch(getHomesBySearchQueryAction(citySearch, checkIn, checkOut, capacity) as any);
        setIsRefreshing(false)
    }, [capacity, checkIn, checkOut, citySearch])

    useEffect(() => {
        setIsLoading(true)
        loadHomesBySearchQuery().then(() => setIsLoading(false))
    }, [capacity, checkIn, checkOut, citySearch])

    const handleRenderItem: ListRenderItem<any> = ({item}: {item: HOME}) => (
        <HomeCardMain item={item}></HomeCardMain>
    )
    const navigateToMapHome = () => {
        navigation.navigate('MapHomes')
    }

    if(isLoading) {
        return <LoadingComponent/>
    }
  return (
    <SafeAreaView style={tw('flex-1 bg-white relative')}>
        <FlatList
            refreshing={isRefreshing}
            onRefresh={loadHomesBySearchQuery}
            data={homes}
            keyExtractor={(item: any) => item.id}
            renderItem={handleRenderItem}
            showsVerticalScrollIndicator={false}
        >
        </FlatList>
        <TouchableOpacity onPress={navigateToMapHome}  style={[tw('mx-2 absolute bottom-4 bg-white p-2 rounded-full'), {zIndex: 10, left: windownWith/2 - 30}]}>
            <Entypo name="map" size={28} color="black" />
        </TouchableOpacity>
    </SafeAreaView>
  )
}

export default SearchResultScreen

const styles = StyleSheet.create({})