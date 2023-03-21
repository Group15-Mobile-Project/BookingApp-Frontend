import { ACTION, declaredStateHome } from "../../Model"


let initialState = {
    home: {},
    homes: [],
    homeSuccess: false,
    homeError: false,
    message: null
}

export default (state: declaredStateHome = initialState, action: ACTION) => {
    switch(action.type) {
        case "get_homes":
            return {
                ...state,
                homes: action.payload,
                homeSuccess: true
            }
        case "get_homes_by_category_id":
            return {
                 ...state,
                homes: action.payload,
                homeSuccess: true
            }
        case "get_homes_by_city":
            return {
                ...state,
                homes: action.payload,
                homeSuccess: true
            }
        case "get_homes_by_host_id":
            return {
                ...state,
                homes: action.payload,
                homeSuccess: true
            }
        case "get_homes_by_home_id":
            return {
                ...state,
                home: action.payload,
                homeSuccess: true
            }
        case "get_homes_by_search_query":
            return {
                ...state,
                homes: action.payload,
                homeSuccess: true
            }
        case "get_homes_by_authUser":
            return {
                ...state,
                homes: action.payload,
                homeSuccess: true
        }
        case "save_home":
            return {
                ...state,
                home: action.payload,
                homes: [...state.homes, action.payload],
                homeSuccess: true
            }
        case "update_home":
            return {
                ...state,
                home: action.payload,
                homes: state.homes.map(ho => ho.id == action.payload.id ? action.payload : ho),
                homeSuccess: true
            }     
        case "home_error":
            return {
                ...state,
                message: action.payload,
                homeError: true
            }
        case "home_reset": 
            return {
                ...state,
                homeSuccess: false,
                homeError: false,
                message: null
            }
       
        default:
            return state
    }
}