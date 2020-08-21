import { combineReducers } from "redux";
import authReducer from "./authReducers";
import errorReducer from "./errorReducers";
import userReducers from "./userReducers";
export default combineReducers({
  auth: authReducer,
  user: userReducers,
  errors: errorReducer
});