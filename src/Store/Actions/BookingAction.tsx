import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Dispatch } from "react";
import { Alert } from "react-native";
import { ACTION, BOOKINGFORM, BOOKINGUPDATE, CategoryPost, DISCOUNTFORM, HOMEREVIEWFORM } from "../../Model";
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
        Alert.alert("request to book successfully");
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
        const res = await axios.put(HOST_URL + "/api/bookings/acceptbooking/" + bookingId, {},  {
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

export const cancelBookingAction= (bookingId: number) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token: string | null = await AsyncStorage.getItem("token");
        if(!token) {
            dispatch({
                type: "booking_error",
                payload: "token not found"
            });
        }
        await axios.delete(HOST_URL + "/api/bookings/booking/" + bookingId,  {
            headers: {
                Authorization: token 
            }
        });
       
        console.log("delete booking")
        dispatch({
            type: "cancel_booking",
            payload: bookingId
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
        const res = await axios.put(HOST_URL + "/api/bookings/unacceptbooking/" + bookingId, {}, {
            headers: {
                Authorization: token 
            }
        });
        const data = await res.data
        console.log(data)
        dispatch({
            type: "unaccept_booking",
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
export const updateBookingAction= (bookingId: number, form: BOOKINGUPDATE) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token: string | null = await AsyncStorage.getItem("token");
        if(!token) {
            dispatch({
                type: "booking_error",
                payload: "token not found"
            });
        }
        console.log(token);
        let urlQuery: string = "";
        urlQuery += "checkInDate=" + form.checkInDate + "&";
        urlQuery += "checkOutDate=" + form.checkOutDate + "&";
        urlQuery += "totalPrice=" + form.totalPrice + "&";
        urlQuery += "days=" + form.days + "&";

        console.log(HOST_URL + `/api/bookings/booking/${bookingId}?checkInDate=${form.checkInDate}&checkOutDate=${form.checkOutDate}&days=${form.days}&totalPrice=${form.totalPrice}`);

        const res = await axios.put(HOST_URL + `/api/bookings/booking/${bookingId}?checkInDate=${form.checkInDate}&checkOutDate=${form.checkOutDate}&days=${form.days}&totalPrice=${form.totalPrice}`, {},  {
            headers: {
                Authorization: token 
            }
        });
        const data = await res.data
        console.log(data)
        dispatch({
            type: "update_booking",
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
export const getUpcomingBookingByTenantAction= (tenantId: number) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token: string | null = await AsyncStorage.getItem("token");
        if(!token) {
            dispatch({
                type: "booking_error",
                payload: "token not found"
            });
        }
        const res = await axios.get(HOST_URL + "/api/bookings/upcomingBookings/tenant/" + tenantId,  {
            headers: {
                Authorization: token 
            }
        });
        const data = await res.data
        console.log(data)
        dispatch({
            type: "get_upcoming_bookings_by_tenant",
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
export const getOldBookingByTenantAction= (tenantId: number) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token: string | null = await AsyncStorage.getItem("token");
        if(!token) {
            dispatch({
                type: "booking_error",
                payload: "token not found"
            });
        }
        const res = await axios.get(HOST_URL + "/api/bookings/oldBookings/tenant/" + tenantId,  {
            headers: {
                Authorization: token 
            }
        });
        const data = await res.data
        console.log(data)
        dispatch({
            type: "get_old_bookings_by_tenant",
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
export const getUpcomingBookingByHostAction= (hostId: number) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token: string | null = await AsyncStorage.getItem("token");
        if(!token) {
            dispatch({
                type: "booking_error",
                payload: "token not found"
            });
        }
        const res = await axios.get(HOST_URL + "/api/bookings/upcomingBookings/host/" + hostId,  {
            headers: {
                Authorization: token 
            }
        });
        const data = await res.data
        console.log(data)
        dispatch({
            type: "get_upcoming_bookings_by_host",
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
export const getOldBookingByHostAction= (hostId: number) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token: string | null = await AsyncStorage.getItem("token");
        if(!token) {
            dispatch({
                type: "booking_error",
                payload: "token not found"
            });
        }
        const res = await axios.get(HOST_URL + "/api/bookings/oldBookings/host/" + hostId,  {
            headers: {
                Authorization: token 
            }
        });
        const data = await res.data
        console.log(data)
        dispatch({
            type: "get_old_bookings_by_host",
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
export const getUpcomingBookingByHomeAction= (homeId: number) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token: string | null = await AsyncStorage.getItem("token");
        if(!token) {
            dispatch({
                type: "booking_error",
                payload: "token not found"
            });
        }
        const res = await axios.get(HOST_URL + "/api/bookings/upcomingBookings/home/" + homeId,  {
            headers: {
                Authorization: token 
            }
        });
        const data = await res.data
        console.log(data)
        dispatch({
            type: "get_upcoming_bookings_by_home",
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
export const getOldBookingByHomeAction= (homeId: number) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token: string | null = await AsyncStorage.getItem("token");
        if(!token) {
            dispatch({
                type: "booking_error",
                payload: "token not found"
            });
        }
        const res = await axios.get(HOST_URL + "/api/bookings/oldBookings/home/" + homeId,  {
            headers: {
                Authorization: token 
            }
        });
        const data = await res.data
        console.log(data)
        dispatch({
            type:  "get_old_bookings_by_home",
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

export const clearBooking= () =>(dispatch: Dispatch<ACTION>, getState: any) => {
    try {
       
        dispatch({
            type: "clear_booking"
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "booking_error",
            payload: err
        });
    }
}