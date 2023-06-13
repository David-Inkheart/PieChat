import React, { useContext } from "react";
import { Card, Image, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import moment from "moment";

import { AuthContext } from "../context/auth";
import LikeButton from "./Buttons/LikeButton";
import DeleteButton from "./Buttons/DeleteButton";
import EditButton from "./Buttons/EditButton";

function PostCard({ post: { body, createdAt, id, username, likeCount, commentCount, likes }}){
    const { user } = useContext(AuthContext);

    return (
        <Card fluid>
            <Card.Content>
                <Image
                rounded
                fluid
                as={Link} to={`/posts/${id}`}
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                // size='large'
                src='https://images.unsplash.com/photo-1559622214-f8a9850965bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1965&q=80'
                />
                <Card.Header style={{ marginTop: 10 }}>
                    <Image
                    as={Link} to={`/users/${username}`}
                    src='https://react.semantic-ui.com/images/wireframe/square-image.png' 
                    avatar />
                    <span>{username}</span>
                </Card.Header>
                <Card.Meta as={Link} to={`/posts/${id}`} >{moment(createdAt).fromNow(true)}</Card.Meta>
                <Card.Description>
                {body}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <div className='like-comment-button' stackable="true">
                    <LikeButton user={user} post={{ id, likes, likeCount }} />
                    <Button
                        className="comment-button"
                        as={Link}
                        to={`/posts/${id}`}
                        // onClick={commentOnPost}
                        basic
                        color='teal'    
                        // content='Comment'
                        icon='comments'
                        label={{
                        // as: Link,
                        // to: `/posts/${id}`,
                        basic: true,
                        color: 'orange',
                        pointing: 'left',
                        content: commentCount,
                    }}
                    />
                    {/* if user is logged in and the post belongs to the user, show delete and edit button */}
                    {user && user.username === username && (
                        <>
                            <DeleteButton postId={id} />
                            <EditButton postId={id} postBody={body}/>
                        </>
                    )}
                </div>
            </Card.Content>
        </Card>
    )
}

export default PostCard;