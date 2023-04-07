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
import { CHAT, NOTIFICATION } from '../../Model';
import { TenantBottomTabProps } from '../../Navigators/TenantStack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { getChatsByAuthUserAction } from '../../Store/Actions/ChatAction';
import ChatCard from '../../Component/ChatCard';
import LoadingComponent from '../../Component/LoadingComponent';

export type MesssagesScreenNavigationProp = CompositeNavigationProp<
NativeStackNavigationProp<TenantBottomTabProps, "InBoxScreen">,
NativeStackNavigationProp<RootStackParamList>
>;

const MesssagesScreen = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const {users, authUser, userError, userSuccess, message} = useSelector((state: RootState) => state.USERS);
  const {notifications, notificationSuccess, notificationError} = useSelector((state: RootState) => state.NOTIFICATIONS);
  const {chats, chat, chatError, chatSuccess} = useSelector((state: RootState) => state.CHATS);
  const tw = useTailwind();
  const windownWith = useWindowDimensions().width;
  const dispatch = useDispatch();
  const navigation = useNavigation<MesssagesScreenNavigationProp>();

  const loadChats = useCallback(async () => {
      if(authUser) {
          setIsRefreshing(true);
          await dispatch(getChatsByAuthUserAction() as any)
          setIsRefreshing(false)
      }
  }, [authUser, dispatch])

  const handleRenderItem: ListRenderItem<any> = ({item}: {item: CHAT}) => (
      <ChatCard chat={item} authUser={authUser}></ChatCard>
  )

  useEffect(() => {
      setIsLoading(true);
      loadChats().then(() => setIsLoading(false));
  }, [authUser, dispatch])

  if(isLoading) {
    return <LoadingComponent/>
}

return (
  <View style={tw('bg-white flex-1 px-2')}>
      <FlatList
          refreshing={isRefreshing}
          onRefresh={loadChats}
          data={chats}
          keyExtractor={(item: any) => item.id}
          renderItem={handleRenderItem}
          showsVerticalScrollIndicator={false}
      >
      </FlatList>
  </View>
)
}

export default MesssagesScreen

const styles = StyleSheet.create({})