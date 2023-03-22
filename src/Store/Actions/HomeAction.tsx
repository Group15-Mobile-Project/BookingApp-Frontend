import AsyncStorage from "@react-native-async-storage/async-storage"
import { Dispatch } from "react";
import { Alert } from "react-native";
import { HOST_URL } from "../store";
import axios from "axios";
import { ACTION, CHANGEPASSWORD, HomePost, HomeUpdate, LoginForm, USER, UserRegisterForm } from "../../Model";

export const getHomesAction = () => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const res = await axios.get(HOST_URL + "/api/homes/all");
        const data = await res.data
        console.log(data)
        dispatch({
            type: "get_homes",
            payload: data
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "home_error",
            payload: err
        });
    }
}
export const getHomesByCategoryAction = (categoryId: number) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const res = await axios.get(HOST_URL + "/api/homes/category/" + categoryId);
        const data = await res.data
        console.log(data)
        dispatch({
            type: "get_homes_by_category_id",
            payload: data
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "home_error",
            payload: err
        });
    }
}
export const getHomesByCityAction = (city: string) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const res = await axios.get(HOST_URL + "/api/homes/city/" + city);
        const data = await res.data
        console.log(data)
        dispatch({
            type: "get_homes_by_city",
            payload: data
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "home_error",
            payload: err
        });
    }
}
export const getHomesByHostAction = (hostId: number) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const res = await axios.get(HOST_URL + "/api/homes/host/" + hostId);
        const data = await res.data
        console.log(data)
        dispatch({
            type: "get_homes_by_host_id",
            payload: data
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "home_error",
            payload: err
        });
    }
}
export const getHomesByHomeIdAction = (homeId: number) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const res = await axios.get(HOST_URL + "/api/homes/home/" + homeId);
        const data = await res.data
        console.log(data)
        dispatch({
            type: "get_homes_by_home_id",
            payload: data
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "home_error",
            payload: err
        });
    }
}
export const getHomesBySearchQueryAction = (city: string, startDay: string, closeDay: string, capacity: number) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const res = await axios.get(HOST_URL + `/api/homes/search?city=${city.toLowerCase()}&startDay=${startDay}&closeDay=${closeDay}&capacity=${capacity}`);
        const data = await res.data
        console.log(data)
        dispatch({
            type: "get_homes_by_search_query",
            payload: data
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "home_error",
            payload: err
        });
    }
}
export const getHomesByAuthUserAction = () => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token: string | null = await AsyncStorage.getItem("token");
        if(!token) {
            dispatch({
                type: "home_error",
                payload: "token not found"
            });
        }
        const res = await axios.get(HOST_URL + "/api/homes/authUser", {
            headers: {
                Authorization: token 
            }
        });
        const data = await res.data
        console.log(data)
        dispatch({
            type: "get_homes_by_authUser",
            payload: data
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "home_error",
            payload: err
        });
    }
}
export const saveHomeAction = (home: HomePost) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token: string | null = await AsyncStorage.getItem("token");
        if(!token) {
            dispatch({
                type: "home_error",
                payload: "token not found"
            });
        }
        const res = await axios.post(HOST_URL + "/api/homes/home/", home,{
            headers: {
                Authorization: token 
            }
        });
        const data = await res.data
        console.log(data)
        dispatch({
            type: "save_home",
            payload: data
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "home_error",
            payload: err
        });
    }
}
export const updateHomeAction = (homeId: number, home: HomeUpdate) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token: string | null = await AsyncStorage.getItem("token");
        if(!token) {
            dispatch({
                type: "home_error",
                payload: "token not found"
            });
        }
        let urlQuery: string = "";
        if(home.bedrooms) {
            urlQuery += "bedrooms=" + home.bedrooms + "&";
        }
        if(home.beds) {
            urlQuery += "beds=" + home.beds + "&";
        }
        if(home.price) {
            urlQuery += "price=" + home.price + "&";
        }
        if(home.closeBooking) {
            urlQuery += "closeBooking=" + home.closeBooking + "&";
        }
        if(home.capacity) {
            urlQuery += "capacity=" + home.capacity + "&";
        }
        if(home.imgUrls) {
            for(let i = 0; i < home.imgUrls.length; i++) {
                urlQuery += "imgUrls=" + home.imgUrls[i] + "&";
            }
        }
        const res = await axios.put(HOST_URL + "/api/homes/home/" + homeId + "?" + urlQuery, {
            headers: {
                Authorization: token 
            }
        });
        const data = await res.data
        console.log(data)
        dispatch({
            type: "update_home",
            payload: data
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "home_error",
            payload: err
        });
    }
}
 