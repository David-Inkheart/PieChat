import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Button, Form, Segment } from 'semantic-ui-react'
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { AuthContext } from '../context/auth';
import { useForm } from '../util/hooks';

function Register() {
  const context = useContext(AuthContext);

  const navigate = useNavigate();

  const [errors, setErrors] = useState({});

  const { onChange, onSubmit, values } = useForm(registerUser, {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, {data: { register: userData } = {}}){
      console.log(userData);
      context.login(userData);
      navigate('/');
    },
    onError(err){
      // console.log(err.graphQLErrors[0].extensions.errors);
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    variables: values
  });

  function registerUser(){
    addUser();
  }

  return (
  <div className='register-container'>
    <div className='app-tagline'>
        <h1>PieChat</h1>
        <p>Connect with people and engage other foodies in snacky conversations.</p>
    </div>
    <div className='form-container'>
      <Segment inverted style={{ backgroundColor: 'aliceblue' }}>
        <Form
        onSubmit={onSubmit} 
        noValidate
        className={loading ? "loading" : ' '}
        >
          <h1 style={{ color: 'orange' }}>Sign Up</h1>
          <p style={{ color: 'orange' }}>it's quick and easy</p>
          <hr />
          <Form.Input
            label="Username"
            placeholder="Username.."
            name="username"
            type='text'
            value={values.username}
            error={errors.username ? true : false}
            onChange={onChange}
          />
          <Form.Input
            label="Email"
            placeholder="Email.."
            name="email"
            type='email'
            value={values.email}
            error={errors.email ? true : false}
            onChange={onChange}
          />
          <Form.Input
            label="Password"
            placeholder="Password.."
            name="password"
            type='password'
            value={values.password}
            error={errors.password ? true : false}
            onChange={onChange}
          />
          <Form.Input
            label="confirm Password"
            placeholder="confirm Password.."
            name="confirmPassword"
            type='password'
            value={values.confirmPassword}
            error={errors.confirmPassword ? true : false}
            onChange={onChange}
          />
          <Button type="submit" style={{ background: 'orange', color: 'white', fontSize: '1.5rem' }} >
            Sign up
          </Button>
        </Form>
        {Object.keys(errors).length > 0 && (
          <div className='ui error message'>
          <ul className='list'>
            {Object.values(errors).map(value => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
        )}
      </Segment>
    </div>
  </div>
  )
}

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ){
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ){
      id email username createdAt token
    }
  }
`

export default Register;