import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export const Login = () => {
  const [inputs, setInputs] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) =>{
    setInputs({...inputs, [e.target.name] : e.target.value})
  }

  const handleSubmit = async (e) =>{
    e.preventDefault();
    const res = await axios.post('https://web-authn-demo-api.vercel.app/login', inputs);
    const user = res.data;
    if(user){
      localStorage.setItem(JSON.stringify(user._id));
      navigate('/home');
    }else{
      Swal.fire('Credenciales incorrectas', 'Por favor, intente nuevamente', 'error');
    } 
  }

  return (
    <form onSubmit={(e) => handleSubmit}>
      <label>Usuario</label>
      <input type='text' name='username' onChange={handleInputChange}/>
      <label>Password</label>
      <input type='password' name='password' onChange={handleInputChange}></input>
      <button type='submit'>Ingresar</button>
    </form>
  )
}
