import { ACTION, BOOKING, declaredStateBooking} from "../../Model"

let initialState = {
    booking: {},
    oldbookings: [],
    upcomingbookings: [],
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
                upcomingbookings: [...state.upcomingbookings, action.payload],
                bookingSuccess: true
            } 
        case "update_booking":
            return {
                ...state,
                booking: action.payload,
                upcomingbookings: state.upcomingbookings.map((bo: BOOKING) => bo.id == action.payload.id ? action.payload : bo),
                bookingSuccess: true
            }  
        case "accept_booking":
            return {
                ...state,
                booking: action.payload,
                upcomingbookings: state.upcomingbookings.map((bo: BOOKING) => bo.id == action.payload.id ? action.payload : bo),
                bookingSuccess: true
            } 
        case "cancel_booking":
            return {
                ...state,
                upcomingbookings: state.upcomingbookings.filter((bo: BOOKING) => bo.id != action.payload),
                bookingSuccess: true
            } 
        case "unaccept_booking":
            return {
                ...state,
                booking: action.payload,
                upcomingbookings: state.upcomingbookings.map((bo: BOOKING) => bo.id == action.payload.id ? action.payload : bo),
                bookingSuccess: true
            } 
        case "get_old_bookings_by_tenant":
            return {
                ...state,
                oldbookings: action.payload,
                bookingSuccess: true
            } 
        case "get_upcoming_bookings_by_tenant":
            return {
                ...state,
                upcomingbookings: action.payload,
                bookingSuccess: true
            } 
        case "get_old_bookings_by_home":
            return {
                ...state,
                oldbookings: action.payload,
                bookingSuccess: true
            }
        case "get_upcoming_bookings_by_home":
            return {
                ...state,
                upcomingbookings: action.payload,
                bookingSuccess: true
            }
        case "get_old_bookings_by_host":
            return {
                ...state,
                oldbookings: action.payload,
                bookingSuccess: true
            }
        case "get_upcoming_bookings_by_host":
            return {
                ...state,
                upcomingbookings: action.payload,
                bookingSuccess: true
            }
        case "get_old_bookings_for_admin":
            return {
                ...state,
                oldbookings: action.payload,
                bookingSuccess: true
            }
        case "get_upcoming_bookings_for_admin":
            return {
                ...state,
                upcomingbookings: action.payload,
                bookingSuccess: true
            }
        case "get_booking_by_id":
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
        case "clear_booking":
            return {
                ...state,
                booking: {},
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