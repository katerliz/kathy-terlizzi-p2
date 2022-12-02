import React,{useState} from 'react';
import axios from 'axios';
import {useHistory} from 'react-router-dom';

import './styles.css';


const CreateListItem = ({ token, onPostCreated, convert, list,listType}) => {
    let history = useHistory();
    const [postData, setPostData]=useState({
         listItem:"",
        //listType:"4",
        bought:false,
           
    });
    const [newlistType, setListType]= useState([]);
 

const {listItem,bought} = postData;


const onChange = (e) =>{
    const {name,value} = e.target;

    setPostData({
        ...postData,
        [name]:value,
       // [listType]:8,
        [listItem]:value,
        [bought]:false,
        
        
    })

 };

  const getListType=async(control)=>{
    console.log("RUNNING GETLISTTYPE....");
   // console.log("Passed in LISTYPE", listT);
    
    let listT=control;
    
    
    console.log("New Value of LISTT", listT);
   
   setListType(listT);
  
    listType=listT;
    
    console.log("NEW VALUE OF LISTTYPE ", listType)
  

    convert(listT);
 
//};



  

};  //end getlisttype
 
 


 const create = async()=>{
    //console.log("IN CREATE.....");
    //console.log("Value of enwLIstType now in create: ",newlistType);
    if(newlistType.length===0){
        console.log("CALLING GetListType...");
        getListType(4);
    }
    if(!listItem){
        console.log('Item description is required.');
       // const newListItem={};
    }else {
        console.log("LISTIEM IN CREATE:",);
       console.log("LISTTYPE in CREATE",listType);
        if({newlistType}===null){
            setListType([4]);
        }
        console.log("VALUE OF listType, newListType", listType, newlistType);
        //Build body of new list item

        /*if (listType===4)
        {
           let newListItem = {
            listType:listType,
            listItem:listItem,
            itemBought:false,
            date:Date()
            };
        }
        else{*/
            let newListItem = {
            
            listType:newlistType,
           listItem:listItem,
            itemBought:false,
            date:Date()
          //};
       };
    
       // console.log("VALUE OF NEWLISTITEM:", newListItem);

        // Add item to db
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                }
            };
            const body = JSON.stringify(newListItem);
            const res = await axios.post(
                'http://localhost:5000/api/lists',
                body,
                config
            );

          
    
           window.location.reload();
            history.push('/new-list');
        } catch (error) {
            console.error(`Error 3 creating list item: ${error}`);
        }

       //Build body to create or update the Index of lists for user

       }
 };
 
    const icreate = async(newListItem)=>{
    console.log("IN CREATE.....");

            //Update/add index entry into db
        const newIndex="list"+newListItem.toString+"TypeCreated";
        const newIndexEntry={newIndex:true};

        try{
            //console.log("token for updating Index:", token);
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                }
            };
            const body = JSON.stringify(newIndexEntry);
            console.log("About to call the post to updateIndex.")
            const res = await axios.post(
                'http://localhost:5000/api/updateIndex',
                body,
                config
            );
            }catch(error){
                console.error("Error Updating Index ..");
            }
        }



 

 const leavePage = async()=>{
  
    history.push('/');

   
    
 };



 return(
    <div className="form-container">

        <h2>Create New List Item</h2>
        <div className="InputItem">
        <textarea className="InputItem"
            name="listItem"
            cols="30"
            rows="2"
            value={listItem}
            onChange={e => onChange(e)}
        ></textarea>
        </div>
        <h3>Select Your List Type</h3>
        
        <button onClick={()=>getListType(1)} className="listChoices">Grocery List</button>
        <button onClick={()=>getListType(2)} className="listChoices">Christmas List</button>

        
        <button onClick={() => create()} className="listItemButtons">Submit</button>
        <button onClick={() => leavePage()} className="listItemButtons">Done</button>
    </div>
 );
};
export default CreateListItem;