import { useEffect, createContext, useReducer } from 'react'

const INITIAL_STATE = {
  user: JSON.parse(localStorage.getItem('user')),
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
    // persist user in local storage when a user logs in
    useEffect(() => {
      localStorage.setItem("user", JSON.stringify(user))
    }, [user])
    
  console.log(state)
  const value = {
    dispatch,
    user,
    loading,
    error
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
