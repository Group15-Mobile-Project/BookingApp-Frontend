
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Dispatch } from "react";
import { Alert } from "react-native";
import { HOST_URL } from "../store";
import axios from "axios";
import { ACTION, CHANGEPASSWORD, LoginForm, USER, UserRegisterForm } from "../../Model";

export const login = (loginForm: LoginForm) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const res = await axios.put(HOST_URL + "/api/users/login", {
            username: loginForm.username,
            password: loginForm.password
        });
 
        const data = res.data
        console.log(res.data)
        console.log(res.headers)
        const token : string =  res.headers.authorization ?? ""
        Alert.alert("Signed In successfully")
        console.log(token)
        await AsyncStorage.setItem("token", token)
        dispatch({
            type: "LOG_IN",
            payload: data
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: "USER_ERROR",
            payload: err
        });
    }
}
 
export const Register = (registerForm: UserRegisterForm) => async (dispatch: Dispatch<ACTION>, getState: any) => {
     try {
        console.log("sign up")
        const res = await axios.post(HOST_URL + "/api/users/register", registerForm);
        const data = await res.data
        console.log(data)
        const token : string =  res.headers.authorization?? ""
        console.log(token)
        await AsyncStorage.setItem("token", token)
        dispatch({
            type: "REGISTER",
            payload: data
        })
     } catch (err) {
      dispatch({
          type: "USER_ERROR",
          payload: err
      })
     }
  
  }
 
  export const ChangePasswordAction = (form: CHANGEPASSWORD) => async (dispatch: Dispatch<ACTION>, getState: any) => {
     try {
        const token : string | null = await AsyncStorage.getItem("token");  
        const res = await axios.put(HOST_URL + "/api/users/changePassword", form, {
            headers: {
                "Authorization": token ?? ""
            }
        })
        const data = await res.data
        console.log(res.headers.authorization?? "no token")
        await AsyncStorage.setItem("token", res.headers.authorization?? "")
        dispatch({
            type: "Change_Password",
            payload: data
        })
    } catch (err) {
        dispatch({
            type: "USER_ERROR",
            payload: err
        })
    }  
  }

  export const updateProfileAction = (username?: string, email?: string, imageurl?: string) => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token : string | null = await AsyncStorage.getItem("token");  
        let queryString = "";
        if(username && username.length > 0) {
            queryString += "username=" + username + "&";
        }
        if(email && email.length > 0) {
            queryString += "email=" + email + "&"; 
        }
        if(imageurl && imageurl.length > 0) {
            queryString += "imageurl=" + imageurl  + "&";
        }
        const res = await axios.put(HOST_URL + "/api/users/updateUserProfile?" + queryString, {}, {
            headers: {
                "Authorization": token ?? ""
            }
        })
        const data = await res.data;
        console.log(data);
        dispatch({
            type: "update_profile",
            payload: data
        })
    } catch (err) {
        dispatch({
            type: "USER_ERROR",
            payload: err
        })
    }  
 }

  export const updateToHostAction = () => async (dispatch: Dispatch<ACTION>, getState: any) => {
    try {
        const token : string | null = await AsyncStorage.getItem("token");  
        const res = await axios.put(HOST_URL + "/api/users/updateToHost", {
            headers: {
                "Authorization": token ?? ""
            }
        })
        const data = await res.data
        dispatch({
            type: "update_to_host",
            payload: data
        })
    } catch (err) {
        dispatch({
            type: "USER_ERROR",
            payload: err
        })
    }  
 }

  export const LogOutAction = () => async (dispatch: Dispatch<ACTION>, getState: any) => {
     try {
        const token : string | null = await AsyncStorage.getItem("token");
        await axios.get(HOST_URL + "/logout", {
            headers: {
                "Authorization": token ?? ""
            }
        })
        await AsyncStorage.setItem("token", "")



        console.log("logout");
        dispatch({
            type: "LOG_OUT"
        })
        dispatch({
            type: "clear_chats"
        })
        dispatch({
            type: "clear_messages"
        })
        dispatch({
            type: "logout_booking"
        })
        dispatch({
            type: "logout_host"
        })
     } catch (err) {
        dispatch({
            type: "USER_ERROR",
            payload: err
        })
     }
  
  }
 
 
  export const getUserByIdAction = (userId: number) => async (dispatch: Dispatch<ACTION>, getState: any) => {
     try { 
        const token : string | null = await AsyncStorage.getItem("token");  
        const res = await axios.get(HOST_URL + "/api/users/id/" + userId, {
            headers: {
                "Authorization": token ?? ""
            }
        })
        const data = await res.data
        console.log(data)
 
        dispatch({
          type: "get_user_by_id",
          payload: data
        })
     } catch (err) {
        console.log(err);
        dispatch({
            type: "USER_ERROR",
            payload: err
        })
     }
  
  }
 
  export const getUserBySearchKeyword= (keyword: string) => async (dispatch: Dispatch<ACTION>, getState: any) => {
     try {
     
        const res = await fetch(HOST_URL + `/api/users/searchByActiveName/${keyword}`)
        const data = await res.json()
        console.log("get_active_users_by_search_keyword")
        console.log(data)
        const dataFilter = data.filter((user: USER) => user.roles.includes("USER"))
        
        dispatch({
            type: "get_active_users_by_search_keyword",
            payload: dataFilter
        })
     } catch (err) {
        dispatch({
            type: "USER_ERROR",
            payload: err
        })
     }
  
  }
 
  export const getAllUsersForAdminAction= () => async (dispatch: Dispatch<ACTION>, getState: any) => {
     try {
         const token : string | null = await AsyncStorage.getItem("token");
         const res = await fetch(HOST_URL + "/api/users/all", {
         method: "GET",
         headers: {
             "Authorization": token ?? ""
         }
     })
      const data = await res.json()
      const dataFilter = data.filter((user: USER) =>  user.roles.includes("USER"))
      console.log("get_all_users_for_admin")
      console.log(dataFilter)
   
     
      dispatch({
          type: "get_all_users_for_admin",
          payload: dataFilter
      })
     } catch (err) {
      dispatch({
          type: "USER_ERROR",
          payload: err
      })
     }
  
  }
 

 
 export const ResetUser = () => (dispatch : Dispatch<ACTION>, getState: any) => {
     dispatch({
         type: "USER_RESET"
     })
 }