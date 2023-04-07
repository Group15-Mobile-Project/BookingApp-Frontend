import { Alert, ScrollView, StyleSheet, Text, Touchable, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootState } from '../../Store/store';
import { RootStackParamList } from '../../Navigators/MainStack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute, CompositeNavigationProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { ListRenderItem, FlatList } from 'react-native';
import { useTailwind } from 'tailwind-rn/dist'
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Button } from '@rneui/base';
import { HomesStackParamList } from '../../Navigators/HomesStack';
import { getNotificationsByTenantAction } from '../../Store/Actions/NotificationAction';
import NotificationCard from '../../Component/NotificationCard';
import { NOTIFICATION } from '../../Model';
import { TenantBottomTabProps } from '../../Navigators/TenantStack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import LoadingComponent from '../../Component/LoadingComponent';


const NotificationsScreen = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const {users, authUser, userError, userSuccess, message} = useSelector((state: RootState) => state.USERS);
    const {notifications, notificationSuccess, notificationError} = useSelector((state: RootState) => state.NOTIFICATIONS);
    const tw = useTailwind();
    const windownWith = useWindowDimensions().width;
    const dispatch = useDispatch();

    const loadNotifications = useCallback(async () => {
        if(authUser) {
            setIsRefreshing(true);
            await dispatch(getNotificationsByTenantAction() as any)
            setIsRefreshing(false)
        }
    }, [authUser, dispatch])

    const handleRenderItem: ListRenderItem<any> = ({item}: {item: NOTIFICATION}) => (
        <NotificationCard notify={item}></NotificationCard>
    )

    useEffect(() => {
        setIsLoading(true);
        loadNotifications().then(() => setIsLoading(false));
    }, [authUser, dispatch])

    if(isLoading) {
        return <LoadingComponent/>
    }

  return (
    <View style={tw('bg-white flex-1 px-2')}>
        <FlatList
            refreshing={isRefreshing}
            onRefresh={loadNotifications}
            data={notifications}
            keyExtractor={(item: any) => item.id}
            renderItem={handleRenderItem}
            showsVerticalScrollIndicator={false}
        >
        </FlatList>
    </View>
  )
}

export default NotificationsScreen

const styles = StyleSheet.create({})