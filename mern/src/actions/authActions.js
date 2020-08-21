import axios from "../../node_modules/axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "../../node_modules/jwt-decode";
import {
    GET_ERRORS,
    SET_CURRENT_USER,
    USER_LOADING,
    UPDATED_CURRENT_USER
} from "./types";
import { trackPromise } from "react-promise-tracker";
// Register User
export const registerUser = (userData, history) => dispatch => {
    axios
    .post("/api/auth/register", userData)
    .then(res => history.push("/login")) // re-direct to login on successful register
    .catch(err =>
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        })
    );
};
// Login - get user token
export const loginUser = usertoken => dispatch => {
    const token = usertoken;
    localStorage.setItem("jwtToken", token);
    // Set token to Auth header
    setAuthToken(token);
    // Decode token to get user data
    const decoded = jwt_decode(token);
    // Set current user
    dispatch(setCurrentUser(decoded));
};

export const initializeAPI = (id) => dispatch => {
    const _id = id;
    trackPromise(
        axios
        .get('/api/auth/me/'+_id)
        .then(res=> {
            if(res.data.user) {
                dispatch(setCurrentUser(res.data.user[0]))
            }else {
                dispatch(setCurrentUser({}));
            }
        }).catch(res=> {
            new Error('error fetching');
        })
    )
}

export const updateUserData = user => dispatch => {
    const u = user;
    if(u) {
        const decoded = u;
        dispatch(setUpdatedUserData(decoded));
    }
}
export const setUpdatedUserData = decoded => {
    return {
        type: UPDATED_CURRENT_USER,
        payload: decoded
    }
}
export const setCurrentUser = decoded => {
    const v = {
        type: SET_CURRENT_USER,
        payload: decoded
    };
    return v;
};
// User loading
export const setUserLoading = () => {
    return {
        type: USER_LOADING
    };
};
// Log user out
export const logoutUser = () => dispatch => {
    // Remove token from local storage
    localStorage.removeItem("jwtToken");
    // Remove auth header for future requests
    setAuthToken(false);
    // Set current user to empty object {} which will set isAuthenticated to false
    dispatch(setCurrentUser({}));
};