import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Dispatch } from "react";
import { ACTION, CategoryPost, DISCOUNTFORM, HOMEREVIEWFORM } from "../../Model";
import { HOST_URL } from "../store";

export const createDiscountAction= (form: DISCOUNTFORM) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token: string | null = await AsyncStorage.getItem("token");
        if(!token) {
            dispatch({
                type: "discount_error",
                payload: "token not found"
            });
        }
        console.log(token);
        const res = await axios.post(HOST_URL + "/api/discount/", form, {
            headers: {
                Authorization: token 
            }
        });
        const data = await res.data
        console.log(data)
        dispatch({
            type: "create_discount_by_home",
            payload: data
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "discount_error",
            payload: err
        });
    }
}
export const updateDiscountAction= (discountId: number ,form: DISCOUNTFORM) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token: string | null = await AsyncStorage.getItem("token");
        if(!token) {
            dispatch({
                type: "discount_error",
                payload: "token not found"
            });
        }
        console.log(token);
        const res = await axios.put(HOST_URL + "/api/discount/id/" + discountId, form, {
            headers: {
                Authorization: token 
            }
        });
        const data = await res.data
        console.log(data)
        dispatch({
            type: "update_discount_by_home",
            payload: data
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "discount_error",
            payload: err
        });
    }
}
