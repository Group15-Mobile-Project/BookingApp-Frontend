import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { CHAT, NOTIFICATION, PARTICIPANT, USER } from '../Model'
import { useDispatch } from 'react-redux'
import { useTailwind } from 'tailwind-rn/dist'
import { Button, Image } from '@rneui/base'
import { HOST_URL } from '../Store/store'
import { Pressable } from 'react-native'
import { updateReadingNotifyAction } from '../Store/Actions/NotificationAction'
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native'
import { TenantBottomTabProps } from '../Navigators/TenantStack'
import { RootStackParamList } from '../Navigators/MainStack'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { TouchableOpacity } from 'react-native'
import { updateReadStatusOfChatAction } from '../Store/Actions/ChatAction'
import { MesssagesScreenNavigationProp } from '../Screens/Tenant/MesssagesScreen'

const imageDefault =[
  "wallpaper.jpg_a776d37b-97c9-4bd6-b4ca-1f342de06161",
  "Cabin-in-the-city-Best-Airbnbs-in-Ontario-819x1024.jpeg_89abc5d3-cd57-4fae-92ed-96bb77daf640",
  "dormir-dans-une-ferme-en-suède-best-airbnb-in-south-sweden-main.jpg_c83de24f-f4d0-4367-96ef-96d261a99e94"
];

const ChatCard = ({authUser, chat}: {authUser: USER, chat: CHAT}) => {
  const tw = useTailwind();
  const dispatch = useDispatch();
  const [receiver, setReceiver] =  useState<PARTICIPANT | null>(null);
  const [authParticipant, setAuthParticipant] =  useState<PARTICIPANT | null>(null);
  const navigation = useNavigation<MesssagesScreenNavigationProp>();

  useEffect(() => {
    if(chat) {
      let participant1: PARTICIPANT = chat?.participants[0];
      let participant2: PARTICIPANT = chat?.participants[1];
      if(authUser?.id == participant1?.user?.id) {
        setReceiver(participant2);
        setAuthParticipant(participant1);
      }else {
        setReceiver(participant1);
        setAuthParticipant(participant2);
      }
    }
  }, [chat])

  const navigateToConversationScreen = () => {
    if(authParticipant?.read == false) {
      dispatch(updateReadStatusOfChatAction(chat?.id) as any);
    }
    navigation.navigate("ConversationScreen", {chatId: chat?.id});
  }

return (
  <TouchableOpacity onPress={navigateToConversationScreen} activeOpacity={0.3} style={tw('w-full border-b border-gray-300 flex-row items-center justify-between px-6 py-2')}>
    <Image source={{uri: HOST_URL + "/api/images/image/" + receiver?.user?.imgUrls}} style={[tw('rounded-full mr-4'), {width: 70, height: 70, resizeMode: 'cover'}]}></Image>   
    {chat?.lastMessage && (
      <View style={tw('flex-1 items-start justify-start')}>
        <Text style={tw('text-lg font-bold')}>{receiver?.user?.username}</Text>
        <Text style={tw(`text-base ${authParticipant?.read ? "text-gray-400" : "text-black font-bold"}`)}>{chat?.lastMessage?.participant?.id == authParticipant?.id ? "You: " : ""}{chat?.lastMessage?.content}  - {chat?.lastMessage && new Date(chat?.lastMessage?.dateCreated ).toLocaleString('en-us',{ day: 'numeric', month:'short'})} </Text>
      </View>
    )}
</TouchableOpacity>
)
}

export default ChatCard

const styles = StyleSheet.create({})