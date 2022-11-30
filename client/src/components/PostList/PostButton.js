import React from 'react';
import { useHistory } from 'react-router-dom';

import './styles.css';

const PostButton = props =>{

    const { list,listItem,deleteItem,handleUpdateBought,bought,boughtChanged} = props;
    //console.log("value of listItem in PostListItem: " ,`${list.listItem}`);
    const history = useHistory();
    console.log("Value of bought at start of PostButton:", bought);
    

   

console.log("Value of bought before IF statemetn in PostButton:" ,bought);
if (bought===false){
 return (
   <div className="listItemFormat">
        <div className ="postControls">
           <button onClick ={()=> deleteItem(list)}>Delete</button>
           <button onClick ={() => handleUpdateBought(bought,list,listItem)} id="white">Get</button>
           
        </div>
        <div className ="postListItem">
            <p>{list.listItem}</p>
        </div>
    </div>
  );
} else {
    return (
   <div className="listItemFormat">
        <div className ="postControls">
           <button onClick ={()=> deleteItem(list)}>Delete</button>
           <button onClick ={() => handleUpdateBought(bought,list,listItem)} id="blue" >Bought</button>
        </div>
        <div className ="postListItem">
            <p>{list.listItem}</p>
        </div>
    </div> 
    );
};

};

export default PostButton;
