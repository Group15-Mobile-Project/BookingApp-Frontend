import { ACTION, declaredStateBookDate} from "../../Model"



let initialState = {
    bookdate: {},
    bookdates: [],
    bookdateSuccess: false,
    bookdateError: false,
    message:  null
}

export default (state: declaredStateBookDate = initialState, action: ACTION) => {
    switch(action.type) {   
        case "get_all_bookdates_by_home":
            return {
                ...state,
                bookdates: action.payload,
                bookdateSuccess: true
            } 
        case "get_all_bookdates_by_booking":
            return {
                ...state,
                bookdates: action.payload,
                bookdateSuccess: true
            }  
        case "get_all_bookdates_by_authHost":
            return {
                ...state,
                bookdates: action.payload,
                bookdateSuccess: true
            }
        case "get_all_bookdates_by_home_follow_currentTime":
            return {
                ...state,
                bookdates: action.payload,
                bookdateSuccess: true
            }   
        case "bookdate_error":
            return {
                ...state,
                message: action.payload,
                bookdateError: true
            }
        case "bookdate_reset": 
            return {
                ...state,
                bookdateSuccess: false,
                bookdateError: false,
                message: null
            }
       
        default:
            return state
    }
}