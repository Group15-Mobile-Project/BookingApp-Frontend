import { FlatList, ListRenderItem, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useTailwind } from 'tailwind-rn/dist';
import { HOST_URL, RootState } from '../Store/store';
import { HOMEREVIEW } from '../Model';
import { Image } from 'react-native';

const imageDefault =[
  "wallpaper.jpg_a776d37b-97c9-4bd6-b4ca-1f342de06161",
  "Cabin-in-the-city-Best-Airbnbs-in-Ontario-819x1024.jpeg_89abc5d3-cd57-4fae-92ed-96bb77daf640",
  "dormir-dans-une-ferme-en-suède-best-airbnb-in-south-sweden-main.jpg_c83de24f-f4d0-4367-96ef-96d261a99e94"
]

const HomeReviewUserProfile = () => {
  const dispatch = useDispatch();
  const tw = useTailwind();
  const {reviews, reviewSuccess, reviewError} = useSelector((state: RootState) => state.HOMEREVIEWS);

  
  return (
    <View style={tw('bg-white w-full')}>
        {reviews && reviews.length > 0 && reviews.map((item: HOMEREVIEW) => (
          <View style={[tw(' py-2 px-2 mx-2 w-full')]} key={item.id}>
            <View style={tw('flex-row items-center justify-start')}>
                <Image source={{uri: HOST_URL + "/api/images/image/" + imageDefault[0]}} style={[tw('rounded-full mr-4'), {width: 40, height: 40, resizeMode: 'cover'}]}></Image>      
                <View style={tw(' items-start justify-start')}>
                    <Text style={tw(' text-lg text-black font-bold')}>{item.user.username}</Text>
                    <Text style={tw(' text-base text-gray-500 font-bold')}>{new Date(item.createDate).toLocaleString('en-us',{ month:'short', year:'numeric'})}</Text>
                </View>
            </View>
            <Text style={tw('mt-4 my-2 text-lg')}>{item.content}</Text>
        </View>
        ))}
    </View>
  )
}

export default HomeReviewUserProfile

const styles = StyleSheet.create({})