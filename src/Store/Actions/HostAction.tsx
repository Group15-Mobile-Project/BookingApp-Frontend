import AsyncStorage from "@react-native-async-storage/async-storage"
import { Dispatch } from "react";
import { Alert } from "react-native";
import { HOST_URL } from "../store";
import axios from "axios";
import { ACTION, CHANGEPASSWORD, HomePost, HomeUpdate, LoginForm, USER, UserRegisterForm } from "../../Model";


export const getHostByIdAction = (hostId: number) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const res = await axios.get(HOST_URL + "/api/hosts/host/" + hostId);
        const data = await res.data
        console.log(data)
        dispatch({
            type: "get_host_by_id",
            payload: data
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "host_error",
            payload: err
        });
    }
}

export const getHostByAuthUser = () => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token: string | null = await AsyncStorage.getItem("token");
        if(!token) {
            dispatch({
                type: "host_error",
                payload: "token not found"
            });
        }
        const res = await axios.get(HOST_URL + "/api/hosts/authUser", {
            headers: {
                Authorization: token 
            }
        });
        const data = await res.data
        console.log(data)
        dispatch({
            type: "get_host_by_authUser",
            payload: data
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "host_error",
            payload: err
        });
    }
}
export const getAllHosts = () => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token: string | null = await AsyncStorage.getItem("token");
        if(!token) {
            dispatch({
                type: "host_error",
                payload: "token not found"
            });
        }
        const res = await axios.get(HOST_URL + "/api/hosts/all", {
            headers: {
                Authorization: token 
            }
        });
        const data = await res.data
        console.log(data)
        dispatch({
            type: "get_all_hosts",
            payload: data
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "host_error",
            payload: err
        });
    }
}

export const getAllHostsByName = (hostName: string) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token: string | null = await AsyncStorage.getItem("token");
        if(!token) {
            dispatch({
                type: "host_error",
                payload: "token not found"
            });
        }
        const res = await axios.get(HOST_URL + "/api/hosts/hostName/" + hostName, {
            headers: {
                Authorization: token 
            }
        });
        const data = await res.data
        console.log(data)
        dispatch({
            type: "get_all_hosts_by_name",
            payload: data
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "host_error",
            payload: err
        });
    }
}
