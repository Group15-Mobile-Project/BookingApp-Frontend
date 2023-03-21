import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Dispatch } from "react";
import { ACTION, CategoryPost } from "../../Model";
import { HOST_URL } from "../store";

export const getCategoriesAction= () => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const res = await axios.get(HOST_URL + "/api/homeCategories/all");
        const data = await res.data
        console.log(data)
        dispatch({
            type: "get_categories",
            payload: data
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "category_error",
            payload: err
        });
    }
}
export const getCategoryByIdAction= (categoryid: string) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const res = await axios.get(HOST_URL + "/api/homeCategories/category/" + categoryid);
        const data = await res.data
        console.log(data)
        dispatch({
            type: "get_category_by_id",
            payload: data
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "category_error",
            payload: err
        });
    }
}
export const saveCategoryAction= (category: CategoryPost) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token: string | null = await AsyncStorage.getItem("token");
        if(!token) {
            dispatch({
                type: "category_error",
                payload: "token not found"
            });
        }
        const res = await axios.post(HOST_URL + "/api/homeCategories/", category, {
            headers: {
                Authorization: token 
            }
        });
        const data = await res.data
        console.log(data)
        dispatch({
            type: "save_category",
            payload: data
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "category_error",
            payload: err
        });
    }
}
export const updateCategoryAction= (categoryId: number,category: CategoryPost) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token: string | null = await AsyncStorage.getItem("token");
        if(!token) {
            dispatch({
                type: "category_error",
                payload: "token not found"
            });
        }
        const res = await axios.put(HOST_URL + "/api/homeCategories/category/" + categoryId, category, {
            headers: {
                Authorization: token 
            }
        });
        const data = await res.data
        console.log(data)
        dispatch({
            type: "update_category",
            payload: data
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "category_error",
            payload: err
        });
    }
}
export const deleteCategory= (categoryId: number) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token: string | null = await AsyncStorage.getItem("token");
        if(!token) {
            dispatch({
                type: "category_error",
                payload: "token not found"
            });
        }
        await axios.delete(HOST_URL + "/api/homeCategories/category/" + categoryId,  {
            headers: {
                Authorization: token 
            }
        });
      
        dispatch({
            type: "delete_category",
            payload: categoryId
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "category_error",
            payload: err
        });
    }
}