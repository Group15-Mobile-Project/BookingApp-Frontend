import { FlatList, Keyboard, KeyboardAvoidingView, ListRenderItem, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useTailwind } from 'tailwind-rn/dist'
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootState } from '../Store/store';
import { RootStackParamList } from '../Navigators/MainStack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getHomesBySearchQueryAction } from '../Store/Actions/HomeAction';
import HomeCardMain from '../Component/HomeCardMain';
import { HOME } from '../Model';

type SearchResultRouteProp = RouteProp<RootStackParamList, "SearchResultScreen">

const SearchResultScreen = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const tw = useTailwind()
    const dispatch = useDispatch()
    const {homes, homeSuccess, homeError} = useSelector((state: RootState) => state.HOMES)
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>() 
    const {params} = useRoute<SearchResultRouteProp>()
    const {capacity, checkIn, checkOut, citySearch} = params;

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
  return (
    <SafeAreaView style={tw('flex-1 bg-white')}>
        <FlatList
            refreshing={isRefreshing}
            onRefresh={loadHomesBySearchQuery}
            data={homes}
            keyExtractor={(item: any) => item.id}
            renderItem={handleRenderItem}
            showsVerticalScrollIndicator={false}
        >
        </FlatList>
    </SafeAreaView>
  )
}

export default SearchResultScreen

const styles = StyleSheet.create({})