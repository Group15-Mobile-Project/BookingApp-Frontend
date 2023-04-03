import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Dispatch } from "react";
import { ACTION, CategoryPost, HOMEREVIEWFORM } from "../../Model";
import { HOST_URL } from "../store";

export const getChatsByAuthUserAction= () => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token: string | null = await AsyncStorage.getItem("token");
        if(!token) {
            dispatch({
                type: "chat_error",
                payload: "token not found"
            });
        }
        const res = await axios.get(HOST_URL + "/api/chats/authUser", {
            headers: {
                Authorization: token 
            }
        });
        const data = await res.data;
        console.log(data);
        dispatch({
            type:  "get_all_chats_by_authUser",
            payload: data
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "chat_error",
            payload: err
        });
    }
}
export const getChatByAuthUserAndReceiverAction= (receiverId: number) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token: string | null = await AsyncStorage.getItem("token");
        if(!token) {
            dispatch({
                type: "chat_error",
                payload: "token not found"
            });
        }
        const res = await axios.get(HOST_URL + "/api/chats/authUser/receiver/" + receiverId, {
            headers: {
                Authorization: token 
            }
        });
        const data = await res.data;
        console.log(data);
        dispatch({
            type:  "get_chat_by_authUser_and_receiver",
            payload: data
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "chat_error",
            payload: err
        });
    }
}
export const getChatByIdAction= (chatId: number) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token: string | null = await AsyncStorage.getItem("token");
        if(!token) {
            dispatch({
                type: "chat_error",
                payload: "token not found"
            });
        }
        const res = await axios.get(HOST_URL + "/api/chats/chat/" + chatId, {
            headers: {
                Authorization: token 
            }
        });
        console.log("get chat by chatId");
        const data = await res.data;
        console.log(data);
        dispatch({
            type:  "get_chat_by_id",
            payload: data
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "chat_error",
            payload: err
        });
    }
}
export const updateReadStatusOfChatAction= (chatId: number) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token: string | null = await AsyncStorage.getItem("token");
        if(!token) {
            dispatch({
                type: "chat_error",
                payload: "token not found"
            });
        }
        const res = await axios.put(HOST_URL + `/api/chats/chat/${chatId}/readStatus`, {}, {
            headers: {
                Authorization: token 
            }
        });
        const data = await res.data;
        console.log(data);
        dispatch({
            type:  "update_reading_status_of_chat",
            payload: data
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "chat_error",
            payload: err
        });
    }
}