import { ACTION, declaredStateHomeReview,   } from "../../Model"



let initialState = {
    review: {},
    reviews: [],
    reviewSuccess: false,
    reviewError: false,
    message: null
}

export default (state: declaredStateHomeReview = initialState, action: ACTION) => {
    switch(action.type) {
        case "get_review_by_id":
            return {
                ...state,
                review: action.payload,
                reviewSuccess: true
            }   
        case "get_review_by_authUser_and_home":
            return {
                ...state,
                review: action.payload,
                reviewSuccess: true
            }  
        case "get_all_reviews_by_home":
            return {
                ...state,
                reviews: action.payload,
                reviewSuccess: true
            } 
        case "get_all_reviews_by_host":
            return {
                ...state,
                reviews: action.payload,
                reviewSuccess: true
            } 
        case "get_all_reviews_by_home_and_querySearch":
            return {
                ...state,
                reviews: action.payload,
                reviewSuccess: true
            }  
        case "add_home_review":
            return {
                ...state,
                review: action.payload,
                reviews: [...state.reviews, action.payload],
                reviewSuccess: true
            }  
        case "review_error":
            return {
                ...state,
                message: action.payload,
                reviewError: true
            }
        case "review_reset": 
            return {
                ...state,
                reviewSuccess: false,
                reviewError: false,
                message: null
            }
       
        default:
            return state
    }
}