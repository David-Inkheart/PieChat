import React, { useState } from 'react'
import { Form, Button, Message } from 'semantic-ui-react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'

import { useForm } from '../util/hooks'
import { FETCH_POSTS_QUERY } from '../util/graphql'

function PostForm() {
    const [successMessage, setSuccessMessage] = useState('');
    const { onChange, onSubmit, values } = useForm(createPostCallback, {
        body: ''
    })

    const [createPost, { loading, error }] = useMutation(CREATE_POST_MUTATION, {
        variables: values,
        update(proxy, result) {
            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY
            })
            proxy.writeQuery({ query: FETCH_POSTS_QUERY, data: { getPosts:[result.data.createPost, ...data.getPosts], }, });
            values.body = '';
            setSuccessMessage('Your pieSnap has been posted!');
            setTimeout(() => {
                setSuccessMessage(''); // Hide the message after 5 seconds.
            }
            , 5000);
        },
    });


function createPostCallback(){
    createPost()
        .catch((err) => {
        // Handle and display specific error messages
        if (err.graphQLErrors.length > 0) {
          // Handle UserInputError
          const errorMessage = err.graphQLErrors[0].message;
          // Display error message to the user or handle it as desired
          console.log(errorMessage);
        } else {
          // Handle other errors
          console.log(err.message);
        }
      });
}

  return (
    <>
        <Form onSubmit={onSubmit} success>
            {/* <h2 style={{color: 'orange', textAlign: 'center'}}>Create a pieSnap:</h2> */}
            <Form.Field>
                <Form.TextArea
                    style={{ minHeight: 300 }}
                    placeholder="Share your pieSnap..."
                    name="body"
                    onChange={onChange}
                    value={values.body}
                    error={error ? true : false}
                />
                {/* <Message 
                    success
                    color='teal'
                    header="Success!"
                    content="Your pieSnap has been posted!"
                /> */}
                <Button type="submit" color="teal" fluid loading={loading}>
                    Share
                </Button>
            </Form.Field>
        </Form>
        {error && (
            <div className="ui error message" style={{ marginBottom: 20 }}>
                <ul className="list">
                    <li>{error.graphQLErrors[0].message}</li>
                </ul>
            </div>
        )}
        {/*on Success,  Make Message show then disappear after a while */}
        {successMessage && (
            <Message
                success
                color='teal'
                header="Success!"
                content={successMessage}
            />
        )}
    </>
  );
}

const CREATE_POST_MUTATION = gql`
    mutation createPost($body: String!) {
        createPost(body: $body) {
            id body createdAt username
            likes {
                id username createdAt
            }
            likeCount
            comments {
                id body username createdAt
            }
            commentCount
        }
    }
`

export default PostForm