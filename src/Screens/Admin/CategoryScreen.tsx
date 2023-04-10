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
import { CATEGORY, CITY, COUNTRY, CategoryPost, ImageData } from '../../Model';
import { getCategoriesAction, saveCategoryAction } from '../../Store/Actions/CategoryAction';
import HomeCategoryCard from '../../Component/HomeCategoryCard';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';

type CategoryScreenNavigationProp = CompositeNavigationProp<
BottomTabNavigationProp<AdminBottomTabProps, "CategoryScreen">,
NativeStackNavigationProp<RootStackParamList>>;

const CategoryScreen = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [categoryName, setCategoryName] = useState<string>("");
  const [imageurl, setImageurl] = useState<string | null>(null);
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

  const uploadImageFunction = async () => {
    const images: any = await launchImageLibrary({
        mediaType: 'photo',
        quality: 1
    })
    console.log(images)
    const formdata = new FormData();
    if(!images.canceled) {
            console.log(images.assets[0])
            const split = images.assets[0].uri.split('/')
            const fileNameDot = split[split.length - 1].split(".")
            const fileName = fileNameDot[0]
            const imageFile = {
                uri: images.assets[0].uri,
                type: images.assets[0].type,
                name: fileName
            }
            console.log(imageFile)
           formdata.append("file",  JSON.parse(JSON.stringify(imageFile)))         
    }
    console.log(formdata)
    const res = await axios.post(HOST_URL + "/api/images/singleImage", formdata, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    const data: ImageData = await res.data;
    console.log(res.data)
    setImageurl(data.image)
}

  const submitFunction = async () => {
    if(categoryName && categoryName.length > 0 && imageurl) {
      const obj : CategoryPost = {
        name: categoryName,
        imageUrl: imageurl
      };
      console.log(obj);
      await  dispatch(saveCategoryAction(obj) as any);
      setImageurl(null);
      setCategoryName("");
      setIsAdding(false);
    } else {
        Alert.alert("please fill all required information")
    }
  }

  if(isLoading) {
    return <LoadingComponent/>
  }

  return (
    <SafeAreaView style={tw('flex-1 items-start justify-center bg-white')}>
        <View style={[tw('w-full my-6 flex-row justify-between items-start')]}>
            <Text style={[tw('text-black text-2xl font-bold ml-4')]}>Home Category</Text>
            <TouchableOpacity onPress={() => setIsAdding(!isAdding)} style={tw('mr-4 items-center justify-center')} >    
              {isAdding ? (
                <AntDesign name="minuscircleo" size={28} color="#03b1fc"></AntDesign> 
              ): (
                <Entypo name="add-to-list" size={28} color="#03b1fc"></Entypo>  
              )}         
            </TouchableOpacity> 
        </View>
        {isAdding && (
            <View style={tw('my-2 w-full px-8')}>
                 <TextInput value={categoryName}  placeholder="Category name" onChangeText={(text: string) => setCategoryName(text)} style={tw('w-full border border-gray-400 py-2 px-4 rounded-lg text-lg mb-6')} onSubmitEditing={submitFunction}></TextInput>
                 <TouchableOpacity  style={[tw('w-full rounded-lg my-2 py-2 font-bold px-6'), {backgroundColor: "#03b1fc"}]}  onPress={uploadImageFunction}>
                    <Text style={tw('text-base text-white')}>Add Image</Text>
                </TouchableOpacity>
                {imageurl && (
                    <View style={tw('my-2 w-full items-center justify-center')}>
                        <Image source={{uri: HOST_URL + "/api/images/image/" + imageurl}} style={[tw('rounded-full'), {width: 120, height: 120, resizeMode: 'cover'}]}></Image>
                    </View>
                )}
                <Button  color="#03b1fc" containerStyle={tw('w-full rounded-lg mb-6')} size='lg' title='Add Category' onPress={submitFunction}></Button>
            </View>
        )}
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