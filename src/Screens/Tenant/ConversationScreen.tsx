import { Alert, ScrollView, StyleSheet, Text, Touchable, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React, { useCallback, useEffect, useState, useRef, useLayoutEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { HOST_URL, RootState } from '../../Store/store';
import { RootStackParamList } from '../../Navigators/MainStack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute, CompositeNavigationProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { ListRenderItem, FlatList } from 'react-native';
import { useTailwind } from 'tailwind-rn/dist'
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Button } from '@rneui/base';
import { HomesStackParamList } from '../../Navigators/HomesStack';
import { getNotificationsByTenantAction } from '../../Store/Actions/NotificationAction';
import NotificationCard from '../../Component/NotificationCard';
import { CHAT, CHATMESSAGE, NOTIFICATION, USER } from '../../Model';
import { TenantBottomTabProps } from '../../Navigators/TenantStack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { getChatByAuthUserAndReceiverAction, getChatByIdAction, getChatsByAuthUserAction } from '../../Store/Actions/ChatAction';
import ChatCard from '../../Component/ChatCard';
import { addChatMessageAction, clearMessagesAction, getAllMessagesByChatIdAction } from '../../Store/Actions/MessageAction';
import MessageItem from '../../Component/MessageItem';
import { KeyboardAvoidingView } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native';
import { Keyboard } from 'react-native';
import { TextInput } from 'react-native';
import { Image } from 'react-native';
import LoadingComponent from '../../Component/LoadingComponent';

const imageDefault =[
    "wallpaper.jpg_a776d37b-97c9-4bd6-b4ca-1f342de06161",
    "Cabin-in-the-city-Best-Airbnbs-in-Ontario-819x1024.jpeg_89abc5d3-cd57-4fae-92ed-96bb77daf640",
    "dormir-dans-une-ferme-en-suède-best-airbnb-in-south-sweden-main.jpg_c83de24f-f4d0-4367-96ef-96d261a99e94"
];

export type ConversationScreenNavigationProp = CompositeNavigationProp<
NativeStackNavigationProp<RootStackParamList, "ConversationScreen">,
BottomTabNavigationProp<TenantBottomTabProps>
>;
type ConversationScreenRouteProp = RouteProp<RootStackParamList, "ConversationScreen">;


const ConversationScreen = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const {users, authUser, userError, userSuccess, message} = useSelector((state: RootState) => state.USERS);
    const {chats, chat, chatError, chatSuccess} = useSelector((state: RootState) => state.CHATS);
    const {chatMessage, chatMessages, chatMessageSuccess, chatMessageError} = useSelector((state: RootState) => state.CHATMESSAGES);
    const tw = useTailwind();
    const windownWith = useWindowDimensions().width;
    const dispatch = useDispatch();
    const navigation = useNavigation<ConversationScreenNavigationProp>();
    const {params} = useRoute<ConversationScreenRouteProp>();
    const {chatId, receiverId} = params;
    const scrollRef = useRef<FlatList>(null)
    const height: number = useWindowDimensions().height
    const [messageInput, setMessageInput] = useState<string>("")
    const [receiver, setReceiver] = useState<USER | null>(null)
  
    const loadChatMessages = useCallback(async () => {
        if( chat) {
            setIsRefreshing(true);
            dispatch(clearMessagesAction() as any);
            await dispatch(getAllMessagesByChatIdAction(chat?.id) as any);
            setIsRefreshing(false);
        }
    }, [ dispatch, chat])

    const loadChat = useCallback(async () => {
        if(authUser && chatId) {
            setIsRefreshing(true);
            await dispatch(getChatByIdAction(chatId) as any);
            setIsRefreshing(false);
        }
        if(authUser && receiverId) {
            setIsRefreshing(true);
            await dispatch(getChatByAuthUserAndReceiverAction(receiverId) as any);
            setIsRefreshing(false);
        }
    }, [authUser, dispatch, chatId, receiverId])
  
    const handleRenderItem: ListRenderItem<any> = ({item}: {item: CHATMESSAGE}) => (
        <MessageItem message={item}></MessageItem>
    )

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: () => 
                <>
                    {receiver && 
                    <View style={tw('flex-row items-center')}>
                        <Image source={{uri: HOST_URL + "/api/images/image/" + imageDefault[0]}} style={[tw('rounded-full mr-2'), {width: 40, height: 40, resizeMode: 'cover'}]}></Image>
                        <Text style={tw('text-lg text-black')}>{receiver?.username}</Text>
                    </View>
                    }
                </>     
        })
    }, [chat])
  
    useEffect(() => {
        setIsLoading(true);
        console.log("authuser : " + authUser?.id)
        loadChat().then(() => loadChatMessages()).then(() => setIsLoading(false));
        if(chat && chat.participants) {
            setReceiver(chat?.participants[0].user?.id == authUser.id ? chat.participants[1].user : chat.participants[0].user)
          }
    }, [authUser, dispatch, chatId, receiverId])

    useEffect(() => {
        scrollRef?.current?.scrollToEnd()
    }, [chatMessages])

    // useEffect(() => {
    //     if(chat) {
    //       setReceiver(chat?.participants[0].user?.id == authUser.id ? chat.participants[1].user : chat.participants[0].user)
    //     }
    // }, [chat, chatId, dispatch])
    
  

    const addMessageFunction = async () => {
        const messageForm = {
          content: messageInput,
          chatId: chat?.id
        };
        await dispatch(addChatMessageAction(messageForm) as any);
        setMessageInput("");
    }
    
    if(isLoading) {
        return <LoadingComponent/>
    }
  return (
    <View style={tw('bg-white flex-1 px-2')}>
        <FlatList
            refreshing={isRefreshing}
            onRefresh={loadChatMessages}
            data={chatMessages}
            keyExtractor={(item: any) => item.id}
            renderItem={handleRenderItem}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={30}
            initialScrollIndex={0}
            onContentSizeChange={() => scrollRef?.current?.scrollToEnd()}
            style={[{height: height - 90}]}
            inverted
        >
        </FlatList>
        <KeyboardAvoidingView >
            <TouchableWithoutFeedback  onPress={Keyboard.dismiss}>         
                <>
                    <View style={tw('w-full py-2 flex-row items-center justify-center')}>
                        {authUser && <Image style={[tw('w-10 h-10 rounded-full bg-white ml-2 mr-2'), {resizeMode: 'contain'}]} source={{uri: HOST_URL + "/api/images/image/" + imageDefault[0]}}></Image>}
                        <TextInput value={messageInput} onChangeText={(text: string) => setMessageInput(text)} placeholder='your comment'  style={tw('flex-1  text-base bg-gray-300 rounded-full py-2 px-6')} ></TextInput>
                        <TouchableOpacity onPress={addMessageFunction}  style={tw('mx-2')}>
                            <Ionicons name="send-sharp" size={24} color="#3b82f6" />
                        </TouchableOpacity>
                    </View>
                </>
            </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  )
}

export default ConversationScreen

const styles = StyleSheet.create({})