import { FlatList, Image, ListRenderItem, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import { HOME } from '../Model'
import { useTailwind } from 'tailwind-rn/dist'
import Entypo from 'react-native-vector-icons/Entypo';
import { useWindowDimensions } from 'react-native';
import { HOST_URL } from '../Store/store';
import HomeCardDots from './HomeCardDots';



const imageDefault =[
  "wallpaper.jpg_a776d37b-97c9-4bd6-b4ca-1f342de06161",
  "Cabin-in-the-city-Best-Airbnbs-in-Ontario-819x1024.jpeg_89abc5d3-cd57-4fae-92ed-96bb77daf640",
  "dormir-dans-une-ferme-en-suède-best-airbnb-in-south-sweden-main.jpg_c83de24f-f4d0-4367-96ef-96d261a99e94"
]

const HomeCardMain = ({item}: {item: HOME}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [like, setLike] = useState<boolean>(false)  
  const tw = useTailwind()
  const windownWith = useWindowDimensions().width - 40

  const handleRenderItem: ListRenderItem<any> = ({item}) => (
    <Image source={{uri: HOST_URL + "/api/images/image/" + item}} style={[tw('rounded-lg mb-2 mr-2'), {width: windownWith, height: 400, resizeMode: 'cover'}]}></Image>       
)

  const onViewableItemsChanged = useRef(({viewableItems, changed}: {viewableItems: any, changed: any}) => {
        console.log(viewableItems[0])
        if(viewableItems.length > 0) {
            setActiveIndex(viewableItems[0].index)
        }
})

  const likeHome = async () => {
    setLike(!like)
  }

  return (
    <View style={tw('relative w-full my-2 px-4 items-center justify-center')}>
      <TouchableOpacity onPress={likeHome} style={[tw('absolute top-2 right-8'), {zIndex: 10}]}>
        {!like ? (
          <Entypo name="heart-outlined" size={28} color="white" />
        ): (
          <Entypo name="heart" size={28} color="red" />
        )}
      </TouchableOpacity>
      <FlatList
        data={ imageDefault}
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
      <HomeCardDots arrayLength={imageDefault.length} activeIndex={activeIndex}></HomeCardDots>
      <View style={tw('w-full flex-row items-start justify-between mt-2')}>
        <View style={tw(' flex-1 items-start justify-start ml-2')}>
          <Text style={tw('text-lg font-bold text-zinc-700 mb-2')}>{item.title}</Text>
          <Text style={tw('text-lg text-zinc-500 mb-2')}>{item.address}, {item.zipcode} {item.city.name}, {item.country.name}</Text>
          <Text style={tw('text-lg font-bold text-zinc-700 mb-2')}>£{item.price} night</Text>
        </View>
        <View style={tw('flex-row items-center justify-start ml-2')}>
          <Entypo name="star" size={20} color="black" />
          <Text style={tw(' text-lg ml-2 text-black')}>4.83</Text>
          {/* {item.rating && <Text>{item.rating}</Text>} */}
        </View>
      </View>
    </View>
  )
}

export default HomeCardMain

const styles = StyleSheet.create({})