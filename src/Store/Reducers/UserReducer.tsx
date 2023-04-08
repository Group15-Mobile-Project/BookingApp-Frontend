import { ACTION, declaredStateUser } from "../../Model"


let initialState = {
    authUser: {},
    otherUser: {},
    users: [],
    userSuccess: false,
    userError: false,
    userUpdateStatus: false,
    userUpdated: {},
    message: null,
    authSuccess: false,
    authError: false
}

export default (state: declaredStateUser = initialState, action: ACTION) => {
    switch(action.type) {
        case "LOG_IN":
            return {
                ...state,
                authUser: action.payload,
                authSuccess: true
            }
        case "REGISTER":
            return {
                ...state,
                authUser: action.payload,
                authSuccess: true
            }
      
        case "update_to_host":
            return {
                ...state,
                authUser: action.payload,
                userSuccess: true
            }
        case "update_profile":
            return {
                ...state,
                authUser: action.payload,
                userSuccess: true
            }
        case "Change_Password":
            return {
                ...state,
                authUser: action.payload,
                userSuccess: true
            }
        case "LOG_OUT":
            return {
                ...state,
                authUser: {},
                users: [],
                otherUser: {},
                userSuccess: true
            }
        case "USER_ERROR":
            return {
                ...state,
                message: action.payload,
                userError: true
            }
        case "AUTH_ERROR":
            return {
                ...state,
                message: action.payload,
                authError: true
            }
        case "USER_RESET": 
            return {
                ...state,
                userSuccess: false,
                userError: false,
                userUpdateStatus: false,
                userUpdated: {},
                message: null,
                authSuccess: false,
                authError: false
            }
        case "get_user_by_id": 
            return {
                ...state,
                otherUser: action.payload,
                userSuccess: true
            }
        
        case "get_users_by_search_keyword":
            return {
                ...state,
                users: action.payload,
                userSuccess: true
            }
        case "get_all_users_for_admin":
            return {
                ...state,
                users: action.payload,
                userSuccess: true
            }
        default:
            return state
    }
}