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
import { RootState } from '../../Store/store';
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
import { getCountriesAction, saveCountryAction } from '../../Store/Actions/CountryAction';
import { CITY, COUNTRY } from '../../Model';

type CountryScreenNavigationProp = CompositeNavigationProp<
BottomTabNavigationProp<AdminBottomTabProps, "CountryScreen">,
NativeStackNavigationProp<RootStackParamList>>;

const CountryScreen = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isRefreshing, setIsFreshing] = useState<boolean>(false);
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const [countryName, setCountryName] = useState<string>("");
    const tw = useTailwind()
    const dispatch = useDispatch()
    const navigation = useNavigation<CountryScreenNavigationProp>()
    const {users, authUser, userError, userSuccess, message} = useSelector((state: RootState) => state.USERS)
    const {countries, countrySuccess, countryError} = useSelector((state: RootState) => state.COUNTRIES);
    const {cities, city, citySuccess, cityError} = useSelector((state: RootState) => state.CITIES);

    const loadCities = useCallback(async () => {
        setIsFreshing(true);
        await dispatch(getCitiesAction() as any);
        setIsFreshing(false);
    }, [dispatch])
    const loadCountries = useCallback(async () => {
        setIsFreshing(true);
        await dispatch(getCountriesAction() as any);
        setIsFreshing(false);
    }, [dispatch])

    useEffect(() => {
        setIsLoading(true);
        loadCountries().then(() => loadCities()).then(() => setIsLoading(false));
    }, [ dispatch])

    const handleCityItem: ListRenderItem<any> = ({item}: {item: CITY}) => (
        <TouchableOpacity onPress={() => navigation.navigate("AdminHomeSearchScreen", {city: item?.name})}  style={tw('w-full my-2 px-2 ml-8 flex-row items-start justify-start')} >
            <EvilIcons name="location" size={40} color="black"></EvilIcons>
            <Text style={[tw('text-gray-400'), {fontSize: 20}]}>{item.name}</Text>          
        </TouchableOpacity>
    )

    const handleCountryItem: ListRenderItem<any> = ({item}: {item: COUNTRY}) => (
        <View>
            <View style={tw('w-full my-2 px-4 py-2 items-start justify-start bg-gray-200')} >
                <Text style={[tw('text-black mb-4'), {fontSize: 20}]}>{item.name}</Text>       
            </View>
            <FlatList
                refreshing={isRefreshing}
                onRefresh={loadCities}
                data={cities.filter((ci : CITY) => ci.country.name == item.name)}
                keyExtractor={(item: any) => item.id}
                renderItem={handleCityItem}
                showsVerticalScrollIndicator={false}
            >
            </FlatList> 
        </View>
    )

    const submitFunction = async () => {
        if(countryName && countryName.length > 0) {
            await dispatch(saveCountryAction(countryName.toLowerCase()) as any);
            console.log(countryName);
            setCountryName("");
            setIsAdding(false);
            Alert.alert("adding the country successfully");
        } else {
            Alert.alert("please add name of the country");
        }
    }

    if(isLoading) {
        return <LoadingComponent/>
    }

  return (
    <SafeAreaView style={tw('flex-1 items-start justify-center bg-white')}>
        <View style={[tw('w-full my-6 flex-row justify-between items-start')]}>
            <Text style={[tw('text-black text-2xl font-bold ml-4')]}>Countries</Text>
            <TouchableOpacity onPress={() => setIsAdding(!isAdding)} style={tw('w-1/3 mr-4 items-center justify-center')} >
                {isAdding ? (
                    <AntDesign name="minuscircleo" size={28} color="#03b1fc"></AntDesign>  
                ): (
                    <>
                        <Entypo name="add-to-list" size={28} color="#03b1fc"></Entypo>
                        <Text style={[tw('text-gray-400 mt-2'), {fontSize: 16}]}>Add country</Text>  
                    </>
                )}        
            </TouchableOpacity> 
        </View>
        {isAdding && (
            <View style={tw('my-2 w-full px-8')}>
                 <TextInput value={countryName}  placeholder="Country name" onChangeText={(text: string) => setCountryName(text)} style={tw('w-full border border-gray-400 py-2 px-4 rounded-lg text-lg mb-6')} onSubmitEditing={submitFunction}></TextInput>
                <Button  color="#03b1fc" containerStyle={tw('w-full rounded-lg mb-6')} size='lg' title='Add country' onPress={submitFunction}></Button>
            </View>
        )}
        <FlatList
            refreshing={isRefreshing}
            onRefresh={loadCountries}
            data={countries}
            keyExtractor={(item: any) => item.id}
            renderItem={handleCountryItem}
            showsVerticalScrollIndicator={false}
            style={tw('w-full')}
        >
        </FlatList>
    </SafeAreaView>
  )
}

export default CountryScreen

const styles = StyleSheet.create({})