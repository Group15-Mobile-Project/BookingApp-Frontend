import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Dispatch } from "react";
import { ACTION, CategoryPost, HOMEREVIEWFORM, MESSAGEFORM } from "../../Model";
import { HOST_URL } from "../store";

export const getAllMessagesByChatIdAction= (chatId: number) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token: string | null = await AsyncStorage.getItem("token");
        if(!token) {
            dispatch({
                type: "chatMessage_error",
                payload: "token not found"
            });
        }
        const res = await axios.get(HOST_URL + "/api/messages/chat/" + chatId, {
            headers: {
                Authorization: token 
            }
        });
        const data = await res.data;
        console.log("get messages of chat");
        console.log(data);
        dispatch({
            type:  "get_all_chatMessages_by_chatId",
            payload: data
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "chatMessage_error",
            payload: err
        });
    }
}
export const addChatMessageAction = (form: MESSAGEFORM) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token: string | null = await AsyncStorage.getItem("token");
        if(!token) {
            dispatch({
                type: "chatMessage_error",
                payload: "token not found"
            });
        }
        const res = await axios.post(HOST_URL + "/api/messages/message", form, {
            headers: {
                Authorization: token 
            }
        });
        const data = await res.data;
        console.log(data);
        dispatch({
            type:  "add_chatMessage_to_chat",
            payload: data
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "chatMessage_error",
            payload: err
        });
    }
}
export const deleteChatMessageAction = (messageId: number) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token: string | null = await AsyncStorage.getItem("token");
        if(!token) {
            dispatch({
                type: "chatMessage_error",
                payload: "token not found"
            });
        }
        await axios.delete(HOST_URL + "/api/messages/message/" + messageId,  {
            headers: {
                Authorization: token 
            }
        });
        console.log("delete data");
        dispatch({
            type:  "delete_chatMessage_by_id",
            payload: messageId
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "chatMessage_error",
            payload: err
        });
    }
}
export const clearMessagesAction = () =>  (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        dispatch({
            type:  "clear_messages"
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "chatMessage_error",
            payload: err
        });
    }
}