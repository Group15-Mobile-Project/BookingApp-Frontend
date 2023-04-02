import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Dispatch } from "react";
import { ACTION, BOOKINGFORM, CategoryPost, DISCOUNTFORM, HOMEREVIEWFORM } from "../../Model";
import { HOST_URL } from "../store";

export const createBookingAction= (form: BOOKINGFORM) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token: string | null = await AsyncStorage.getItem("token");
        if(!token) {
            dispatch({
                type: "booking_error",
                payload: "token not found"
            });
        }
        const res = await axios.post(HOST_URL + "/api/bookings/booking", form, {
            headers: {
                Authorization: token 
            }
        });
        const data = await res.data
        console.log(data)
        dispatch({
            type: "create_booking",
            payload: data
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "booking_error",
            payload: err
        });
    }
}

export const getCountDiscountAction= (homeId: number, checkin: string, checkout: string) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token: string | null = await AsyncStorage.getItem("token");
        if(!token) {
            dispatch({
                type: "booking_error",
                payload: "token not found"
            });
        }
        const res = await axios.get(HOST_URL + `/api/bookings/home/${homeId}/checkin/${checkin}/checkout/${checkout}`,  {
            headers: {
                Authorization: token 
            }
        });
        const data = await res.data
        console.log(data)
        dispatch({
            type: "get_count_discount_for_booking",
            payload: data
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "booking_error",
            payload: err
        });
    }
}

export const acceptBookingAction= (bookingId: number) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token: string | null = await AsyncStorage.getItem("token");
        if(!token) {
            dispatch({
                type: "booking_error",
                payload: "token not found"
            });
        }
        const res = await axios.put(HOST_URL + "/api/bookings/acceptbooking/" + bookingId,  {
            headers: {
                Authorization: token 
            }
        });
        const data = await res.data
        console.log(data)
        dispatch({
            type: "accept_booking",
            payload: data
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "booking_error",
            payload: err
        });
    }
}

export const unacceptBookingAction= (bookingId: number) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token: string | null = await AsyncStorage.getItem("token");
        if(!token) {
            dispatch({
                type: "booking_error",
                payload: "token not found"
            });
        }
        const res = await axios.put(HOST_URL + "/api/bookings/unacceptbooking/" + bookingId,  {
            headers: {
                Authorization: token 
            }
        });
        const data = await res.data
        console.log(data)
        dispatch({
            type: "accept_booking",
            payload: data
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "booking_error",
            payload: err
        });
    }
}

export const getBookingByIdAction= (bookingId: number) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token: string | null = await AsyncStorage.getItem("token");
        if(!token) {
            dispatch({
                type: "booking_error",
                payload: "token not found"
            });
        }
        const res = await axios.get(HOST_URL + "/api/bookings/booking/" + bookingId,  {
            headers: {
                Authorization: token 
            }
        });
        const data = await res.data
        console.log(data)
        dispatch({
            type: "get_booking_by_id",
            payload: data
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "booking_error",
            payload: err
        });
    }
}