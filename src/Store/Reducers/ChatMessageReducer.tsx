import { ACTION, CHAT, CHATMESSAGE, declaredStateChat, declaredStateChatMessage} from "../../Model"

const initialState = {
    chatMessage: {},
    chatMessages:  [],
    chatMessageSuccess: false,
    chatMessageError: false,
    message: null
}

export default (state: declaredStateChatMessage = initialState, action: ACTION) => {
    switch(action.type) {   
        case "get_all_chatMessages_by_chatId":
            return {
                ...state,
                chatMessages: action.payload,
                chatMessageSuccess: true
            } 
        case "get_all_chatMessages_by_auth_and_receiver":
            return {
                ...state,
                chatMessages: action.payload,
                chatMessageSuccess: true
            } 
        case "add_chatMessage_to_chat":
            return {
                ...state,
                chatMessage: action.payload,
                chatMessages: [action.payload, ...state.chatMessages],
                chatMessageSuccess: true
            }  
        case "delete_chatMessage_by_id":
            return {
                ...state,
                chatMessages: state.chatMessages.filter((mess: CHATMESSAGE) => mess.id !== action.payload),
                chatMessageSuccess: true
            }
        case "clear_messages":
            return {
                ...state,
                chatMessages: {},
                chatMessageSuccess: true
            }
        case "chatMessage_error":
            return {
                ...state,
                message: action.payload,
                chatMessageError: true
            }
        case "chatMessage_reset": 
            return {
                ...state,
                chatMessageSuccess: false,
                chatMessageError: false,
                message: null
            }
       
        default:
            return state
    }
}