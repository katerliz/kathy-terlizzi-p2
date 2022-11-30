import React, {State} from 'react';
import { useHistory } from 'react-router-dom';
import slugify from 'slugify';
import './styles.css';

const PostListItem = props =>{
    console.log("VALUE OF PROPS IN POSTLISTITEM: ",props);
    const { list,listItem, clickPost,deleteItem,handleUpdateBought,boughtChanged,listType,newItem,displayNewList} = props;

    const history = useHistory();
  
    console.log("Value of bought at start of ListItem:",list.itemBought);
    

    const handleClickPost = post =>{
        const slug = slugify(post.title, {lower:true});
        clickPost(post);
        history.push(`/posts/${slug}`);
    };

    let dispNewList=displayNewList;



console.log("Value of bought before IF statemetn in ListItem:" ,list.itemBought);
//console.log("value of displayNEWLIST before IF statement", displayNewList);
//if(boughtChanged===true){
 if (list.itemBought===false){
    // dispNewList=false;
 return ( 

   <div className="listItemFormat">
     
        <div className ="postControls">
           <button onClick ={()=> deleteItem(list)}>Delete</button>
           <button onClick ={() => handleUpdateBought(list,listItem,displayNewList)} id="white">Get</button>
           
        </div>
        <div className ="postListItem">
            <p>{list.listItem}</p>
        </div>
    </div>
  );
  
 } else  {
    return (
   <div className="listItemFormat">
        <div className ="postControls">
           <button onClick ={()=> deleteItem(list)}>Delete</button>
           <button onClick ={() => handleUpdateBought(list,listItem,displayNewList)} id="blue" >Bought</button>
        </div>
        <div className ="postListItem">
            <p>{list.listItem}</p>
        </div>
    </div> 
    );
};


};

export default PostListItem;