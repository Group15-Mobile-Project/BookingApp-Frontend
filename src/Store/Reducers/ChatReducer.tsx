import { ACTION, CHAT, declaredStateChat} from "../../Model"

const initialState = {
    chat:  {},
    chats: [],
    chatError: false,
    chatSuccess: false,
    message: null
}

export default (state: declaredStateChat = initialState, action: ACTION) => {
    switch(action.type) {   
        case "get_all_chats_by_authUser":
            return {
                ...state,
                chats: action.payload,
                chatSuccess: true
            } 
        case "get_chat_by_authUser_and_receiver":
            return {
                ...state,
                chat: action.payload,
                chatSuccess: true
            }  
        case "get_chat_by_id":
            return {
                ...state,
                chat: action.payload,
                chatSuccess: true
            }
        case "update_reading_status_of_chat":
            return {
                ...state,
                chat: action.payload,
                chats: state.chats.map((ch: CHAT) => ch.id == action.payload.id ? action.payload : ch),
                chatSuccess: true
            }   
        case "clear_chats":
            return {
                ...state,
                chats: [],
                chat: {},
                chatSuccess: true
            } 
        case "chat_error":
            return {
                ...state,
                message: action.payload,
                chatError: true
            }
        case "chat_reset": 
            return {
                ...state,
                chatSuccess: false,
                chatError: false,
                message: null
            }
       
        default:
            return state
    }
}