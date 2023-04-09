import { Alert, Image, Keyboard, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, ListRenderItem, FlatList } from 'react-native'
import React, { useEffect, useState, useLayoutEffect, useCallback } from 'react'
import { useTailwind } from 'tailwind-rn/dist'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from '@rneui/themed';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootStackParamList } from '../../Navigators/MainStack';
import { HostBottomTabProps } from '../../Navigators/HostStack';
import { HOST_URL, RootState } from '../../Store/store';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { getHostByAuthUser } from '../../Store/Actions/HostAction';
import LoadingComponent from '../../Component/LoadingComponent';
import { AdminBottomTabProps } from '../../Navigators/AdminStack';
import { getCitiesAction } from '../../Store/Actions/CityAction';
import { getCountriesAction } from '../../Store/Actions/CountryAction';
import { CATEGORY, CITY, COUNTRY } from '../../Model';
import { getCategoriesAction } from '../../Store/Actions/CategoryAction';
import HomeCategoryCard from '../../Component/HomeCategoryCard';

type CategoryScreenNavigationProp = CompositeNavigationProp<
BottomTabNavigationProp<AdminBottomTabProps, "CategoryScreen">,
NativeStackNavigationProp<RootStackParamList>>;

const CategoryScreen = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const tw = useTailwind()
  const dispatch = useDispatch()
  const navigation = useNavigation<CategoryScreenNavigationProp>()
  const {users, authUser, userError, userSuccess, message} = useSelector((state: RootState) => state.USERS)
  const {category, categories, categorySuccess, categoryError} = useSelector((state: RootState) => state.CATEGORIES);

  const handleGetCategories = useCallback(async () => {
    setIsRefreshing(true);
    await dispatch(getCategoriesAction() as any);
    setIsRefreshing(false);
  }, [ dispatch]);

  useEffect(() => {
    setIsLoading(true)
    handleGetCategories().then(() => setIsLoading(false));
  }, [dispatch])

  const handleRenderCategory: ListRenderItem<any> = ({item}: {item: CATEGORY}) => (
    <TouchableOpacity onPress={() => navigation.navigate("AdminHomeSearchScreen", {categoryId: item.id})} style={tw('my-2 mx-auto rounded-full px-4 py-4 border border-gray-200 items-center justify-center')}>
      <Image source={{uri: HOST_URL + "/api/images/image/" + item.imageUrl}} style={[tw('rounded-lg'), {width: 50, height: 50, resizeMode: 'cover'}]}></Image>  
      <Text style={tw("text-black my-2")}>{item.name}</Text>
    </TouchableOpacity>
  )

  if(isLoading) {
    return <LoadingComponent/>
  }

  return (
    <SafeAreaView style={tw('flex-1 items-start justify-center bg-white')}>
        <View style={[tw('w-full my-6 flex-row justify-between items-start')]}>
            <Text style={[tw('text-black text-2xl font-bold ml-4')]}>Home Category</Text>
            <TouchableOpacity  style={tw('mr-4 items-center justify-center')} >
                <Entypo name="add-to-list" size={28} color="#03b1fc"></Entypo>        
            </TouchableOpacity> 
        </View>
        <FlatList
            refreshing={isRefreshing}
            onRefresh={handleGetCategories}
            data={categories}
            keyExtractor={(item: any) => item.id}
            renderItem={handleRenderCategory}
            showsVerticalScrollIndicator={false}
            style={tw('w-full')}
        >
        </FlatList>
    </SafeAreaView>
  )
}

export default CategoryScreen

const styles = StyleSheet.create({})