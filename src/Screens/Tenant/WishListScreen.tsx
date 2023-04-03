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
import { CATEGORY, HOME, WISHLIST } from '../../Model';
import HomeCardMain from '../../Component/HomeCardMain';
import { getHomesAction, getHomesByCategoryAction } from '../../Store/Actions/HomeAction';
import { getCategoriesAction } from '../../Store/Actions/CategoryAction';
import HomeCategoryCard from '../../Component/HomeCategoryCard';
import Entypo from 'react-native-vector-icons/Entypo';
import { useWindowDimensions } from 'react-native';
import { HomesStackParamList } from '../../Navigators/HomesStack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { TenantBottomTabProps } from '../../Navigators/TenantStack';
import { getWishlistByAuthUserAction } from '../../Store/Actions/WishlistAction';
import WishlistCard from '../../Component/WishlistCard';

type WishlistNavigationProp = CompositeNavigationProp<
BottomTabNavigationProp<TenantBottomTabProps, "WishListScreen">,
NativeStackNavigationProp<RootStackParamList>
>;

const WishListScreen = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
  const tw = useTailwind();
  const {users, authUser, userError, userSuccess, message} = useSelector((state: RootState) => state.USERS);
  const {wishlist, wishlists, wishlistSuccess, wishlistError} = useSelector((state: RootState) => state.WISHLISTS);
  const dispatch = useDispatch();
  const navigation = useNavigation<WishlistNavigationProp>();
  const windownWith = useWindowDimensions().width;

  const loadWishlist = useCallback(async () => {
    setIsRefreshing(true)
    await dispatch(getWishlistByAuthUserAction() as any)
    setIsRefreshing(false)
  }, [authUser, dispatch])

  useEffect(() => {
      setIsLoading(true)
      loadWishlist().then(() => setIsLoading(false))
  }, [dispatch, authUser])

  const handleRenderItem: ListRenderItem<any> = ({item}: {item: WISHLIST}) => (
    <WishlistCard item={item} ></WishlistCard>
)

  const navigateToMapHome =() => {
    navigation.navigate('MapWishlists');
  }

  return (
    <SafeAreaView style={tw('flex-1 bg-white relative')}> 
      <Text style={tw('text-3xl font-bold text-black my-4 ml-4')}>Your Wishlists</Text>
      <View style={tw('')}>
        <FlatList
          refreshing={isRefreshing}
          onRefresh={loadWishlist}
          data={wishlists}
          keyExtractor={(item: any) => item.id}
          renderItem={handleRenderItem}
          showsVerticalScrollIndicator={false}
          >
        </FlatList>
      </View>
      <TouchableOpacity onPress={navigateToMapHome}  style={[tw('mx-2 absolute bottom-4 bg-white p-2 rounded-full'), {zIndex: 10, left: windownWith/2 - 30}]}>
          <Entypo name="map" size={28} color="black" />
        </TouchableOpacity>
    </SafeAreaView>
  )
}

export default WishListScreen

const styles = StyleSheet.create({})