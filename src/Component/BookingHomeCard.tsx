import { FlatList, Image, ListRenderItem, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import { HOME } from '../Model'
import { useTailwind } from 'tailwind-rn/dist'
import Entypo from 'react-native-vector-icons/Entypo';
import { useWindowDimensions } from 'react-native';
import { HOST_URL } from '../Store/store';
import HomeCardDots from './HomeCardDots';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigators/MainStack';
import { useNavigation } from '@react-navigation/native';

const imageDefault =[
    "wallpaper.jpg_a776d37b-97c9-4bd6-b4ca-1f342de06161",
    "Cabin-in-the-city-Best-Airbnbs-in-Ontario-819x1024.jpeg_89abc5d3-cd57-4fae-92ed-96bb77daf640",
    "dormir-dans-une-ferme-en-suède-best-airbnb-in-south-sweden-main.jpg_c83de24f-f4d0-4367-96ef-96d261a99e94"
  ]

const BookingHomeCard = ({item}: {item: HOME}) => {
    const [activeIndex, setActiveIndex] = useState<number>(0)
    const [like, setLike] = useState<boolean>(false)  
    const tw = useTailwind()
    const windownWith = useWindowDimensions().width - 40;
    // const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
    const likeHome = async () => {
      setLike(!like)
    }
  
    return (
      <View style={tw('w-full flex-row py-2 px-4 items-start justify-start my-4')}>
        <Image source={{uri: HOST_URL + "/api/images/image/" + imageDefault[0]}} style={[tw('rounded-lg mb-2'), {width: 140, height: 130, resizeMode: 'cover'}]}></Image>  
        <View style={tw('flex-1 items-start justify-start pl-4')}>
            <Text style={tw('text-lg font-bold text-zinc-700 mb-2')}>{item.title}</Text>
            <Text style={tw('text-lg text-zinc-500 mb-2')}>{item.address}, {item.zipcode} {item.city.name}, {item.country.name}</Text> 
             <View style={tw('flex-row items-center justify-center')}>
                <Text style={tw('text-lg font-bold text-zinc-700 mr-8')}>£{item.price} night</Text>   
                <Entypo name="star" size={20} color="black" />
                <Text style={tw(' text-lg ml-2 text-black')}>4.83</Text>
                {/* {item.rating && <Text>{item.rating}</Text>} */}
            </View>
        </View>
      </View>
    )
}

export default BookingHomeCard

const styles = StyleSheet.create({})