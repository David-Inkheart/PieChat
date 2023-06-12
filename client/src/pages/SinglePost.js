import React, { useContext } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { Grid, Image, Card, Button } from 'semantic-ui-react';
import moment from 'moment';
import { Link, useParams } from 'react-router-dom';

import { AuthContext } from '../context/auth';
import LikeButton from '../components/Buttons/LikeButton';
import DeleteButton from '../components/Buttons/DeleteButton';
import EditButton from '../components/Buttons/EditButton';

function SinglePost() {

    const { postId } = useParams();

    const { user } = useContext(AuthContext);

  console.log('postId: ', postId);

  const { data: { getPost } = {} } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId
    },
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
              src='https://images.unsplash.com/photo-1571865402713-98ba5a56f12b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=435&q=80'
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
                  {/* if user is logged in and the post belongs to the user, show delete and edit button */}
                  {user && user.username === username && (
                    <>
                      <DeleteButton postId={id} callback={deletePostCallback} />
                      <EditButton postId={id} postBody={body} />
                    </>
                  )}
                </div>
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  return postMarkup;
}

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
