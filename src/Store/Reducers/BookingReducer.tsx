import { ACTION, BOOKING, declaredStateBooking} from "../../Model"

let initialState = {
    booking: {},
    bookings: [],
    bookingSuccess: false,
    bookingError: false,
    message:  null,
    countDiscount: null
}

export default (state: declaredStateBooking = initialState, action: ACTION) => {
    switch(action.type) {   
        case "create_booking":
            return {
                ...state,
                booking: action.payload,
                bookings: [...state.bookings, action.payload],
                bookingSuccess: true
            } 
        case "update_booking":
            return {
                ...state,
                booking: action.payload,
                bookings: state.bookings.map((bo: BOOKING) => bo.id == action.payload.id ? action.payload : bo),
                bookingSuccess: true
            }  
        case "accept_booking":
            return {
                ...state,
                booking: action.payload,
                bookings: state.bookings.map((bo: BOOKING) => bo.id == action.payload.id ? action.payload : bo),
                bookingSuccess: true
            } 
        case "unaccept_booking":
            return {
                ...state,
                booking: action.payload,
                bookings: state.bookings.map((bo: BOOKING) => bo.id == action.payload.id ? action.payload : bo),
                bookingSuccess: true
            } 
        case "get_old_bookings_by_tenant":
            return {
                ...state,
                bookings: action.payload,
                bookingSuccess: true
            } 
        case "get_upcoming_bookings_by_tenant":
            return {
                ...state,
                bookings: action.payload,
                bookingSuccess: true
            } 
        case "get_old_bookings_by_home":
            return {
                ...state,
                bookings: action.payload,
                bookingSuccess: true
            }
        case "get_upcoming_bookings_by_home":
            return {
                ...state,
                bookings: action.payload,
                bookingSuccess: true
            }
        case "get_old_bookings_by_host":
            return {
                ...state,
                bookings: action.payload,
                bookingSuccess: true
            }
        case "get_upcoming_bookings_by_host":
            return {
                ...state,
                bookings: action.payload,
                bookingSuccess: true
            }
        case "get_old_bookings_for_admin":
            return {
                ...state,
                bookings: action.payload,
                bookingSuccess: true
            }
        case "get_upcoming_bookings_for_admin":
            return {
                ...state,
                bookings: action.payload,
                bookingSuccess: true
            }
        case "get_bookings_by_id":
            return {
                ...state,
                booking: action.payload,
                bookingSuccess: true
            }
        case "get_count_discount_for_booking":
            return {
                ...state,
                countDiscount: action.payload,
                bookingSuccess: true
            }
        case "booking_error":
            return {
                ...state,
                message: action.payload,
                bookingError: true
            }
        case "booking_reset": 
            return {
                ...state,
                bookingSuccess: false,
                bookingError: false,
                message: null
            }
       
        default:
            return state
    }
}