import AsyncStorage from "@react-native-async-storage/async-storage"
import { Dispatch } from "react";
import { Alert } from "react-native";
import { HOST_URL } from "../store";
import axios from "axios";
import { ACTION } from "../../Model";

export const getCountriesAction = () => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const res = await axios.get(HOST_URL + "/api/countries/all");
        const data = await res.data
        console.log(data)
        dispatch({
            type: "get_countries",
            payload: data
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "country_error",
            payload: err
        });
    }
}
export const getCountryByIdAction = (countryId: number) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const res = await axios.get(HOST_URL + "/api/countries/country/" + countryId );
        const data = await res.data
        console.log(data)
        dispatch({
            type: "get_country_by_id",
            payload: data
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "country_error",
            payload: err
        });
    }
}
export const getCountryByNameAction = (name: string) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const res = await axios.get(HOST_URL + "/api/countries/country/name/" + name );
        const data = await res.data
        console.log(data)
        dispatch({
            type: "get_country_by_name",
            payload: data
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "country_error",
            payload: err
        });
    }
}
export const saveCountryAction = (name: string) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token: string | null = await AsyncStorage.getItem("token");
        if(!token) {
            dispatch({
                type: "country_error",
                payload: "token not found"
            });
        }
        const res = await axios.post(HOST_URL + "/api/countries/country/name/" + name,{
            headers: {
                Authorization: token 
            }
        });
        const data = await res.data
        console.log(data)
        dispatch({
            type: "save_country",
            payload: data
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "country_error",
            payload: err
        });
    }
}