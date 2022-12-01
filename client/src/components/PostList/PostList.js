import React, {useState} from 'react';
import PostListItem from './PostListItem';

const PostList = props =>{
  console.log("IN POSTLIST:");
    //const {posts,list,listItem,clickPost, deletePost, deleteItem,editPost, editListItem,bought,newItem} = props;
    const {list,listItem,clickPost, deleteItem, handleUpdateBought, editListItem,boughtChanged,listType,newItem,displayNewList,getListType} = props;
    //let bought = this.state.bought;
    //console.log("Value of bought passed into POstList",list.bought);
    //console.log("Value of list in PostList", {list});
    return list.map(list => (
      <PostListItem
        key={list._id}
        //post={post}
        list={list}
        listItem={listItem}
        clickPost={clickPost}
        //deletePost={deletePost}
        deleteItem={deleteItem}
       // editPost={editPost}
        handleUpdateBought={handleUpdateBought}
        editListItem={editListItem}
        boughtChanged={boughtChanged}
        bought={list.itemBought}
        getListType={getListType}
        listType={listType}
        //newItem={newItem}
        //displayNewList={displayNewList}      
        />  
    ));
 
};

export default PostList;