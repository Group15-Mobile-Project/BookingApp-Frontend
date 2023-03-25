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
import { HOME } from '../../Model';
import MapHomeCard from '../../Component/MapHomeCard';
import { FlatList } from 'react-native';
import { useWindowDimensions } from 'react-native';

const MapHomes = () => {
    const {cities, city, citySuccess, cityError} = useSelector((state: RootState) => state.CITIES);
    const {homes, homeSuccess, homeError} = useSelector((state: RootState) => state.HOMES)
    console.log(homes[2]);
    const [selectedHomeId, setSelectedHomeId] = useState<number | null>(null);
    const [longitudeRegion, setLongitudeRegion] = useState<string | null>(homes[0] ? homes[0].longtitude : "24.93396");
    const [latitudeRegion, setLatitudeRegion] = useState<string | null>(homes[0] ? homes[0].latitude : "60.20179");
    const flatlist = useRef<any>();
    const map = useRef<any>();
    const tw = useTailwind();
    const dispatch = useDispatch();
    const windownWith = useWindowDimensions().width
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>() 

    const handleRenderItem: ListRenderItem<any> = ({item}: {item: HOME}) => (
       <MapHomeCard home={item}></MapHomeCard>
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
        const selectedHome: HOME = homes.find((ho: HOME) => ho.id == selectedHomeId);
        // console.log("selectedHome: " + selectedHomeId);
        // console.log(selectedHome)
        const region = {
            latitude: Number(selectedHome.latitude),
            longitude: Number(selectedHome.longtitude),
            latitudeDelta: 0.7,
            longitudeDelta: 0.7,
        }
        // console.log(region);
        map.current.animateToRegion(region);
        let selectedIndex;
        homes.forEach((ho: HOME, index: number) => {
            if(ho.id === selectedHomeId) {
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
        {homes && homes.length > 0 && homes.map((ho: HOME) => (
            <CustomeMapMarker 
            coordinate={{longitude: ho.longtitude,  latitude: ho.latitude}}
            price={ho.price}
            isSelected={selectedHomeId == ho.id}
            onPress={() => setSelectedHomeId(ho.id)}
            homeId={ho.id}
            key={ho.id}
           ></CustomeMapMarker>
        ))}
          
        </MapView>
        <View style={[tw(''), {position: 'absolute', bottom: 10}]}>
            <FlatList
                ref={flatlist}
                data={homes}
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
    </SafeAreaView >
  )
}

export default MapHomes

const styles = StyleSheet.create({})