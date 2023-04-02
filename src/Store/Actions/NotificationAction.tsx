import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Dispatch } from "react";
import { ACTION, CategoryPost, HOMEREVIEWFORM } from "../../Model";
import { HOST_URL } from "../store";

export const getNotificationsByTenantAction = () => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token: string | null = await AsyncStorage.getItem("token");
        if(!token) {
            dispatch({
                type: "notification_error",
                payload: "token not found"
            });
        }
        const res = await axios.get(HOST_URL + "/api/notifies/authTenant", {
            headers: {
                Authorization: token 
            }
        });
        const data = await res.data;
        console.log("notifications by tenant");
        console.log(data);
        dispatch({
            type: "get_all_notifications_by_tenant",
            payload: data
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "notification_error",
            payload: err
        });
    }
}
export const getNotificationsByHostAction = () => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token: string | null = await AsyncStorage.getItem("token");
        if(!token) {
            dispatch({
                type: "notification_error",
                payload: "token not found"
            });
        }
        const res = await axios.get(HOST_URL + "/api/notifies/authHost", {
            headers: {
                Authorization: token 
            }
        });
        const data = await res.data;
        console.log(data);
        dispatch({
            type: "get_all_notifications_by_host",
            payload: data
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "notification_error",
            payload: err
        });
    }
}
export const updateReadingNotifyAction = (notificationId: number) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token: string | null = await AsyncStorage.getItem("token");
        if(!token) {
            dispatch({
                type: "notification_error",
                payload: "token not found"
            });
        }
        const res = await axios.put(HOST_URL + "/api/notifies/notify/" + notificationId, {}, {
            headers: {
                Authorization: token 
            }
        });
        const data = await res.data;
        console.log(data);
        dispatch({
            type: "update_reading_status_of_notification",
            payload: data
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "notification_error",
            payload: err
        });
    }
}