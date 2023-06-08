import React, { useState } from 'react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks';
import { Button, Confirm } from 'semantic-ui-react'

import { FETCH_POSTS_QUERY } from '../util/graphql'

function DeleteButton({ postId, callback }) {

    const [confirmOpen, setConfirmOpen] = useState(false);

    const [deletePost] = useMutation(DELETE_POST_MUTATION, {
        update(proxy){
            setConfirmOpen(false);
            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY,
            });
            const updatedPosts = data.getPosts.filter((p) => p.id !== postId);
            proxy.writeQuery({ query: FETCH_POSTS_QUERY, data: { getPosts: updatedPosts } });
            if (callback) callback();
        },
            variables: {
                postId
            }
    })

  return (
    <>
        <Button
            as="div"
            color="red"
            floated="right"
            onClick={() => setConfirmOpen(true)}
            icon="trash"
            aria-label="Delete"
        />
        <Confirm
            open={confirmOpen}
            onCancel={() => setConfirmOpen(false)}
            onConfirm={deletePost}
        />
    </>
)
}

const DELETE_POST_MUTATION = gql`
    mutation deletePost($postId: ID!){
        deletePost(postId: $postId)
    }
`

export default DeleteButton