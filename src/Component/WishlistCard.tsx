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
import { TouchableHighlight } from 'react-native';
import { TenantBottomTabProps } from '../Navigators/TenantStack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { addWishlistAction, deleteWishlistAction } from '../Store/Actions/WishlistAction';
import PagerView from 'react-native-pager-view';

type WishlistNavigationProp = CompositeNavigationProp<
BottomTabNavigationProp<TenantBottomTabProps, "WishListScreen">,
NativeStackNavigationProp<RootStackParamList>
>;

const WishlistCard = ({item}: {item: WISHLIST}) => {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [like, setLike] = useState<boolean>(true);
    const tw = useTailwind();
    const windownWith = useWindowDimensions().width - 40;
    const navigation = useNavigation<WishlistNavigationProp>();
    const dispatch = useDispatch();
    const {users, authUser, userError, userSuccess, message} = useSelector((state: RootState) => state.USERS);
    const {wishlist, wishlists, wishlistSuccess, wishlistError} = useSelector((state: RootState) => state.WISHLISTS);

    const handleRenderItem: ListRenderItem<any> = ({item}) => (
        <Image source={{uri: HOST_URL + "/api/images/image/" + item}} style={[tw('rounded-lg mb-2 mr-2'), {width: windownWith, height: 350, resizeMode: 'cover'}]}></Image>       
    )
    
    const onViewableItemsChanged = useRef(({viewableItems, changed}: {viewableItems: any, changed: any}) => {
            console.log(viewableItems[0])
            if(viewableItems.length > 0) {
                setActiveIndex(viewableItems[0].index)
            }
    })

    const likeHome = async () => {
        if(!like) {
            dispatch(addWishlistAction(item.homeResponse.id, authUser.id) as any);
        }else {
            dispatch(deleteWishlistAction(item.id) as any);
        }
        setLike(!like);
    }

    const navigateToHomeDetail = () => {
        navigation.navigate('DetailHomeScreen', {homeId: item.homeResponse.id});
    }

  return (
    <View>
      <View  style={tw('relative w-full my-2 px-4 items-center justify-center')}>
        <TouchableOpacity onPress={likeHome} style={[tw('absolute top-2 right-8'), {zIndex: 10}]}>
          {!like ? (
            <Entypo name="heart-outlined" size={28} color="white" />
          ): (
            <Entypo name="heart" size={28} color="red" />
          )}
        </TouchableOpacity>
        {/* <FlatList
          data={item?.homeResponse?.imgUrls}
          horizontal={true}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          snapToAlignment='center'
          decelerationRate='fast'
          snapToInterval={windownWith}
          viewabilityConfig={{
            viewAreaCoveragePercentThreshold: 50,
          }}
          onViewableItemsChanged={onViewableItemsChanged.current}
          keyExtractor={(item: string) => item}
          renderItem={item => handleRenderItem(item)}
          //   style={{width: useWindowDimensions().width, height:'100%'}}
          >
        </FlatList> */}
        <PagerView 
            style={[tw(' my-2'), { width: windownWith, height: 320}]} 
            initialPage={0}
            onPageSelected={(e) => {
              console.log(e.nativeEvent);
              setActiveIndex(e.nativeEvent.position);
            }}
          >
            {item?.homeResponse?.imgUrls?.map((item: string, index: number ) => (
                <Image key={index} source={{uri: HOST_URL + "/api/images/image/" + item}} style={[tw('rounded-lg mb-2 mr-2'), {width: windownWith, height: 300, resizeMode: 'cover'}]}></Image>  
            ))}
        </PagerView>
        <HomeCardDots arrayLength={item?.homeResponse?.imgUrls.length} activeIndex={activeIndex}></HomeCardDots>
        <Pressable onPress={navigateToHomeDetail} style={tw('w-full flex-row items-start justify-between mt-2')}>
          <View style={tw(' flex-1 items-start justify-start ml-2')}>
            <Text style={tw('text-lg font-bold text-zinc-700 mb-2')}>{item.homeResponse.title}</Text>
            <Text style={tw('text-lg text-zinc-500 mb-2')}>{item.homeResponse.address}, {item.homeResponse.zipcode} {item.homeResponse.city.name}, {item.homeResponse.country.name}</Text>
          </View>
          <View style={tw('flex-row items-center justify-start ml-2')}>
            <Entypo name="star" size={20} color="black" />
            <Text style={tw(' text-lg ml-2 text-black')}>4.83</Text>
            {/* {item.rating && <Text>{item.rating}</Text>} */}
          </View>
        </Pressable>
      </View>
  </View>
  )
}

export default WishlistCard

const styles = StyleSheet.create({})