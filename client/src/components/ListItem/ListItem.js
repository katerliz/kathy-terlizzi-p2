import React from 'react';

const Post = props => {
    const {listItem} = props;

    return (
        <div class= "listItem">
        console.log("list item from listItem: ",`${listItem}`);
            <p>{listItem}</p>
        </div>
    )
}

export default Post;