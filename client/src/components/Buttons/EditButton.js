import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { Button, Confirm } from 'semantic-ui-react';

function EditButton({ postId, postBody }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [newBody, setNewBody] = useState(postBody);

  const [updatePost] = useMutation(EDIT_POST_MUTATION, {
    update() {
      setConfirmOpen(false);
      // TODO: update the post in cache if necessary
    },
  });

  const handleConfirm = () => {
    updatePost({
      variables: {
        postId,
        body: newBody,
      },
    });
  };

  return (
    <>
      <Button
        as="div"
        color="teal"
        floated="right"
        onClick={() => setConfirmOpen(true)}
        icon="edit"
      />
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
        content={
          <textarea
            placeholder={postBody}
            value={newBody}
            onChange={(event) => setNewBody(event.target.value)}
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

export default EditButton;