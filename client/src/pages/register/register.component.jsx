import axios from 'axios'
import { useForm } from "react-hook-form";
import { Link } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

import './register.styles.scss'
import toast from 'react-hot-toast';

const schema = yup.object({
  name: yup.string().required("Name is required"),
  username: yup.string().required("Username is required"),
  email: yup.string().email().required("Email is required"),
  phone: yup.string().required('Phone is required'),
  password: yup.string().required("Password is required"),
  password: yup.string().required("Password is required"),
  confirmPassword: yup.string().required('Please retype your password.').oneOf([yup.ref('password')], 'Your passwords do not match.')
})

function Register() {
  const { reset, register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });
  const onSubmit = async (data) => {
    const {confirmPassword, ...otherFormData} = data
    console.log(otherFormData)
    try {
      const form = await axios.post('/auth/register', otherFormData)
      if(form) {
        toast("Successfully registered")
        reset()
      }
    } catch (err) {
      if(err) toast("Oh no! Sign up failed, try different credentials")

      console.log(err)
    }
  }
  
  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <form className="register" onSubmit={handleSubmit(onSubmit)}>
      <h2>DealPlate Register</h2>
      <div className="form-control">
        <input className="inputField" placeholder="Full name" type="text" {...register("name")} />
      </div>
      <span className="register__form-validator">{errors.name?.message}</span>

      <div className="form-control">
        <input className="inputField" placeholder="Username" type="text" {...register("username")} />
      </div>
      <span className="register__form-validator">{errors.username?.message}</span>

      <div className="form-control">
        <input className="inputField" placeholder="Email" type="email" {...register("email")} autoComplete="off"/>
      </div>
      <span className="register__form-validator">{errors.email?.message}</span>

      <div className="form-control">
        <input className="inputField" placeholder="Phone" type="tel" {...register("phone")} />
      </div>
      <span className="register__form-validator">{errors.phone?.message}</span>


      <div className="form-control">
        <input className="inputField" placeholder="Password" type="password" {...register("password")} />
      </div>
      <span className="register__form-validator">{errors.password?.message}</span>

      <div className="form-control">
        <input className="inputField" placeholder="Confirm Password" type="password" {...register("confirmPassword")} />
      </div>
      <span className="register__form-validator">{errors.confirmPassword?.message}</span>


      <div className="formAction">
        <button type="submit">Register</button>
      </div>
      <span className="register__secondary-title">We use your location to deliver you the best details, DealPlate never sells your data</span>
      <p className='register__secondary-title'>Already have an account? Login <Link to="/login">here</Link></p>
    </form>
  );
}

export default Register