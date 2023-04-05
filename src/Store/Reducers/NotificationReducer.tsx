import { ACTION, declaredStateNotification, NOTIFICATION} from "../../Model"



let initialState = {
    notification: {},
    notifications: [],
    notificationSuccess: false,
    notificationError: false,
    message:  null
}

export default (state: declaredStateNotification = initialState, action: ACTION) => {
    switch(action.type) {   
        case "get_all_notifications_by_tenant":
            return {
                ...state,
                notifications: action.payload,
                notificationSuccess: true
            } 
        case "get_all_notifications_by_host":
            return {
                ...state,
                notifications: action.payload,
                notificationSuccess: true
            }  
        case "update_reading_status_of_notification":
            return {
                ...state,
                notification: action.payload,
                notifications: state.notifications.filter((noti: NOTIFICATION) => noti.id == action.payload.id),
                notificationSuccess: true
            }
        case "notification_error":
            return {
                ...state,
                message: action.payload,
                notificationError: true
            }
        case "notification_reset": 
            return {
                ...state,
                notificationSuccess: false,
                notificationError: false,
                message: null
            }
       
        default:
            return state
    }
}
