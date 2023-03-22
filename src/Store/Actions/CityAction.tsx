import AsyncStorage from "@react-native-async-storage/async-storage"
import { Dispatch } from "react";
import { Alert } from "react-native";
import { HOST_URL } from "../store";
import axios from "axios";
import { ACTION, CHANGEPASSWORD, HomePost, HomeUpdate, LoginForm, USER, UserRegisterForm } from "../../Model";

export const getCitiesAction = () => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const res = await axios.get(HOST_URL + "/api/cities/all");
        const data = await res.data
        console.log(data)
        dispatch({
            type: "get_cities",
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
export const getCitiesByCountryAction = (country: string) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const res = await axios.get(HOST_URL + "/api/cities/country/" + country);
        const data = await res.data
        console.log(data)
        dispatch({
            type: "get_cities_by_country",
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
export const getCityByIdAction= (cityId: number) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const res = await axios.get(HOST_URL + "/api/cities/city/" + cityId);
        const data = await res.data
        console.log(data)
        dispatch({
            type: "get_city_by_id",
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
export const getCityByNameAction= (city: string) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const res = await axios.get(HOST_URL + "/api/cities/city/name/" + city);
        const data = await res.data
        console.log(data)
        dispatch({
            type: "get_city_by_name",
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
export const getCitiesBySearchQueryAction= (query: string) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const res = await axios.get(HOST_URL + "/api/cities/query/" + query);
        const data = await res.data
        console.log(data)
        dispatch({
            type: "get_city_by_query_search",
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

export const clearCitiesAction = () =>  (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
      
        dispatch({
            type: "clear_cities"
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "home_error",
            payload: err
        });
    }
}