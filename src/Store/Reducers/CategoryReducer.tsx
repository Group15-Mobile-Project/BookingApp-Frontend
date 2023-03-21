import { ACTION, declaredStateCategory } from "../../Model"



let initialState = {
    category: {},
    categories: [],
    categorySuccess: false,
    categoryError: false,
    message: null
}

export default (state: declaredStateCategory = initialState, action: ACTION) => {
    switch(action.type) {
        case "get_categories":
            return {
                ...state,
                categories: action.payload,
                categorySuccess: true
            }
        case "get_category_by_id":
            return {
                ...state,
                category: action.payload,
                categorySuccess: true
            } 
        case "save_category":
            return {
                ...state,
                category: action.payload,
                categories: [...state.categories, action.payload],
                categorySuccess: true
            } 
        case "update_category":
            return {
                ...state,
                category: action.payload,
                categories: state.categories.map(cate => cate.id == action.payload.id ? action.payload : cate),
                categorySuccess: true
            } 
        case "delete_category":
            return {
                ...state,
                categories: state.categories.filter(cate => cate.id != action.payload),
                categorySuccess: true
            }                   
        case "category_error":
            return {
                ...state,
                message: action.payload,
               categoryError: true
            }
        case "category_reset": 
            return {
                ...state,
               categorySuccess: false,
               categoryError: false,
                message: null
            }
       
        default:
            return state
    }
}