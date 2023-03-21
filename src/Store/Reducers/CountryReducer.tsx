import { ACTION, declaredStateCountry } from "../../Model"


let initialState = {
    country: {},
    countries: [],
    countrySuccess: false,
    countryError: false,
    message: null
}
export default (state: declaredStateCountry = initialState, action: ACTION) => {
    switch(action.type) {
        case "get_countries":
            return {
                ...state,
                countries: action.payload,
                countrySuccess: true
            }
        case "get_country_by_id":
            return {
                ...state,
                country: action.payload,
                countrySuccess: true
            }
        case "get_country_by_name":
            return {
                ...state,
                country: action.payload,
                countrySuccess: true
            }        
        case "save_country":
            return {
                ...state,
                country: action.payload,
                countries: [...state.countries, action.payload],
                countrySuccess: true
            }
        case "country_error":
            return {
                ...state,
                message: action.payload,
                countryError: true
            }
        case "country_reset": 
            return {
                ...state,
                countrySuccess: false,
                countryError: false,
                message: null
            }
       
        default:
            return state
    }
}