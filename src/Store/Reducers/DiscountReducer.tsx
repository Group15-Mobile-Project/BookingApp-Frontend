
import { ACTION, DeclaredStateDiscount} from "../../Model"

let initialState = {
    discount: {},
    discounts: [],
    discountSuccess: false,
    discountError: false,
    message:  null
}

export default (state: DeclaredStateDiscount = initialState, action: ACTION) => {
    switch(action.type) {   
        case "create_discount_by_home":
            return {
                ...state,
                discount: action.payload,
                discountSuccess: true
            } 
        case "update_discount_by_home":
            return {
                ...state,
                discount: action.payload,
                discountSuccess: true
            }  
        case "discount_error":
            return {
                ...state,
                message: action.payload,
                discountError: true
            }
        case "discount_reset": 
            return {
                ...state,
                discountSuccess: false,
                discountError: false,
                message: null
            }
       
        default:
            return state
    }
}