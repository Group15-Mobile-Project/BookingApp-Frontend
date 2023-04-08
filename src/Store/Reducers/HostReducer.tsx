import { ACTION, declaredStateHost,   } from "../../Model"



let initialState = {
    authHost: {},
    stas: {},
    host: {},
    hosts: [],
    hostSuccess: false,
    hostError: false,
    message: null
}

export default (state: declaredStateHost = initialState, action: ACTION) => {
    switch(action.type) {
        case "get_host_by_id":
            return {
                ...state,
                host: action.payload,
                hostSuccess: true
            }   
        case "get_host_by_authUser":
            return {
                ...state,
                authHost: action.payload,
                hostSuccess: true
            }  
        case "get_all_hosts":
            return {
                ...state,
                hosts: action.payload,
                hostSuccess: true
            } 
        case "get_host_stas":
            return {
                ...state,
                stas: action.payload,
                hostSuccess: true
            } 
        case "logout_host":
            return {
                ...state,
                stas: {},
                authHost: {},
                hostSuccess: true
            } 
        case "get_all_hosts_by_name":
            return {
                ...state,
                hosts: action.payload,
                hostSuccess: true
            }   
        case "host_error":
            return {
                ...state,
                message: action.payload,
                hostError: true
            }
        case "host_reset": 
            return {
                ...state,
               hostSuccess: false,
               hostError: false,
                message: null
            }
       
        default:
            return state
    }
}