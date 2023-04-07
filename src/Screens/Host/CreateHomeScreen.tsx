import { Alert, Keyboard, KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, useWindowDimensions, View } from 'react-native'
import React, { useCallback, useEffect, useState, useLayoutEffect, useRef } from 'react'
import { useTailwind } from 'tailwind-rn/dist'
import { useDispatch, useSelector } from 'react-redux'
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import { DateData } from 'react-native-calendars/src/types';
import { now } from 'moment';
import { Button, Image } from '@rneui/base';
import Modal from "react-native-modal";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { HOST_URL, RootState } from '../../Store/store'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { HomesStackParamList } from '../../Navigators/HomesStack';
import { CompositeNavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../Navigators/MainStack';
import { HostBottomTabProps } from '../../Navigators/HostStack';
import { BOOKDATE, CATEGORY, COUNTRY, HOME, HOMEREVIEW, ImageData, ImagesData } from '../../Model';
import { clearBookdates, getBookdatesByAuthHostAction, getBookdatesByHomeAndCurrentTimeAction } from '../../Store/Actions/BookDateAction';
import { getHomesByHomeIdAction, getHomesByHostAction, saveHomeAction } from '../../Store/Actions/HomeAction';
import { ListRenderItem } from 'react-native';
import HostHomeCard from '../../Component/HostHomeCard';
import { FlatList } from 'react-native';
import { getReviewsByHomeAction } from '../../Store/Actions/HomeReviewAction';
import HomeDetailReviewCard from '../../Component/HomeDetailReviewCard';
import HomeCardDots from '../../Component/HomeCardDots';
import HostHomeDetailedCalendar from '../../Component/HostHomeDetailedCalendar';
import { TextInput } from 'react-native';
import DiscountFormCalendar from '../../Component/DiscountFormCalendar';
import CreateHomeCalendar from '../../Component/CreateHomeCalendar';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import { getCategoriesAction } from '../../Store/Actions/CategoryAction';
import { getCountriesAction } from '../../Store/Actions/CountryAction';
import { Picker } from '@react-native-picker/picker';
import LoadingComponent from '../../Component/LoadingComponent';

export type CreateHomeScreenNavigationProp = CompositeNavigationProp<
NativeStackNavigationProp<RootStackParamList, "CreateHomeScreen">,
NativeStackNavigationProp<HostBottomTabProps>>;

const imageDefault =[
    "wallpaper.jpg_a776d37b-97c9-4bd6-b4ca-1f342de06161",
    "Cabin-in-the-city-Best-Airbnbs-in-Ontario-819x1024.jpeg_89abc5d3-cd57-4fae-92ed-96bb77daf640",
    "dormir-dans-une-ferme-en-suède-best-airbnb-in-south-sweden-main.jpg_c83de24f-f4d0-4367-96ef-96d261a99e94"
];


const CreateHomeScreen = () => {   
    const [isLoading, setIsLoading] = useState<boolean>(false); 
    const currentDay = new Date().toLocaleDateString('en-CA');
    const [openVisible, setOpenVisible] = useState<boolean>(false);
    const [closeVisible, setCloseVisible] = useState<boolean>(false);
    const [opendate, setOpenDate] = useState<string | null>(null);
    const [closeDate, setCloseDate] = useState<string | null>(null);
    const [price, setPrice] = useState<number>(0);
    const [title, setTitle] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [city, setCity] = useState<string>("");
    const [country, setCountry] = useState<COUNTRY | null>(null);
    const [zipcode, setZipcode] = useState<string>("");
    const [beds, setBeds] = useState<number>(1);
    const [bedrooms, setBedrooms] = useState<number>(1);
    const [capacity, setCapacity] = useState<number>(2);
    const [category, setCategory] = useState<CATEGORY | null>(null);
    const [imgUrls, setImgUrls] = useState<string[] | []>([]);
    const tw = useTailwind();
    const {users, authUser, userError, userSuccess, message} = useSelector((state: RootState) => state.USERS);
    const {home, homeSuccess, homeError} = useSelector((state: RootState) => state.HOMES);
    const {discount, discounts, discountSuccess, discountError} = useSelector((state: RootState) => state.DISCOUNTS);
    const { categories, categorySuccess, categoryError} = useSelector((state: RootState) => state.CATEGORIES);
    const {countries, countrySuccess, countryError} = useSelector((state: RootState) => state.COUNTRIES);
    const dispatch = useDispatch()
    const navigation = useNavigation<CreateHomeScreenNavigationProp>();


    const loadGetCategories = useCallback(async () => {
      await dispatch(getCategoriesAction() as any);
    }, [ dispatch]);

    const loadGetCountries = useCallback(async () => {
      await dispatch(getCountriesAction() as any);
    }, [ dispatch]);

    useEffect(() => {
      setIsLoading(true);
      loadGetCategories().then(() => loadGetCountries()).then(() => setIsLoading(false));
    }, [])

    useEffect(() => {
      if(countries && countries.length > 0) {
        setCountry(countries[0]);
      }
    }, [countries])

    useEffect(() => {
      if(categories && categories.length > 0) {
        setCountry(categories[0]);
      }
    }, [categories])
    
    const uploadImageFunction = async () => {
      const images: any = await launchImageLibrary({
          mediaType: 'photo',
          quality: 1,
          selectionLimit: 5
      })
      console.log(images)
      const formdata = new FormData();
      let n = 0;
      
      if(!images.canceled) {
        while(n < images.assets.length) {
          console.log(images.assets[n]);
          const split = images.assets[n].uri.split('/');
          const fileNameDot = split[split.length - 1].split(".");
          const fileName = fileNameDot[0];
          const imageFile = {
            uri: images.assets[n].uri,
            type: images.assets[n].type,
            name: fileName
          };
          // console.log(imageFile);
          formdata.append("file",  JSON.parse(JSON.stringify(imageFile)));   
          n++;
        }
      }
      // console.log("formdata");
      // console.log(formdata);
      const res = await axios.post(HOST_URL + "/api/images/", formdata, {
          headers: {
              'Content-Type': 'multipart/form-data'
          }
      })
      const data : ImagesData = await res.data;
      console.log(data)
      setImgUrls(data.images);
    }

    const submitFunction = async () => {
      if(category && country && opendate && closeDate && title && price > 0 && address && zipcode && imgUrls && imgUrls.length > 0 && imgUrls.length <= 5 && beds > 0 && bedrooms > 0 && capacity > 0 && city) {
        const obj = {
          openBooking: opendate,
          closeBooking: closeDate,
          title: title,
          price: price,
          address: address.toLowerCase(),
          city: city.toLowerCase(),
          country: country?.name.toLowerCase(),
          zipcode: zipcode.toLowerCase(),
          imgUrls: imgUrls,
          beds: beds,
          bedrooms: bedrooms,
          capacity: capacity,
          homeCategoryId: category?.id
        };
        console.log(obj);
        await dispatch(saveHomeAction(obj) as any);
        Alert.alert("create new home successfully");
        setOpenDate(null);
        setCloseDate(null);
        setTitle("");
        setAddress("");
        setZipcode("");
        setPrice(0);
        setCity("");
        setImgUrls([]);
        setCapacity(2);
        setBeds(2);
        setBedrooms(2);
        navigation.navigate("HostHomeListingScreen");
      } else {
        Alert.alert("please filling proper informations required");
      }
    }

    if(isLoading) {
      return <LoadingComponent/>
    }

  return (
    <KeyboardAvoidingView style={tw('flex-1')}>
        <TouchableWithoutFeedback style={tw('flex-1')} onPress={Keyboard.dismiss}>
            {/* <ScrollView style={tw('flex-1 items-center justify-center px-4')}> */}
            <ScrollView style={tw('flex-1 px-4 bg-white')}>
                <View style={tw('items-start justify-start w-full')}>
                    <Text style={tw('text-black font-bold text-lg mb-2')}>Title</Text>                  
                    <TextInput  value={title} onChangeText={text => setTitle(text)} style={tw('w-full border border-gray-400 py-2 px-4 rounded-lg text-lg mb-6 mt-2')}></TextInput>
                </View>
                <View style={tw('items-start justify-start w-full')}>
                    <Text style={tw('text-black font-bold text-lg mb-2')}>Address</Text>                  
                    <TextInput  value={address} onChangeText={text => setAddress(text)} style={tw('w-full border border-gray-400 py-2 px-4 rounded-lg text-lg mb-6 mt-2')}></TextInput>
                </View>
                <View style={tw('items-start justify-start w-full')}>
                    <Text style={tw('text-black font-bold text-lg mb-2')}>Zipcode</Text>                  
                    <TextInput  value={zipcode} onChangeText={text => setZipcode(text)} style={tw('w-full border border-gray-400 py-2 px-4 rounded-lg text-lg mb-6 mt-2')}></TextInput>
                </View>
                <View style={tw('items-start justify-start w-full')}>
                    <Text style={tw('text-black font-bold text-lg mb-2')}>City</Text>                  
                    <TextInput  value={city} onChangeText={text => setCity(text)} style={tw('w-full border border-gray-400 py-2 px-4 rounded-lg text-lg mb-6 mt-2')}></TextInput>
                </View>
                {countries && countries.length > 0 && (
                 <View>
                    <Text style={tw('text-black font-bold text-lg mb-2')}>Country</Text>
                    <View style={[tw('w-full bg-white rounded-md border border-gray-400 text-zinc-700 font-bold text-lg bg-gray-200 mb-4'), {zIndex: 10, padding: 1}]}> 
                      <Picker
                            selectedValue={country}
                            onValueChange={(itemValue, itemIndex) => {
                                setCountry(itemValue)
                                console.log(itemValue)
                            }}
                            dropdownIconColor="white"
                            mode={Picker.MODE_DROPDOWN}
                            style={tw('bg-white border p-2 border-gray-400 ')}
                      >
                          {countries && countries.length > 0 && countries.map((item: COUNTRY) => <Picker.Item style={tw('bg-white p-2 border border-gray-400')} key={item.id} label={item.name} value={item}></Picker.Item>)}
                      </Picker>
                    </View>
                 </View>
                )}
                 {categories && categories.length > 0 && (
                 <View>
                    <Text style={tw('text-black font-bold text-lg mb-2')}>Home category</Text>
                    <View style={[tw('w-full bg-white rounded-md border border-gray-400 text-zinc-700 font-bold text-lg bg-gray-200 mb-4'), {zIndex: 10, padding: 1}]}> 
                      <Picker
                            selectedValue={category}
                            onValueChange={(itemValue, itemIndex) => {
                                setCategory(itemValue)
                                console.log(itemValue)
                            }}
                            dropdownIconColor="white"
                            mode={Picker.MODE_DROPDOWN}
                            style={tw('bg-white border p-2 border-gray-400 ')}
                      >
                          {categories && categories.length > 0 && categories.map((item: COUNTRY) => <Picker.Item style={tw('bg-white p-2 border border-gray-400')} key={item.id} label={item.name} value={item}></Picker.Item>)}
                      </Picker>
                    </View>
                 </View>
                )}
                <View style={tw('items-start justify-start w-full')}>
                    <Text style={tw('text-black font-bold text-lg mb-2')}>number of Beds</Text>                  
                    <TextInput keyboardType='numeric' value={beds + ""} onChangeText={text => setBeds(+text)} style={tw('w-full border border-gray-400 py-2 px-4 rounded-lg text-lg mb-6 mt-2')}></TextInput>
                </View>
                <View style={tw('items-start justify-start w-full')}>
                    <Text style={tw('text-black font-bold text-lg mb-2')}>number of Bedrooms</Text>                  
                    <TextInput keyboardType='numeric' value={bedrooms + ""} onChangeText={text => setBedrooms(+text)} style={tw('w-full border border-gray-400 py-2 px-4 rounded-lg text-lg mb-6 mt-2')}></TextInput>
                </View>
                <View style={tw('items-start justify-start w-full')}>
                    <Text style={tw('text-black font-bold text-lg mb-2')}>number of Guests</Text>                  
                    <TextInput keyboardType='numeric' value={capacity + ""} onChangeText={text => setCapacity(+text)} style={tw('w-full border border-gray-400 py-2 px-4 rounded-lg text-lg mb-6 mt-2')}></TextInput>
                </View>
                <View style={tw('items-start justify-start w-full')}>
                    <Text style={tw('text-black font-bold text-lg mb-2')}>Price</Text>                  
                    <TextInput keyboardType='numeric' value={price + ""} onChangeText={text => setPrice(+text)} style={tw('w-full border border-gray-400 py-2 px-4 rounded-lg text-lg mb-6 mt-2')}></TextInput>
                </View>
                <View style={tw('items-start justify-start w-full')}>
                    <View style={tw('flex-row items-center mb-2')}>
                        <Text style={tw('text-black font-bold text-lg mr-4')}>Open Date</Text>
                        <TouchableOpacity onPress={() => setOpenVisible(!openVisible)}>
                            <AntDesign name="calendar" size={28} color="#03b1fc" /> 
                        </TouchableOpacity>   
                    </View>                 
                    <View style={tw('w-full border border-gray-400 py-2 px-4 rounded-lg text-lg mb-6 mt-2')}>
                        <Text style={tw('text-lg')}>{opendate ? opendate : currentDay}</Text>
                    </View>
                </View>
                <View style={tw('items-start justify-start w-full')}>
                    <View style={tw('flex-row items-center mb-2')}>
                        <Text style={tw('text-black font-bold text-lg mr-4')}>Close Date</Text>
                        <TouchableOpacity onPress={() => setCloseVisible(!closeVisible)}>
                            <AntDesign name="calendar" size={28} color="#03b1fc" /> 
                        </TouchableOpacity>   
                    </View>                 
                    <View style={tw('w-full border border-gray-400 py-2 px-4 rounded-lg text-lg mb-6 mt-2')}>
                        <Text style={tw('text-lg')}>{closeDate ? closeDate : currentDay}</Text>
                    </View>
                </View>
                <Text>(Max images is 5)</Text>
                <TouchableOpacity  style={[tw('w-full rounded-lg mb-6 py-2 font-bold px-6'), {backgroundColor: "#03b1fc"}]}  onPress={uploadImageFunction}>
                  <Text style={tw('text-base text-white')}>Home images</Text>
                </TouchableOpacity>
                <Button onPress={submitFunction}  color="#03b1fc" containerStyle={tw('w-full rounded-lg mb-6')} size='lg' title='Create Home' ></Button>
                {home && openVisible && (
                    <CreateHomeCalendar isVisble={openVisible} setIsVisible={setOpenVisible} chosenDay={opendate} setChosenDay={setOpenDate}></CreateHomeCalendar>
                )}      
                {home && closeVisible && (
                    <CreateHomeCalendar isVisble={closeVisible} setIsVisible={setCloseVisible} chosenDay={closeDate} setChosenDay={setCloseDate}  openDate={opendate}></CreateHomeCalendar>
                )}      
            </ScrollView>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>

  )
}

export default CreateHomeScreen

const styles = StyleSheet.create({})