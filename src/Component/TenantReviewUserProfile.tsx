import { FlatList, ListRenderItem, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useTailwind } from 'tailwind-rn/dist';
import { HOST_URL, RootState } from '../Store/store';
import { HOMEREVIEW, TENANTREVIEW } from '../Model';
import { Image } from 'react-native';



const TenantReviewUserProfile = () => {
  const tw = useTailwind();
  const {tenantReviews, tenantReviewSuccess, tenantReviewError} = useSelector((state: RootState) => state.TENANTREVIEWS);


  
  return (
    <View style={tw('bg-white w-full')}>
        {tenantReviews && tenantReviews.length > 0 && tenantReviews.map((item: TENANTREVIEW) => (
          <View style={[tw(' py-2 px-2 mx-2 w-full')]} key={item.id}>
            <View style={tw('flex-row items-center justify-start')}>
                <Image source={{uri: HOST_URL + "/api/images/image/" + item.tenant.imgUrls}} style={[tw('rounded-full mr-4'), {width: 40, height: 40, resizeMode: 'cover'}]}></Image>      
                <View style={tw(' items-start justify-start')}>
                    <Text style={tw(' text-lg text-black font-bold')}>{item.tenant.username}</Text>
                    <Text style={tw(' text-base text-gray-500 font-bold')}>{new Date(item.createDate).toLocaleString('en-us',{ month:'short', year:'numeric'})}</Text>
                </View>
            </View>
            <Text style={tw('mt-4 my-2 text-lg')}>{item.content}</Text>
        </View>
        ))}
    </View>
  )
}

export default TenantReviewUserProfile

const styles = StyleSheet.create({})