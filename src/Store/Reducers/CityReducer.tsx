import { ACTION, declaredStateCategory, declaredStateCity } from "../../Model"


let initialState = {
    city: {},
    cities: [],
    citySuccess: false,
    cityError: false,
    message: null
}

export default (state: declaredStateCity = initialState, action: ACTION) => {
    switch(action.type) {
        case "get_cities":
            return {
                ...state,
                cities: action.payload,
                citySuccess: true
            }
        case "get_cities_by_country":
            return {
                ...state,
                cities: action.payload,
                citySuccess: true
            }       
        case "get_city_by_id":
            return {
                ...state,
                city: action.payload,
                citySuccess: true
            }  
        case "get_city_by_name":
            return {
                ...state,
                city: action.payload,
                citySuccess: true
            } 
        case "get_city_by_query_search":
            return {
                ...state,
                cities: action.payload,
                citySuccess: true
            }             
        case "city_error":
            return {
                ...state,
                message: action.payload,
                cityError: true
            }
        case "city_reset": 
            return {
                ...state,
                citySuccess: false,
                cityError: false,
                message: null
            }
       
        default:
            return state
    }
}