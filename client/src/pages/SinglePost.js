import React, { useContext, useState, useRef } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Grid, Image, Card, Button, Form } from 'semantic-ui-react';
import moment from 'moment';
import { Link, useParams } from 'react-router-dom';

import { AuthContext } from '../context/auth';
import LikeButton from '../components/Buttons/LikeButton';
import DeleteButton from '../components/Buttons/DeleteButton';
import EditButton from '../components/Buttons/EditButton';
import MyPopup from '../util/MyPopup';

function SinglePost() {

  const { postId } = useParams();

  const { user } = useContext(AuthContext);

  const commentInputRef = useRef(null);

  // const commentInputRef = createRef();

  const [comment, setComment] = useState('');

  // console.log('postId: ', postId);

  const { data: { getPost } = {} } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId
    },
  });

  const [submitComment] = useMutation(SEND_COMMENT_MUTATION, {
    update() {
      setComment('');
      commentInputRef.current.blur();
    },
    variables: {
      postId,
      body: comment
    }
  });

  function deletePostCallback() {
    // redirect user to home page after deleting post
    // navigate also works here, just in case I want to use it
    window.location = '/';
  }

  let postMarkup;
  if (!getPost) {
    // put a placeholder here for when the post is loading
    postMarkup = (
      <Image
        src='https://react.semantic-ui.com/images/wireframe/image-text.png'
        rounded
      />
    );
  } else {
    const {
      id,
      body,
      createdAt,
      username,
      comments,
      likes,
      likeCount,
      commentCount,
    } = getPost;

    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={4}>
            <Image
              src='https://images.unsplash.com/photo-1559622214-f8a9850965bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1965&q=80'
              size='large'
              rounded
              style={{ objectFit: 'cover', objectPosition: 'center' }}
            />
          </Grid.Column>
          <Grid.Column width={12}>
            <Card fluid>
              <Card.Content>
                <Card.Header style={{ marginTop: 10 }}>
                  <Image
                    as={Link}
                    to={`/users/${username}`}
                    src='https://react.semantic-ui.com/images/wireframe/square-image.png'
                    avatar
                  />
                  <span>{username}</span>
                </Card.Header>
                <Card.Meta as={Link} to={`/posts/${id}`}>
                  {moment(createdAt).fromNow(true)}
                </Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <div className='like-comment-button' stackable='true'>
                  <LikeButton user={user} post={{ id, likes, likeCount }} />
                  <MyPopup content='Comment on post'>
                  <Button
                    className='comment-button'
                    basic
                    color='teal'
                    onClick={() => console.log('comment on post')}
                    icon='comments'
                    label={{
                      as: Link,
                      to: `/posts/${id}`,
                      basic: true,
                      color: 'orange',
                      pointing: 'left',
                      content: commentCount,
                    }}
                    />
                  </MyPopup>
                  {/* if user is logged in and the post belongs to the user, show delete and edit button for post*/}
                  {user && user.username === username && (
                    <>
                      <DeleteButton postId={id} callback={deletePostCallback} />
                      <EditButton postId={id} postBody={body} />
                    </>
                  )}
                </div>
              </Card.Content>
            </Card>
            {/* if user is logged in, show comment box */}
            {user && (
              <Card fluid>
                <Card.Content>
                  <p>Post a comment</p>
                  <Form>
                    <div className='ui action input fluid'>
                      <input
                        type='text'
                        placeholder='Comment...'
                        name='comment'
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                        ref={commentInputRef}
                      />
                      <Button
                        type='submit'
                        className='ui button teal'
                        disabled={comment.trim() === ''}
                        onClick={submitComment}
                        icon='commenting'
                      />
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            {comments.map((comment) => (
              <Card fluid key={comment.id}>
                <Card.Content>
                  {/* if user is logged in and the comment belongs to the user, show delete and edit button */}
                  {user && user.username === comment.username && (
                    <>
                      <EditButton postId={id} commentId={comment.id} commentBody={comment.body} />
                      <DeleteButton postId={id} commentId={comment.id} />
                    </>
                  )}
                  <Card.Header>{comment.username}</Card.Header>
                  <Card.Meta>{moment(comment.createdAt).fromNow(true)}</Card.Meta>
                  <Card.Description>{comment.body}</Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
}

  return postMarkup;
}

const SEND_COMMENT_MUTATION = gql`
  mutation ($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
        id
        comments {
            id
            body
            createdAt
            username
        }
        commentCount
    }
  }
`;

const FETCH_POST_QUERY = gql`
  query ($postId: ID!) {
    getPost(postId: $postId) {
        id
        body
        createdAt
        username
        likeCount
        likes {
            username
        }
        commentCount
        comments {
            id
            username
            createdAt
            body
        }
    }
    }
`

export default SinglePost;
