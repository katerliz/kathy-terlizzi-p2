import React,{useState} from 'react';
import axios from 'axios';
import {useHistory} from 'react-router-dom';
//import {Dropdown} from './Dropdown';
//import {element} from './Element';
import './styles.css';
//import e from 'express';
//import { getDefaultSettings } from 'http2';

const CreateListItem = ({ token, onPostCreated, convert, list,listType}) => {
    let history = useHistory();
    const [postData, setPostData]=useState({
         listItem:"",
        //listType:"4",
        bought:false,
           
    });
    const [newlistType, setListType]= useState([]);
 
//console.log("Value of list:",list);
//console.log("Value of list[0]",list[0]);
//console.log("WHAT IS THE ID!!!",list[0]._id);
//const listID=list[0];
//console.log("Value of listID",listID);
//const {listType,listItem,bought} = postData;
const {listItem,bought} = postData;
//let listType="8";
//const {listItem,bought}=postData;
//const {listTypeDisplay}= useState({listTypeDisplay:"General"});

//const itemDescription=listItem;

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

  const getListType=async(control,list)=>{
    console.log("RUNNING GETLISTTYPE....");
    //console.log("Passed in LISTYPE", listT);
    
    let listT=control;
    
    
    console.log("New Value of LISTT", listT);
    /*setPostData({
        ...postData,
       [listType]:listT
   })*/
   setListType(listT);
    //console.log("Middle Value of ListTYpe", listType);
    //if(listT!==null){
    listType=listT;
    //}else{
        //listType=4;
    //}
    console.log("NEW VALUE OF LISTTYPE ", listType)
    //const [listType]= useState({
     //   listType:listT});

    convert(listT);
  //  this.setState({listType:listT});
    // updateListType(listT,list2);
//};


//const updateListType =async(listT2,list) =>{

   /* console.log("Value of LISTT GOING TO DB",listT);
    console.log("Paired with ListItem:",listItem);
    console.log("For list id:", {list});
    const newListType = {
            listItem:listItem,
            listType:listType
        };

    try{
        console.log("ListTYpe right before PUT call",newListType.listType);
         const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                }
            }
           const body = JSON.stringify(newListType);
           const res = await axios.put(
            `http://localhost:5000/api/lists/${list[0]._id}`,body,config)
            .then(response => {
                console.log("Got a second response for listTYpe");
                //this.setState({listType:listT});
            })
         
    
        .catch (error => {
            console.error("Error 1 updating listType");
        });
  }catch(error){
    console.error("Error 2 updating listType");
  }*/
  

};  //end getlisttype
 
 


 const create = async()=>{
    console.log("IN CREATE.....");
    console.log("Value of enwLIstType now in create: ",newlistType);
    if(newlistType.length===0){
        getListType(4);
    }
    if(!listItem){
        console.log('Item description is required.');
    }else {
        console.log("LISTIEM IN CREATE:",);
        console.log("LISTTYPE in CREATE",listType);
        if(listType===4){
            setListType([listType]);
        }
        //Build body of new list item
        const newListItem = {
            
            listType:newlistType,
           listItem:listItem,
            itemBought:false,
            date:Date()
        };
    
        console.log("VALUE OF NEWLISTITEM:", newListItem);

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

           // icreate(newListItem);

            //convert(newListType);
            //Call the handler and redirect
    
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
    //redirect
    //this.setState({itemType:this.itemType});
    //console.log("Value of LISTTYPE IN LEAVE PAGE", listT);
    //convert(listT);
    //getListType(control, listT, list[0]);
    //getListType(listT,list);
    history.push('/');

    //window.location.reload();
    
 };



 return(
    <div className="form-container">

        <h2>Create New List Item</h2>
        <div class="InputItem">
        <textarea class="InputItem"
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