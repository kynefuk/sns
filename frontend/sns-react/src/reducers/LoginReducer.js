import {
  START_FETCH,
  FETCH_SUCCESS,
  ERROR_CATCHED,
  TOGGLE_MODE,
  INPUT_EDIT,
} from '../types/actionTypes';

export const loginReducer = (state, action) => {
  switch (action.type) {
    case START_FETCH: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case FETCH_SUCCESS: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case ERROR_CATCHED: {
      return {
        ...state,
        error: 'Email or password is not correct',
        isLoading: false,
      };
    }
    case INPUT_EDIT: {
      return {
        ...state,
        [action.inputName]: action.payload,
        error: '',
      };
    }
    case TOGGLE_MODE: {
      return {
        ...state,
        isLoginView: !state.isLoginView,
      };
    }
    default:
      return state;
  }
};
