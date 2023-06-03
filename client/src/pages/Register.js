import React, { useState } from 'react'
import { Button, Form, Segment } from 'semantic-ui-react'
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

function Register() {
  const { values, setValues } = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const onChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  }

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(proxy, result){
      console.log(result);
    },
    variables: values
  });

  const onSubmit = (event) => {
    event.preventDefault();
    addUser();
  }

  return (
   <div className='form-container'>
    <Segment inverted>
    <Form onSubmit={onSubmit} noValidate inverted>
      <h1 style={{ color: 'teal' }}>Sign up</h1>
      <Form.Input
        label="Username"
        placeholder="Username.."
        name="username"
        value={values.username}
        onChange={onChange}
      />
      <Form.Input
        label="Email"
        placeholder="Email.."
        name="email"
        value={values.email}
        onChange={onChange}
      />
      <Form.Input
        label="Password"
        placeholder="Password.."
        name="password"
        value={values.password}
        onChange={onChange}
      />
      <Form.Input
        label="confirm Password"
        placeholder="confirm Password.."
        name="confirmPassword"
        value={values.confirmPassword}
        onChange={onChange}
      />
      <Button type="submit" style={{ background: 'teal', color: 'white' }} >
        Sign up
      </Button>
    </Form>
    </Segment>
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