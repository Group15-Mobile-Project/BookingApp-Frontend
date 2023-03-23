import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Dispatch } from "react";
import { ACTION, CategoryPost, HOMEREVIEWFORM } from "../../Model";
import { HOST_URL } from "../store";

export const getReviewsByHomeAction= (homeId: number) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const res = await axios.get(HOST_URL + "/api/homeReviews/home/" + homeId);
        const data = await res.data
        console.log(data)
        dispatch({
            type: "get_all_reviews_by_home",
            payload: data
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "review_error",
            payload: err
        });
    }
}
export const getReviewsByHomeAndQueryAction= (homeId: number, query: string) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const res = await axios.get(HOST_URL + "/api/homeReviews/home/" + homeId + "/search?query=" + query);
        const data = await res.data
        console.log(data)
        dispatch({
            type: "get_all_reviews_by_home_and_querySearch",
            payload: data
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "review_error",
            payload: err
        });
    }
}
export const getReviewByIdAction= (reviewId: number) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const res = await axios.get(HOST_URL + "/api/homeReviews/review/" + reviewId);
        const data = await res.data
        console.log(data)
        dispatch({
            type: "get_review_by_id",
            payload: data
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "review_error",
            payload: err
        });
    }
}
export const getReviewByHomeAndUserAction= (homeId: number, userId: number) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token: string | null = await AsyncStorage.getItem("token");
        if(!token) {
            dispatch({
                type: "review_error",
                payload: "token not found"
            });
        }
        const res = await axios.get(HOST_URL + "/api/homeReviews/home/" + homeId + "/user/" + userId, {
            headers: {
                Authorization: token 
            }
        });
        const data = await res.data
        console.log(data)
        dispatch({
            type: "get_review_by_authUser_and_home",
            payload: data
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "review_error",
            payload: err
        });
    }
}
export const addHomeReviewAction= (reviewForm: HOMEREVIEWFORM) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token: string | null = await AsyncStorage.getItem("token");
        if(!token) {
            dispatch({
                type: "review_error",
                payload: "token not found"
            });
        }
        const res = await axios.post(HOST_URL + "/api/homeReviews/review", reviewForm, {
            headers: {
                Authorization: token 
            }
        });
        const data = await res.data
        console.log(data)
        dispatch({
            type: "add_home_review",
            payload: data
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "review_error",
            payload: err
        });
    }
}