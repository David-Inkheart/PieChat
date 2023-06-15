import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Grid, Image, Transition } from 'semantic-ui-react';

import { AuthContext } from '../context/auth';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import {FETCH_POSTS_QUERY} from '../util/graphql';

function Home() {
  const { user } = useContext(AuthContext);
  const { loading, data: { getPosts: posts } = {}} = useQuery(FETCH_POSTS_QUERY);


  return (
    <Grid columns={3} stackable={true}>
      <Grid.Row className='page-title'>
        <h1 style={{ color: 'orange' }}>Recent pieSnaps</h1>
      </Grid.Row>
      <Grid.Row>
        {user && (
          <Grid.Column>
            <PostForm />
          </Grid.Column>
        )}
        {loading ? (
          <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
        ) : (
          <Transition.Group>
            {
              posts && posts.map((post) => (
                <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                  <PostCard post={post} />
                </Grid.Column>
              ))
            }
          </Transition.Group> 
        )}
      </Grid.Row>
    </Grid>
  );
}

export default Home;