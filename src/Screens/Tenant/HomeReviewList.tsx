import { FlatList, Image, Keyboard, KeyboardAvoidingView, ListRenderItem, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, useWindowDimensions, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useTailwind } from 'tailwind-rn/dist'
import { useDispatch, useSelector } from 'react-redux'
import { HOST_URL, RootState } from '../../Store/store'
import { RouteProp, useNavigation, useRoute, CompositeNavigationProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../Navigators/MainStack'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getReviewsByHomeAction, getReviewsByHomeAndQueryAction } from '../../Store/Actions/HomeReviewAction'
import { getHomesByHomeIdAction } from '../../Store/Actions/HomeAction'
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { HOMEREVIEW } from '../../Model'
import { HomesStackParamList } from '../../Navigators/HomesStack'
import LoadingComponent from '../../Component/LoadingComponent'

const imageDefault =[
    "wallpaper.jpg_a776d37b-97c9-4bd6-b4ca-1f342de06161",
    "Cabin-in-the-city-Best-Airbnbs-in-Ontario-819x1024.jpeg_89abc5d3-cd57-4fae-92ed-96bb77daf640",
    "dormir-dans-une-ferme-en-suède-best-airbnb-in-south-sweden-main.jpg_c83de24f-f4d0-4367-96ef-96d261a99e94"
  ]
type DetailHomeProp = RouteProp<RootStackParamList, "HomeReviewList">;
type DetailHomeNavigationProp = CompositeNavigationProp<
NativeStackNavigationProp<RootStackParamList, "HomeReviewList">,
NativeStackNavigationProp<HomesStackParamList>>;

const HomeReviewList = () => {
    const [query, setQuery] = useState<string>("");
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const tw = useTailwind()
    const windownWith = useWindowDimensions().width;
    const {reviews, reviewSuccess, reviewError} = useSelector((state: RootState) => state.HOMEREVIEWS);
    const {home, homeSuccess, homeError} = useSelector((state: RootState) => state.HOMES);
    const navigation = useNavigation<DetailHomeNavigationProp>() 
    const {params} = useRoute<DetailHomeProp>();
    const {homeId}= params;
    const dispatch = useDispatch();

    const loadHome = useCallback(async () => {
        if(homeId) {
            await dispatch(getHomesByHomeIdAction(homeId) as any)
        }
    }, [homeId, dispatch])

    const loadHomeReviewsByHome = useCallback(async () => {
        if(homeId) {
            setIsRefreshing(true);
            await dispatch(getReviewsByHomeAction(homeId) as any);
            setIsRefreshing(false);
        }
    }, [homeId, dispatch])
    
    useEffect(() =>{
        setIsLoading(true);
        loadHome().then(() => loadHomeReviewsByHome()).then(() => setIsLoading(false));
    }, [homeId, dispatch])

    const handleReviewItem: ListRenderItem<any> = ({item}: {item: HOMEREVIEW}) => (
        <View style={[tw(' py-2 px-2 mx-2 w-full')]}>
            <View style={tw('flex-row items-center justify-start')}>
                <Image source={{uri: HOST_URL + "/api/images/image/" + imageDefault[0]}} style={[tw('rounded-full mr-4'), {width: 40, height: 40, resizeMode: 'cover'}]}></Image>      
                <View style={tw(' items-start justify-start')}>
                    <Text style={tw(' text-lg text-black font-bold')}>{item.user.username}</Text>
                    <Text style={tw(' text-base text-gray-500 font-bold')}>{new Date(item.createDate).toLocaleString('en-us',{ month:'short', year:'numeric'})}</Text>
                </View>
            </View>
            <Text style={tw('mt-4 my-2 text-lg')}>{item.content}</Text>
        </View>
    )

    const getHomeReviewByQuery = useCallback( async () => {
        if(query) {
            await dispatch(getReviewsByHomeAndQueryAction(homeId, query.toLowerCase()) as any);
        } else {
            loadHomeReviewsByHome()
        }
        
    }, [query, dispatch, homeId])
    useEffect(() => {
        setIsLoading(true);
        getHomeReviewByQuery().then(() => setIsLoading(false));
    }, [dispatch, query, homeId])

    if(isLoading) {
        return <LoadingComponent/>
    }
  return (
    <KeyboardAvoidingView style={tw('flex-1')}>
        <TouchableWithoutFeedback style={tw('flex-1')} onPress={Keyboard.dismiss}>
            <SafeAreaView style={tw('flex-1 px-2')}>
                {home && (
                    <View style={tw('flex-row items-start justify-start w-full ml-2 mb-4 mt-4')}>
                        <Entypo name="star" size={28} color="black" />
                        <Text style={tw('text-3xl ml-2 text-black font-bold')}>{home?.rating && (Math.round(home?.rating * 100) / 100).toFixed(2)} -</Text>
                        {home?.reviewNums && 
                        <Text style={[tw('text-3xl ml-2 text-black font-bold')]}>{home?.reviewNums} {home?.reviewNums > 1 ? "reviews" : "review"}</Text>
                        }
                    </View>
                )}
                <View style={[tw('relative w-full my-2 px-2')]}>
                    <TextInput style={tw('rounded-full border border-gray-400 py-2 text-lg pl-12 bg-white text-black')} placeholder='search cities' value={query} onChangeText={(text: string) =>setQuery(text)}></TextInput>
                    <TouchableOpacity  style={tw('mx-2 absolute top-2 left-2')}>
                        <Entypo name="magnifying-glass" size={28} color="black" />
                    </TouchableOpacity>
                </View>
                {reviews && reviews.length > 0 && (
                     <FlatList
                     refreshing={isRefreshing}
                     onRefresh={loadHomeReviewsByHome}
                     data={reviews}
                     keyExtractor={(item: any) => item.id}
                     renderItem={handleReviewItem}
                     showsVerticalScrollIndicator={false}
                     style={tw('mt-4 w-full')}
                     >
                     </FlatList>
                )}
            </SafeAreaView>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default HomeReviewList

const styles = StyleSheet.create({})