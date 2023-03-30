import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Dispatch } from "react";
import { ACTION, CategoryPost, HOMEREVIEWFORM } from "../../Model";
import { HOST_URL } from "../store";

export const getWishlistByAuthUserAction= () => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token: string | null = await AsyncStorage.getItem("token");
        if(!token) {
            dispatch({
                type: "wishlist_error",
                payload: "token not found"
            });
        }
        const res = await axios.get(HOST_URL + "/api/wishlists/authUser", {
            headers: {
                Authorization: token 
            }
        });
        const data = await res.data
        console.log(data)
        dispatch({
            type: "get_all_wishlists_by_authUser",
            payload: data
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "wishlist_error",
            payload: err
        });
    }
}

export const getWishlistByHomeAction= (homeId: number) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token: string | null = await AsyncStorage.getItem("token");
        if(!token) {
            dispatch({
                type: "wishlist_error",
                payload: "token not found"
            });
        }
        const res = await axios.get(HOST_URL + "/api/wishlists/home/" + homeId);
        const data = await res.data
        console.log(data)
        dispatch({
            type: "get_all_wishlists_by_home",
            payload: data
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "wishlist_error",
            payload: err
        });
    }
}

export const addWishlistAction= (homeId: number, userId: number) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token: string | null = await AsyncStorage.getItem("token");
        if(!token) {
            dispatch({
                type: "wishlist_error",
                payload: "token not found"
            });
        }
        console.log("homeId: " + homeId);
        console.log("userId: " + userId);
        console.log("token: " + token);
        console.log(HOST_URL + "/api/wishlists/home/" + homeId + "/user/" + userId)
        const res = await axios.post(HOST_URL + "/api/wishlists/home/" + homeId + "/user/" + userId, {}, {
            headers: {
                Authorization: token 
            }
        });
        const data = await res.data
        console.log(data)
        dispatch({
            type: "add_wishlist",
            payload: data
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "wishlist_error",
            payload: err
        });
    }
}

export const deleteWishlistAction= (id: number) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token: string | null = await AsyncStorage.getItem("token");
        if(!token) {
            dispatch({
                type: "wishlist_error",
                payload: "token not found"
            });
        }
        await axios.delete(HOST_URL + "/api/wishlists/wishlist/" + id, {
            headers: {
                Authorization: token 
            }
        });
        
        dispatch({
            type: "delete_wishlist",
            payload: id
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "wishlist_error",
            payload: err
        });
    }
}