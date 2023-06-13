import React, { useState, useEffect } from 'react'
// import { Link } from 'react-router-dom';
// import { useNavigate } from "react-router-dom";
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Button } from 'semantic-ui-react';

function LikeButton({ user, post: { id, likeCount, likes }}) {
    const [liked, setLiked] = useState(false);

    // const Navigate = useNavigate();

    useEffect(() => {
        if(user && likes.find(like => like.username === user.username)){
            setLiked(true)
        } else setLiked(false)
    }, [user, likes]);

    const [likePost] = useMutation(LIKE_POST_MUTATION, {
        variables: { postId: id }
    });

    const likeButton = user ? (
        liked ? (
        <Button
            color='teal'
            icon='thumbs up'
            label={{ color: 'orange', pointing: 'left', content: likeCount }}
        />
        ) : (
        <Button
            className="like-button"
            color='teal'
            icon='thumbs up'
            basic
            label={{ basic: false, color: 'orange', pointing: 'left', content: likeCount }}
        />
        )
    ) : (
        // redirect
        <Button
            className="like-button"
            // onClick={() => Navigate('/login')}
            onClick={() => window.location.href='/login'}
            // as={Link}
            // to="/login"
            color='teal'
            icon='thumbs up'
            basic
            label={{ basic: true, color: 'orange', pointing: 'left', content: likeCount }}
        />
    );

  return (
    <Button as='div' labelPosition='right' onClick={likePost}>
        {likeButton}
    </Button>
  )
}

const LIKE_POST_MUTATION = gql`
    mutation likePost($postId: ID!){
        likePost(postId: $postId){
            id
            likes{
                id username
            }
            likeCount
        }
    }
`

export default LikeButton;