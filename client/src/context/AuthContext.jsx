import { useEffect, createContext, useReducer } from 'react'

const INITIAL_STATE = {
  user: null,
  loading: false,
  error: null
}

export const AuthContext = createContext(INITIAL_STATE)
const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        loading: true,
        error: null
      };
    case "LOGIN_SUCCESS":
      return {
        user: action.payload,
        loading: false,
        error: null
      };
    case "LOGIN_FAILURE":
      return {
        user: null,
        loading: false,
        error: action.payload
      };
    case "LOGOUT":
      return {
        user: null,
        loading: false,
        error: null
      };
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, INITIAL_STATE)
  const { user, loading, error } = state
  console.log(state)
  const value = {
    dispatch,
    user,
    loading,
    error
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
