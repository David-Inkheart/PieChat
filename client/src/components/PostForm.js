import React from 'react'
import { Form, Button } from 'semantic-ui-react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'

import { useForm } from '../util/hooks'
import { FETCH_POSTS_QUERY } from '../util/graphql'

function PostForm() {
    const { onChange, onSubmit, values } = useForm(createPostCallback, {
        body: ''
    })

    const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
        variables: values,
        update(proxy, result) {
            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY
            })
            proxy.writeQuery({ query: FETCH_POSTS_QUERY, data: { getPosts:[result.data.createPost, ...data.getPosts], }, });
            values.body = '';
        }
    });


function createPostCallback(){
    createPost()
}

  return (
    <Form onSubmit={onSubmit} success>
        <h2 style={{color: 'orange'}}>Create a pieSnap:</h2>
        <Form.Field>
            <Form.TextArea
                // fluid
                style={{ minHeight: 300 }}
                placeholder="Hi Gourmets!"
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
            <Button type="submit" color="teal">
                Share
            </Button>
        </Form.Field>
    </Form>
  )
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