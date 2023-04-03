import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { CHAT, CHATMESSAGE, NOTIFICATION, PARTICIPANT, USER } from '../Model'
import { useDispatch, useSelector } from 'react-redux'
import { useTailwind } from 'tailwind-rn/dist'
import { Button, Image } from '@rneui/base'
import { HOST_URL, RootState } from '../Store/store'
import { Pressable } from 'react-native'
import { updateReadingNotifyAction } from '../Store/Actions/NotificationAction'
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native'
import { TenantBottomTabProps } from '../Navigators/TenantStack'
import { RootStackParamList } from '../Navigators/MainStack'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { TouchableOpacity } from 'react-native'
import { updateReadStatusOfChatAction } from '../Store/Actions/ChatAction'
import { MesssagesScreenNavigationProp } from '../Screens/Tenant/MesssagesScreen'
import { deleteChatMessageAction } from '../Store/Actions/MessageAction'

const imageDefault =[
  "wallpaper.jpg_a776d37b-97c9-4bd6-b4ca-1f342de06161",
  "Cabin-in-the-city-Best-Airbnbs-in-Ontario-819x1024.jpeg_89abc5d3-cd57-4fae-92ed-96bb77daf640",
  "dormir-dans-une-ferme-en-suède-best-airbnb-in-south-sweden-main.jpg_c83de24f-f4d0-4367-96ef-96d261a99e94"
];

const MessageItem = ({message}: {message: CHATMESSAGE}) => {
    const tw = useTailwind()
    const dispatch = useDispatch()
    const [isDelete, setIsDelete] = useState<boolean>(false)
    const {authUser, userSuccess, userError} = useSelector((state: RootState) => state.USERS)
    const [isAuthUser, setIsAuthUser] =  useState<boolean>(message?.participant?.user?.id == authUser.id ? true: false)

    const deleteMessageFunction = async () => {
        if(message) {
            await dispatch(deleteChatMessageAction(message?.id) as any)
        }
    }

  return (
    <>
        {isAuthUser ? (
            <View style={tw('w-full')}>
                <View style={[tw('w-2/3 my-2  flex flex-row items-center justify-end'), {alignSelf: 'flex-end'}]}>
                    <TouchableOpacity onPress={() => setIsDelete(!isDelete )} style={tw('p-2 rounded-lg bg-gray-300')}>
                        <Text style={tw('text-base text-black')}>{message?.content}</Text>
                    </TouchableOpacity>
                    <Image source={{uri: HOST_URL + "/api/images/image/" + imageDefault[0]}} style={[tw('rounded-full ml-2 mr-2'), {width: 40, height: 40, resizeMode: 'cover'}]}></Image>  
                </View>
                {isDelete && (
                    <View style={[tw('w-2/3 my-2 mr-10 px-4 flex flex-row items-center justify-end'), {alignSelf: 'flex-end'}]}>
                        <Button onPress={deleteMessageFunction} title="delete" buttonStyle={tw(' bg-red-500 rounded-lg w-20 h-10')}></Button>
                    </View>
                )}
            </View>
        ) : (
            <View style={tw('w-full')}>
                <View style={[tw('w-2/3 my-2 flex flex-row items-center justify-start'), {alignSelf: 'flex-start'}]}>
                    <Image source={{uri: HOST_URL + "/api/images/image/" + imageDefault[0]}} style={[tw('rounded-full ml-2 mr-2'), {width: 40, height: 40, resizeMode: 'cover'}]}></Image>  
                    <TouchableOpacity onPress={() => setIsDelete(!isDelete )} style={tw('p-2 rounded-lg bg-gray-300')}>
                        <Text style={tw('text-base text-black')}>{message?.content}</Text>
                    </TouchableOpacity>
                </View>
                {isDelete && (
                    <View style={[tw('w-2/3 my-2 ml-10 px-4 flex flex-row items-center justify-start'), {alignSelf: 'flex-start'}]}>
                        <Button onPress={deleteMessageFunction} title="delete" buttonStyle={tw(' bg-red-500 rounded-lg w-20 h-10')}></Button>
                    </View>
                )}
            </View>
        )}
    </>
  )
}

export default MessageItem

const styles = StyleSheet.create({})