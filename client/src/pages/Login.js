import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Button, Form, Segment } from 'semantic-ui-react'
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { AuthContext } from '../context/auth';
import { useForm } from '../util/hooks';

function Login() {
  const context = useContext(AuthContext);

  const navigate = useNavigate();

  const [errors, setErrors] = useState({});

  const { onChange, onSubmit, values } = useForm(loginUserCallback, {
    username: '',
    password: '',
  });

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, {data: { login: userData }}){
      // console.log(userData);
      context.login(userData);
      navigate('/');
    },
    onError(err){
      // console.log(err.graphQLErrors[0].extensions.errors);
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    variables: values
  });

 function loginUserCallback(){
    loginUser();
  }

  return (
  <div className='register-container'>
    <div className='app-tagline'>
        <h1>PieChat</h1>
        <p>Connect with people and engage other foodies in snacky conversations.</p>
    </div>
    <div className='form-container'>
      <Segment inverted style={{ backgroundColor: 'white' }}>
        <Form
        onSubmit={onSubmit} 
        noValidate
        className={loading ? "loading" : ' '}
        >
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
            label="Password"
            placeholder="Password.."
            name="password"
            type='password'
            value={values.password}
            error={errors.password ? true : false}
            onChange={onChange}
          />
          <Button className="ui fluid button" type="submit" style={{ background: 'teal', color: 'white', fontSize: '1.5rem' }} >
            Login
          </Button>
          <hr />
            <p style={{ fontSize: '1.4rem', textAlign: 'center'  }}>
            <a style={{ color:'orange' }} href='/register'>Create an account</a>
          </p>
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

const LOGIN_USER = gql`
  mutation login(
    $username: String!
    $password: String!
  ){
    login(
        username: $username
        password: $password
    ){
      id email username createdAt token
    }
  }
`

export default Login;