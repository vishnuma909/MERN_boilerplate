import { UPDATED_CURRENT_USER } from "../actions/types";
const initialState = {
    updateduser: {}
};
export default function(state = initialState, action) {
  switch (action.type) {
    case UPDATED_CURRENT_USER:
        return {
            ...state,
            updateduser: action.payload
        };
    default:
      return state;
  }
}