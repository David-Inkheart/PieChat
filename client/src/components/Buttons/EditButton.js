import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { Button, Confirm } from 'semantic-ui-react';

import MyPopup from '../../util/MyPopup';

function EditButton({ postId, commentId, postBody, commentBody }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [newBody, setNewBody] = useState(postBody);

  const [newCommentBody, setNewCommentBody] = useState(commentBody);

  const mutation = commentId ? EDIT_COMMENT_MUTATION : EDIT_POST_MUTATION;

  const [updatePostorComment ] = useMutation(mutation, {
    update() {
      setConfirmOpen(false);
      // TODO: update the post in cache if necessary
    },
    onError(err) {
      console.Error('EditButton mutation error: {}'.format(err));
      // TODO: Handle error and display message to user
    }
  });

  const handleConfirm = () => {
    updatePostorComment({
      variables: {
        postId,
        body: commentId ? newCommentBody : newBody,
        commentId,
      },
    });
  };

  return (
    <>
      <MyPopup
        content={commentId ? 'Edit comment' : 'Edit post'} >
        <Button
          as="div"
          color="teal"
          floated="right"
          onClick={() => setConfirmOpen(true)}
          icon="edit"
        />
      </MyPopup>
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
        content={
            <textarea
              placeholder={commentId ? commentBody : postBody}
              value={commentId ? newCommentBody : newBody}
              onChange={(event) => commentId ? setNewCommentBody(event.target.value) : setNewBody(event.target.value)}
              style={{ width: '100%', height: '100px' }}
            />
          }
      />
    </>
  );
}

const EDIT_POST_MUTATION = gql`
  mutation updatePost($postId: ID!, $body: String!) {
    updatePost(postId: $postId, body: $body) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
        createdAt
      }
    }
  }
`;

const EDIT_COMMENT_MUTATION = gql`
  mutation updateComment($postId: ID!, $commentId: ID!, $body: String!) {
    updateComment(postId: $postId, commentId: $commentId, body: $body) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`

export default EditButton;