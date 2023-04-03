import { ACTION, declaredStateTenantReview} from "../../Model"



let initialState = {
    tenantReview: {},
    tenantReviews: [],
    tenantReviewSuccess: false,
    tenantReviewError: false,
    message:  null
}

export default (state: declaredStateTenantReview = initialState, action: ACTION) => {
    switch(action.type) {   
        case "get_all_tenantReviews_by_tenant":
            return {
                ...state,
                tenantReviews: action.payload,
                tenantReviewSuccess: true
            } 
        case "get_tenantReview_by_id":
            return {
                ...state,
                tenantReview: action.payload,
                tenantReviewSuccess: true
            }  
        case "get_tenantReview_by_Host_and_tenant":
            return {
                ...state,
                tenantReview: action.payload,
                tenantReviewSuccess: true
            }
        case "add_tenantReview":
            return {
                ...state,
                tenantReview: action.payload,
                tenantReviews: [...state.tenantReviews, action.payload],
                tenantReviewSuccess: true
            }   
        case "tenantReview_error":
            return {
                ...state,
                message: action.payload,
                tenantReviewError: true
            }
        case "tenantReview_reset": 
            return {
                ...state,
                tenantReviewSuccess: false,
                tenantReviewError: false,
                message: null
            }
       
        default:
            return state
    }
}
