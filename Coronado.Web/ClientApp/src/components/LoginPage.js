import React from 'react';
import { useDispatch } from 'react-redux';
import * as loginActions from '../actions/loginActions';
import { TextField, Button } from '@material-ui/core';

export default function LoginPage(props)  {
  const dispatch = useDispatch();
  const [ login, setLogin ] = React.useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogin({
      ...login,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const { email, password } = login;
    let next = "";
    if (props.location.state) {
      next = props.location.state.from;
    }
    if (email && password) {
      dispatch(loginActions.login(email, password, next));
    }
  }

    return (
      <div style={{width: 300}}>
        <h1>Login</h1>
        <TextField
          name="email"
          value={login.email}
          onChange={handleChange}
          label="Email"
        />
        <TextField
          name="password"
          value={login.password}
          onChange={handleChange}
          label="Password"
          type="password"
        />
        <Button
          onClick={handleSubmit}
          style={{margin: 10}}
        >
          Login
        </Button>
      </div>
    );
}
