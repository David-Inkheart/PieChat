import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Grid, Image } from 'semantic-ui-react';

import PostCard from '../components/PostCard';

function Home() {
  const { loading, data: { getPosts: posts } = {}, error } = useQuery(FETCH_POSTS_QUERY);
  if (error) console.log(error);

  return (
    <Grid columns={3}>
      <Grid.Row className='page-title'>
        <h1 style={{ color: 'teal' }}>Recent pieSnaps</h1>
      </Grid.Row>
      <Grid.Row>
        {loading ? (
          <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
        ) : (
          posts && posts.map((post) => (
            <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
              <PostCard post={post} />
            </Grid.Column>
          ))
        )}
      </Grid.Row>
    </Grid>
  );
}


const FETCH_POSTS_QUERY = gql`
  {
    getPosts{
      id
      body
      createdAt
      username
      likeCount
      likes{
        username
      }
      commentCount
      comments{
        id
        username
        createdAt
        body
      }
    }
  }
`

export default Home;