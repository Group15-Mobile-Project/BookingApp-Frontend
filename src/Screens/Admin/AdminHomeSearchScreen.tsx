import { Alert, FlatList, Image, Keyboard, KeyboardAvoidingView, ListRenderItem, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useTailwind } from 'tailwind-rn/dist'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from '@rneui/themed';
import { useDispatch, useSelector } from 'react-redux';
import {  ResetUser, updateToHostAction } from '../../Store/Actions/UserAction';
import { RootState } from '../../Store/store';
import { useNavigation, CompositeNavigationProp, RouteProp, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../Navigators/MainStack';
import { CATEGORY, HOME } from '../../Model';
import HomeCardMain from '../../Component/HomeCardMain';
import { getHomesAction, getHomesByCategoryAction, getHomesByCityAction } from '../../Store/Actions/HomeAction';
import { getCategoriesAction } from '../../Store/Actions/CategoryAction';
import HomeCategoryCard from '../../Component/HomeCategoryCard';
import Entypo from 'react-native-vector-icons/Entypo';
import { useWindowDimensions } from 'react-native';
import { HomesStackParamList } from '../../Navigators/HomesStack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { getWishlistByAuthUserAction } from '../../Store/Actions/WishlistAction';
import LoadingComponent from '../../Component/LoadingComponent';
import { AdminBottomTabProps } from '../../Navigators/AdminStack';
import AdminHomeCardMain from '../../Component/AdminHomeCardMain';

type AdminHomeSearchScreenNavigationProp = CompositeNavigationProp<
NativeStackNavigationProp<RootStackParamList, "AdminHomeSearchScreen">,
BottomTabNavigationProp<AdminBottomTabProps>>;

type AdminHomeSearchScreenRouteProp = RouteProp<RootStackParamList, "AdminHomeSearchScreen">;

const AdminHomeSearchScreen = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const tw = useTailwind();
  const {users, authUser, userError, userSuccess, message} = useSelector((state: RootState) => state.USERS);
  const {homes, homeSuccess, homeError} = useSelector((state: RootState) => state.HOMES);
  const dispatch = useDispatch();
  const navigation = useNavigation<AdminHomeSearchScreenNavigationProp>();
  const {params} = useRoute<AdminHomeSearchScreenRouteProp>();
  const {categoryId, city} = params;
  const windownWith = useWindowDimensions().width;

  const handleGetHomes = useCallback(async () => {
      setIsRefreshing(true);
      if(categoryId) {
        await dispatch(getHomesByCategoryAction(categoryId) as any);
      }
      if(city) {
        await dispatch(getHomesByCityAction(city) as any);
      }
    
      setIsRefreshing(false);
  }, [ dispatch]);

  useEffect(() => {
      setIsLoading(true)
      handleGetHomes().then(() => setIsLoading(false))
  }, [ dispatch])



  const handleRenderItem: ListRenderItem<any> = ({item}: {item: HOME}) => (
      <AdminHomeCardMain item={item}></AdminHomeCardMain>
  )

  if(isLoading) {
      return <LoadingComponent/>
  }

  if(homes && homes.length == 0) {
    return (
      <View style={tw('items-center justify-center flex-1')}>
        <Text style={tw('text-2xl font-bold text-black')}>No Home</Text>
      </View>
    )
  }

return (
  <KeyboardAvoidingView style={tw('flex-1')}>
      <TouchableWithoutFeedback style={tw('flex-1')} onPress={Keyboard.dismiss}>
          <SafeAreaView style={tw('flex-1 bg-white relative')}> 
              <FlatList
                  refreshing={isRefreshing}
                  onRefresh={handleGetHomes}
                  data={homes}
                  keyExtractor={(item: any) => item.id}
                  renderItem={handleRenderItem}
                  showsVerticalScrollIndicator={false}
                  >
              </FlatList>
          </SafeAreaView>
      </TouchableWithoutFeedback>
 </KeyboardAvoidingView>
)
}

export default AdminHomeSearchScreen

const styles = StyleSheet.create({})