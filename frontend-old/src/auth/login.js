import React, { useState } from 'react';
import API, { saveToken } from '../api/auth';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/login', { email, password });
      saveToken(data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      // redirect based on role
      if(data.user.role === 'donor') nav('/donor');
      else if(data.user.role === 'volunteer') nav('/volunteer');
      else if(data.user.role === 'receiver') nav('/receiver');
      else nav('/');
    } catch(err){ alert(err.response?.data?.msg || 'Login failed'); }
  };

  return (
    <div className="auth">
      <h2>Login</h2>
      <form onSubmit={submit}>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email"/>
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password"/>
        <button>Login</button>
      </form>
    </div>
  );
}
