import { FlatList, Image, ListRenderItem, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { HOME, WISHLIST } from '../Model'
import { useTailwind } from 'tailwind-rn/dist'
import Entypo from 'react-native-vector-icons/Entypo';
import { useWindowDimensions } from 'react-native';
import { HOST_URL, RootState } from '../Store/store';
import HomeCardDots from './HomeCardDots';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigators/MainStack';
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { HomesStackParamList } from '../Navigators/HomesStack';
import { useDispatch, useSelector } from 'react-redux';
import { addWishlistAction, deleteWishlistAction } from '../Store/Actions/WishlistAction';
import { HostHomeListingNavigationProp } from '../Screens/Host/HostHomeListingScreen';
import AntDesign from 'react-native-vector-icons/AntDesign';


const imageDefault =[
  "wallpaper.jpg_a776d37b-97c9-4bd6-b4ca-1f342de06161",
  "Cabin-in-the-city-Best-Airbnbs-in-Ontario-819x1024.jpeg_89abc5d3-cd57-4fae-92ed-96bb77daf640",
  "dormir-dans-une-ferme-en-suède-best-airbnb-in-south-sweden-main.jpg_c83de24f-f4d0-4367-96ef-96d261a99e94"
]



const HostHomeCard = ({item}: {item: HOME}) => {
    const [activeIndex, setActiveIndex] = useState<number>(0)
    const [like, setLike] = useState<boolean>(false);
    const [wishli, setWishli] = useState<WISHLIST  | null>(null);
    const tw = useTailwind()
    const windownWith = useWindowDimensions().width - 40;
    const navigation = useNavigation<HostHomeListingNavigationProp>();
    const {users, authUser, userError, userSuccess, message} = useSelector((state: RootState) => state.USERS);
    const dispatch = useDispatch();
  
    const handleRenderItem: ListRenderItem<any> = ({item}) => (
      <Image source={{uri: HOST_URL + "/api/images/image/" + item}} style={[tw('rounded-lg mb-2 mr-2'), {width: windownWith, height: 300, resizeMode: 'cover'}]}></Image>       
  )
  
    const onViewableItemsChanged = useRef(({viewableItems, changed}: {viewableItems: any, changed: any}) => {
          console.log(viewableItems[0])
          if(viewableItems.length > 0) {
              setActiveIndex(viewableItems[0].index)
          }
    })
  
    return (
        <Pressable onPress={() => navigation.navigate('HostDetailedHome', {homeId: item.id})} style={[tw('relative w-full my-2 py-2 px-4 items-center justify-center flex-row bg-white'), styles.shadow]}>
            <Image source={{uri: HOST_URL + "/api/images/image/" + item?.imgUrls[0]}} style={[tw('rounded-lg mb-2 mr-2'), {width: 100, height: 100, resizeMode: 'cover'}]}/>
            <View style={tw(' flex-1 items-start justify-start')}>
                <View style={tw(' flex-1 items-start justify-start ml-2')}>
                    <Text style={tw('text-lg font-bold text-zinc-700')}>{item.title}</Text>
                    <Text style={tw('text-lg text-zinc-500')}>{item.address}, {item.zipcode} {item.city.name}, {item.country.name}</Text>
                </View>
                <View style={tw('flex-row items-center justify-start ml-2')}>
                    <Entypo name="star" size={20} color="black" />
                    <Text style={tw(' text-lg ml-2 text-black')}>4.83</Text>
                    {/* {item.rating && <Text>{item.rating}</Text>} */}
                </View>
            </View>
            <View style={tw('ml-2')}>
                <AntDesign name="right" size={24} color="black" /> 
            </View>
        </Pressable>
    )
}

export default HostHomeCard

const styles = StyleSheet.create({
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        
        elevation: 5,
    }
})