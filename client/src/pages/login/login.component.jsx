import axios from 'axios'
import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import './login.styles.scss'
function Login() {
  const { dispatch, loading, error } = useContext(AuthContext)
  const navigate = useNavigate()
  const [credentials, setCredentials] = useState({})
  console.log(credentials)
  const handleChange = (e) => {
    const { name, value } = e.target
    setCredentials({
      ...credentials,
      [name]: value
    })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    dispatch({
      type: "LOGIN_START"
    })
    try {
      const res = await axios.post("/auth/login", credentials)
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details })
      navigate('/')

    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err.response.data })
    }
  }

  return (
    <div className='login'>
      <h2>DealPlate Admin Dashboard</h2>
      <p className="login__secondary-title">Login</p>
      <div className="formControl">
        <input type="text" className="inputField" placeholder="username" name="username" value={credentials.username} onChange={handleChange} autoComplete="off" />
      </div>
      <div className="formControl">
        <input type="password" className="inputField" placeholder="password" name="password" value={credentials.password} onChange={handleChange} />
      </div>
      <div className="formAction">
        <button disabled={loading} onClick={handleLogin} className="loginBtn">Login</button>
        {error && <span>{error.message}</span>}
      </div>
      <p className='login__register-title'>Don't have an account yet? Register <Link to="/register">here</Link></p>
    </div>
  )
}

export default Login