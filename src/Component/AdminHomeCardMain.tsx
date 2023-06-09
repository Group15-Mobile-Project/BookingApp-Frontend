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
import { AdminBottomTabProps } from '../Navigators/AdminStack';

type MainHomeNavigationProp = CompositeNavigationProp<
NativeStackNavigationProp<AdminBottomTabProps, "HomesScreen">,
NativeStackNavigationProp<RootStackParamList>
>;
const AdminHomeCardMain = ({item}: {item: HOME}) => {
    const [activeIndex, setActiveIndex] = useState<number>(0)
    const tw = useTailwind()
    const windownWith = useWindowDimensions().width - 40;
    const navigation = useNavigation<MainHomeNavigationProp>();
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
      <Pressable onPress={() => navigation.navigate('AdminDetailedHome', {homeId: item.id})} style={tw('relative w-full my-2 px-4 items-center justify-center')}>
        <FlatList
          data={item?.imgUrls}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          snapToAlignment='center'
          decelerationRate='fast'
          snapToInterval={windownWith}
          viewabilityConfig={{
            viewAreaCoveragePercentThreshold: 50,
          }}
          onViewableItemsChanged={onViewableItemsChanged.current}
          keyExtractor={(item: string) => item}
          renderItem={handleRenderItem}
          >
        </FlatList>
        <HomeCardDots arrayLength={item?.imgUrls.length} activeIndex={activeIndex}></HomeCardDots>
        <View style={tw('w-full flex-row items-start justify-between mt-2')}>
          <View style={tw(' flex-1 items-start justify-start ml-2')}>
            <Text style={tw('text-lg font-bold text-zinc-700 mb-2')}>{item.title}</Text>
            <Text style={tw('text-lg text-zinc-500 mb-2')}>{item.address}, {item.zipcode} {item.city.name}, {item.country.name}</Text>
            {item?.discount ? (
              <>
                <Text style={[tw('text-lg font-bold text-gray-300 mb-2'), {textDecorationLine: 'line-through'}]}>£{item.price} night</Text>
                <Text style={tw('text-lg font-bold text-zinc-700 mb-2')}>£{Math.round(item.price * (100 - item?.discount?.discountRate) / 100).toFixed(2)} night</Text>
              </>
            ): (
              <Text style={tw('text-lg font-bold text-zinc-700 mb-2')}>£{Math.round(item?.price).toFixed(2)} night</Text>
            )}
          </View>
          <View style={tw('flex-row items-center justify-start ml-2')}>
            <Entypo name="star" size={20} color="black" />
            <Text style={tw(' text-lg ml-2 text-black')}>4.83</Text>
            {/* {item.rating && <Text>{item.rating}</Text>} */}
          </View>
        </View>
      </Pressable>
    )
}

export default AdminHomeCardMain

const styles = StyleSheet.create({})