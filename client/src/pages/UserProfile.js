import React, { useContext } from 'react';
import { Grid, Image, Card } from 'semantic-ui-react';
import { Link, useParams } from 'react-router-dom';

import { AuthContext } from '../context/auth';

function UserProfile() {
  const { user } = useContext(AuthContext);
  const { username } = useParams();

  // You can use the user object and the `username` parameter to display the user's details

  // Example usage
  const userProfile = user && user.username === username ? user : null;

  if (!userProfile) {
    return <div>User not found.</div>;
  }

  return (
    <Grid>
      <Grid.Row>
        <Grid.Column width={4}>
          <Image
            src={userProfile.avatar}
            size="large"
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
                  to={`/users/${userProfile.username}`}
                  src={userProfile.avatar}
                  avatar
                />
                <span>{userProfile.username}</span>
              </Card.Header>
              <Card.Meta>
                Name: {userProfile.name}
                <br />
                Bio: {userProfile.bio}
              </Card.Meta>
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

export default UserProfile;
