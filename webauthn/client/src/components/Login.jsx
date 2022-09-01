import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const [inputs, setInputs] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) =>{
    setInputs({...inputs, [e.target.name] : e.target.value})
  }

  const handleSubmit = async () =>{
   // const res = await axios.post('/login', inputs);
    navigate('/home');
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Usuario</label>
      <input type='text' name='username' onChange={handleInputChange}/>
      <label>Password</label>
      <input type='password' name='password' onChange={handleInputChange}></input>
      <button type='submit'>Ingresar</button>
    </form>
  )
}
