import { ACTION, declaredStateWishlist,} from "../../Model"



let initialState = {
    wishlist: {},
    wishlists: [],
    wishlistSuccess: false,
    wishlistError: false,
    message: null
}

export default (state: declaredStateWishlist = initialState, action: ACTION) => {
    switch(action.type) {   
        case "delete_wishlist":
            return {
                ...state,
                wishlists: state.wishlists.filter(wi => wi.id != action.payload),
                wishlistSuccess: true
            }  
        case "get_all_wishlists_by_home":
            return {
                ...state,
                wishlists: action.payload,
                wishlistSuccess: true
            } 
        case "get_all_wishlists_by_authUser":
            return {
                ...state,
                wishlists: action.payload,
                wishlistSuccess: true
            }  
        case "add_wishlist":
            return {
                ...state,
                wishlist: action.payload,
                wishlists: [...state.wishlists, action.payload],
                wishlistSuccess: true
            }  
        case "wishlist_error":
            return {
                ...state,
                message: action.payload,
                wishlistError: true
            }
        case "wishlist_reset": 
            return {
                ...state,
                wishlistSuccess: false,
                wishlistError: false,
                message: null
            }
       
        default:
            return state
    }
}