import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Dispatch } from "react";
import { ACTION, CategoryPost, HOMEREVIEWFORM, TenantReviewForm } from "../../Model";
import { HOST_URL } from "../store";

export const getTenantReviewsByTenant= (tenantId: number) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const res = await axios.get(HOST_URL + "/api/tenantReviews/tenant/" + tenantId);
        const data = await res.data
        console.log(data)
        dispatch({
            type: "get_all_tenantReviews_by_tenant",
            payload: data
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "tenantReview_error",
            payload: err
        });
    }
}

export const getTenantReviewById= (tenantReviewId: number) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token: string | null = await AsyncStorage.getItem("token");
        if(!token) {
            dispatch({
                type: "tenantReview_error",
                payload: "token not found"
            });
        }
        const res = await axios.get(HOST_URL + "/api/tenantReviews/review/" + tenantReviewId, {
            headers: {
                Authorization: token 
            }
        });
        const data = await res.data
        console.log(data)
        dispatch({
            type: "get_tenantReview_by_id",
            payload: data
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "tenantReview_error",
            payload: err
        });
    }
}

export const getTenantReviewByHostAndTenant= ( hostId: number, tenantId: number) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token: string | null = await AsyncStorage.getItem("token");
        if(!token) {
            dispatch({
                type: "tenantReview_error",
                payload: "token not found"
            });
        }
        const res = await axios.get(HOST_URL + "/api/tenantReviews/tenant/" + tenantId + "/host/" + hostId, {
            headers: {
                Authorization: token 
            }
        });
        console.log("tenant review from host");
        const data = await res.data
        console.log(data)
        dispatch({
            type: "get_tenantReview_by_Host_and_tenant",
            payload: data
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "tenantReview_error",
            payload: err
        });
    }
}

export const addTenantReview= (form: TenantReviewForm) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token: string | null = await AsyncStorage.getItem("token");
        if(!token) {
            dispatch({
                type: "tenantReview_error",
                payload: "token not found"
            });
        }
        const res = await axios.post(HOST_URL + "/api/tenantReviews/review", form, {
            headers: {
                Authorization: token 
            }
        });
        const data = await res.data;
        console.log(data);
        dispatch({
            type: "add_tenantReview",
            payload: data
        });
    } catch (err) {
        console.log(err);
        dispatch({
            type: "tenantReview_error",
            payload: err
        });
    }
}

