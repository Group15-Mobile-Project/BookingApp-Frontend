import { Keyboard, KeyboardAvoidingView, ListRenderItem, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useTailwind } from 'tailwind-rn/dist'
import { SafeAreaView } from 'react-native-safe-area-context';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { clearCitiesAction, getCitiesBySearchQueryAction } from '../../Store/Actions/CityAction';
import { CITY } from '../../Model';
import { FlatList } from 'react-native';
import { RootState } from '../../Store/store';
import { RootStackParamList } from '../../Navigators/MainStack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import IncreaseDecreaseNumber from '../../Component/IncreaseDecreaseNumber';
import SearchCalendar from '../../Component/SearchCalendar';
import { Modal } from 'react-native';
import { Button } from '@rneui/base';
import { getHomesBySearchQueryAction } from '../../Store/Actions/HomeAction';
import { Alert } from 'react-native';
import { HomesStackParamList } from '../../Navigators/HomesStack';
import LoadingComponent from '../../Component/LoadingComponent';

export type MainHomeNavigationProp = CompositeNavigationProp<
NativeStackNavigationProp<RootStackParamList, "HomeSearchScreen">,
NativeStackNavigationProp<HomesStackParamList>>;

const HomeSearchScreen = () => {
    const [query, setQuery] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
    const [citySearch, setCitySearch] = useState<string>("");
    const [checkIn, setCheckIn] = useState<string>("");
    const [checkOut, setCheckOut] = useState<string>("");
    const [capacity, setCapacity] = useState<number>(2);
    const [showPlace, setShowPlace] = useState<boolean>(true);
    const [showCalendar, setShowCalendar] = useState<boolean>(false);
    const tw = useTailwind()
    const dispatch = useDispatch()
    const {cities, city, citySuccess, cityError} = useSelector((state: RootState) => state.CITIES);
    // const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>() 
    const navigation = useNavigation<MainHomeNavigationProp>();

    const loadCitiesByQuery = useCallback(async () => {
        if(query) {
            setIsRefreshing(true)
           await dispatch(getCitiesBySearchQueryAction(query) as any)
           setIsRefreshing(false)
        }
    }, [query])

    useEffect(() => {
        // setIsLoading(true);
        // loadCitiesByQuery().then(() => setIsLoading(false));
        loadCitiesByQuery();
    }, [query, dispatch])

    const chooseCityFunction = (item: CITY) => {
        setCitySearch(item.name);
        setQuery(item.name);
        setShowPlace(!showPlace);
    }
    const clearSearchCity = () => {
        setCitySearch("");
        setQuery("");
        dispatch(clearCitiesAction() as any)
    }

    const handleCityItem: ListRenderItem<any> = ({item}: {item: CITY}) => (
        <TouchableOpacity onPress={() => chooseCityFunction(item)} style={tw('w-full my-2 px-2 flex-row items-start justify-start')} >
            <EvilIcons name="location" size={40} color="black"></EvilIcons>
            <Text style={[tw('text-gray-400'), {fontSize: 20}]}>{item.name} - {item.country.name}</Text>          
        </TouchableOpacity>
    )

    const clearAllFunction = () => {
        setCapacity(2);
        setCheckIn("");
        setCheckOut("");
        setCitySearch("");
        setQuery("");
        dispatch(clearCitiesAction() as any)
    }
    const searchSubmit = () => {
        if(citySearch && checkIn && checkOut && capacity) {
            navigation.navigate('SearchResultScreen', {citySearch, checkIn, checkOut, capacity})
        } else {
            Alert.alert("please fill all information required");
        }   
    }

    if(isLoading) {
        return <LoadingComponent/>
    }
  return (
    <KeyboardAvoidingView style={tw('flex-1')}>
    <TouchableWithoutFeedback style={tw('flex-1')} onPress={Keyboard.dismiss}>
    <SafeAreaView style={tw('flex-1 px-2 relative')}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={tw('w-10 h-10 items-center justify-center rounded-full ml-4 bg-white my-2')}>
        <EvilIcons name="close" size={28} color="black"></EvilIcons> 
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setShowPlace(!showPlace)} style={[tw('w-full rounded-lg bg-white py-2 px-2 my-2 items-start justify-center'), , {maxHeight: "80%"}]}>
        <View style={tw('w-full my-2 px-2 flex-row items-center justify-between')}>
            <Text style={tw(`text-lg font-bold  ${citySearch ? "text-gray-400" : "text-black"}`)}>{citySearch ? "City" : "Which City To ?"}</Text>
            {citySearch && <Text style={tw('text-2xl font-bold text-black')}>{citySearch}</Text>}
        </View>
        {showPlace && (
            <View style={[tw('w-full')]}>
                <View style={[tw('relative w-full my-2')]}>
                    <TextInput style={tw('rounded-full border border-gray-400 py-2 text-lg pl-12 bg-white text-black')} placeholder='search cities' value={query} onChangeText={(text: string) =>setQuery(text)}></TextInput>
                    <TouchableOpacity  style={tw('mx-2 absolute top-2 left-0')}>
                        <Entypo name="magnifying-glass" size={28} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => clearSearchCity()} style={tw('absolute top-2 right-2 w-8 h-8 items-center justify-center rounded-full bg-white')}>
                        <EvilIcons name="close" size={28} color="black"></EvilIcons> 
                    </TouchableOpacity>
                </View>
                <FlatList
                refreshing={isRefreshing}
                onRefresh={loadCitiesByQuery}
                data={cities}
                keyExtractor={(item: any) => item.id}
                renderItem={handleCityItem}
                showsVerticalScrollIndicator={false}
                >
                </FlatList>
            </View>
        )}
      </TouchableOpacity>
      <View style={tw('w-full rounded-lg bg-white py-2 px-4 my-2 flex-row items-start justify-between')}>
        <Text style={tw('text-lg font-bold text-gray-400')}>Guests</Text>
        <IncreaseDecreaseNumber currentNum={capacity} setCurrentNum={setCapacity}></IncreaseDecreaseNumber>
      </View>
      <View style={tw('w-full rounded-lg bg-white py-2 px-4 my-2')}>
        <TouchableOpacity  onPress={() => setShowCalendar(!showCalendar)} style={tw('flex-row items-start justify-between')}>
            <Text style={tw('text-lg font-bold text-gray-400')}>When</Text>
            {checkIn && checkOut && (
                <View style={tw('items-start')}>
                    <Text style={tw('text-black text-base mb-2')}>Check-In: {checkIn}</Text>
                    <Text style={tw('text-black text-base mb-2')}>Check-Out: {checkOut}</Text>
                </View>
            )}
        </TouchableOpacity>
        <View style={{zIndex: 15}}>
            {showCalendar && (
                <SearchCalendar  checkIn={checkIn} checkOut={checkOut} setCheckIn={setCheckIn} setCheckOut={setCheckOut} showCalendar={showCalendar} setShowCalendar={setShowCalendar}></SearchCalendar>
            )}
        </View>
      </View >
      {!showCalendar && (
        <View style={[tw('flex-row absolute bottom-0 items-center justify-between w-full px-4 bg-white py-2'), {zIndex: 5}]}>
            <Button onPress={clearAllFunction}  title="clear All" buttonStyle={tw('w-20 h-12 rounded-lg bg-gray-400')} titleStyle={tw('text-white font-bold')}></Button>
            <Button onPress={searchSubmit}  title="Search" buttonStyle={tw('w-20 h-12 rounded-lg bg-[#03b1fc]')} titleStyle={tw('text-white font-bold')}></Button>
        </View>
      )}
    </SafeAreaView>
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default HomeSearchScreen

const styles = StyleSheet.create({})