import React, { useState } from 'react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks';
import { Button, Confirm } from 'semantic-ui-react'

import { FETCH_POSTS_QUERY } from '../../util/graphql'

function DeleteButton({ postId, commentId, callback }) {

    const [confirmOpen, setConfirmOpen] = useState(false);

    const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

    const [deletePostorComment] = useMutation(mutation, {
        update(proxy){
            setConfirmOpen(false);
            if (!commentId) {
                // remove post from cache
                const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY,
                });
                const updatedPosts = data.getPosts.filter((p) => p.id !== postId);
                proxy.writeQuery({ query: FETCH_POSTS_QUERY, data: { getPosts: updatedPosts } });
            }
            if (callback) callback();
        },
            variables: {
                postId,
                commentId
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
            onConfirm={deletePostorComment}
        />
    </>
)
}

const DELETE_POST_MUTATION = gql`
    mutation deletePost($postId: ID!){
        deletePost(postId: $postId)
    }
`

const DELETE_COMMENT_MUTATION = gql`
    mutation deleteComment($postId: ID!, $commentId: ID!){
        deleteComment(postId: $postId, commentId: $commentId){
            id
            comments{
                id username createdAt body
            }
            commentCount
        }
    }
`

export default DeleteButton