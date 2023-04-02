import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Dispatch } from "react";
import { ACTION, CategoryPost, HOMEREVIEWFORM } from "../../Model";
import { HOST_URL } from "../store";

export const getBookdatesByHomeAction= (homeId: number) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token: string | null = await AsyncStorage.getItem("token");
        if(!token) {
            dispatch({
                type: "bookdate_error",
                payload: "token not found"
            });
        }
        const res = await axios.get(HOST_URL + "/api/bookdates/home/" + homeId, {
            headers: {
                Authorization: token 
            }
        });
        const data = await res.data;
        console.log(data);
        dispatch({
            type: "get_all_bookdates_by_home",
            payload: data
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "bookdate_error",
            payload: err
        });
    }
}

export const getBookdatesByBookingAction= (bookingId: number) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token: string | null = await AsyncStorage.getItem("token");
        if(!token) {
            dispatch({
                type: "bookdate_error",
                payload: "token not found"
            });
        }
        const res = await axios.get(HOST_URL + "/api/bookdates/booking/" + bookingId, {
            headers: {
                Authorization: token 
            }
        });
        const data = await res.data
        console.log(data)
        dispatch({
            type: "get_all_bookdates_by_booking",
            payload: data
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "bookdate_error",
            payload: err
        });
    }
}

export const getBookdatesByAuthHostAction= () => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token: string | null = await AsyncStorage.getItem("token");
        if(!token) {
            dispatch({
                type: "bookdate_error",
                payload: "token not found"
            });
        }
        const res = await axios.get(HOST_URL + "/api/bookdates/authUser/upcoming", {
            headers: {
                Authorization: token 
            }
        });
        const data = await res.data
        console.log(data)
        dispatch({
            type: "get_all_bookdates_by_authHost",
            payload: data
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "bookdate_error",
            payload: err
        });
    }
}

export const getBookdatesByHomeAndCurrentTimeAction= (homeId: number) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token: string | null = await AsyncStorage.getItem("token");
        if(!token) {
            dispatch({
                type: "bookdate_error",
                payload: "token not found"
            });
        }
        const res = await axios.get(HOST_URL + "/api/bookdates/homeOfUpcomingTime/" + homeId, {
            headers: {
                Authorization: token 
            }
        });
        console.log("get bookdates");
        const data = await res.data
        console.log(data)
        dispatch({
            type: "get_all_bookdates_by_home_follow_currentTime",
            payload: data
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "bookdate_error",
            payload: err
        });
    }
}

export const clearBookdates= () => (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        dispatch({
            type: "clear_bookdates"
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "bookdate_error",
            payload: err
        });
    }
}



