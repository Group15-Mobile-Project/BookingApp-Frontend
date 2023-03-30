import { Keyboard, KeyboardAvoidingView, ListRenderItem, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTailwind } from 'tailwind-rn/dist'
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootState } from '../../Store/store';
import { RootStackParamList } from '../../Navigators/MainStack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import MapView, { Marker, PROVIDER_GOOGLE }  from 'react-native-maps';
import CustomeMapMarker from '../../Component/CustomeMapMarker';
import { HOME, WISHLIST } from '../../Model';
import MapHomeCard from '../../Component/MapHomeCard';
import { FlatList } from 'react-native';
import { useWindowDimensions } from 'react-native';
import MapWishlistCard from '../../Component/MapWishlistCard';

const MapWishlists = () => {
    const {cities, city, citySuccess, cityError} = useSelector((state: RootState) => state.CITIES);
    const {homes, homeSuccess, homeError} = useSelector((state: RootState) => state.HOMES)
    console.log(homes[2]);
    const {wishlist, wishlists, wishlistSuccess, wishlistError} = useSelector((state: RootState) => state.WISHLISTS);
    const [selectedHomeId, setSelectedHomeId] = useState<number | null>(null);
    const [longitudeRegion, setLongitudeRegion] = useState<string | null>(wishlists[0] ? wishlists[0].homeResponse.longtitude : "24.93396");
    const [latitudeRegion, setLatitudeRegion] = useState<string | null>(wishlists[0] ? wishlists[0].homeResponse.latitude : "60.20179");
    const flatlist = useRef<any>();
    const map = useRef<any>();
    const tw = useTailwind();
    const dispatch = useDispatch();
    const windownWith = useWindowDimensions().width
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>() 

    const handleRenderItem: ListRenderItem<any> = ({item}: {item: WISHLIST}) => (
       <MapWishlistCard item={item}></MapWishlistCard>
    )
    const viewConfig = useRef<any>({itemVisiblePercentThreshold: 70});
    const onViewableItemsChanged = useRef(({viewableItems, changed}: {viewableItems: any, changed: any}) => {
        if(viewableItems.length > 0) {
            const selectedPlace = viewableItems[0].item
            setSelectedHomeId(selectedPlace.id);
        }
    })
    useEffect(() => {
        if(!homes || homes.length == 0 || !selectedHomeId || !flatlist) {
            return;
        }
        const selectedWishlist: WISHLIST = wishlists.find((wish: WISHLIST) => wish.id == selectedHomeId);
        // console.log("selectedHome: " + selectedHomeId);
        // console.log(selectedHome)
        const region = {
            latitude: Number(selectedWishlist.homeResponse.latitude),
            longitude: Number(selectedWishlist.homeResponse.longtitude),
            latitudeDelta: 0.7,
            longitudeDelta: 0.7,
        }
        // console.log(region);
        map.current.animateToRegion(region);
        let selectedIndex;
        wishlists.forEach((wish: WISHLIST, index: number) => {
            if(wish.id === selectedHomeId) {
                selectedIndex = index;
            }
        })
        if(selectedIndex) {
            flatlist.current.scrollToIndex({index: selectedIndex});
        }
    }, [selectedHomeId])

    

  return (
    <SafeAreaView style={tw('flex-1')}>
     <MapView      
            ref={map}
            initialRegion={{
                latitude: Number(latitudeRegion),
                longitude: Number(longitudeRegion),
                latitudeDelta: 0.7,
                longitudeDelta: 0.7,
            }}
            style={{height: "100%", width: "100%"}}
            provider={PROVIDER_GOOGLE}  
        >
        {wishlists && wishlists.length > 0 && wishlists.map((wish: WISHLIST) => (
            <CustomeMapMarker 
            coordinate={{longitude: wish.homeResponse.longtitude,  latitude: wish.homeResponse.latitude}}
            price={wish.homeResponse.price}
            isSelected={selectedHomeId == wish.homeResponse.id}
            onPress={() => setSelectedHomeId(wish.homeResponse.id)}
            homeId={wish.homeResponse.id}
            key={wish.homeResponse.id}
           ></CustomeMapMarker>
        ))}
          
        </MapView>
        {wishlists && wishlists.length > 0 && (
            <View style={[tw(''), {position: 'absolute', bottom: 10}]}>
                <FlatList
                    ref={flatlist}
                    data={wishlists}
                    renderItem={handleRenderItem}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    snapToInterval={windownWith}
                    snapToAlignment={"center"}
                    decelerationRate={"fast"}
                    viewabilityConfig={viewConfig.current}
                    onViewableItemsChanged={onViewableItemsChanged.current}
                />
            </View>
        )}
    </SafeAreaView >
  )
}

export default MapWishlists

const styles = StyleSheet.create({})