import React,{useState} from 'react';
import axios from 'axios';
import {useHistory} from 'react-router-dom';
//import {Dropdown} from './Dropdown';
//import {element} from './Element';
import './styles.css';
//import { getDefaultSettings } from 'http2';

const CreateListItem = ({ token, onPostCreated, convert, list}) => {
    let history = useHistory();
    const [postData, setPostData]=useState({
        listItem:"",
        listTypeState:"8",
        bought:false,
           
    });
console.log("Value of list:",list);
console.log("Value of list[0]",list[0]);
//console.log("WHAT IS THE ID!!!",list[0]._id);
//const listID=list[0];
//console.log("Value of listID",listID);
//const {listType,listItem,bought} = postData;
const {listType,listItem,bought} = postData;
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
    });*/
    //console.log("Middle Value of ListTYpe", listType);

    convert(listT);
    // updateListType(listT,list2);
//};


//const updateListType =async(listT2,list) =>{

    console.log("Value of LISTT GOING TO DB",listT);
    console.log("Paired with ListItem:",listItem);
    console.log("For list id:", {list});
    const newListType = {
            listItem:listItem,
            listType:listT
        };

    try{
        console.log("ListTYpe right before PUT call",listType);
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
  }
  

};  //end getlisttype
 
 


 const create = async()=>{
    if(!listItem){
        console.log('Item description is required.');
    }else {
        //console.log("LISTIEM IN CREATE:",listItem);
        //console.log("LISTTYPE in CREATE",listType);
        const newListItem = {
            //user:"DEF@gmail.com",
            listType:listType,
           listItem: listItem,
            itemBought:false,
            date:Date()
        };
    
        console.log("VALUE OF NEWLISTITEM:", newListItem);
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

            //Call the handler and redirect
            
           window.location.reload();
            history.push('/new-list');
        } catch (error) {
            console.error(`Error 3 creating list item: ${error}`);
        }





    }
 };

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
         <h3>Select Your List Type</h3>
        
        <button onClick={()=>getListType(1,list)} className="listChoices">Grocery List</button>
        <button onClick={()=>getListType(2,list)} className="listChoices">Christmas List</button>
        <h2>Create New List Item</h2>
        <textarea className="inputItem"
            name="listItem"
            cols="30"
            rows="2"
            value={listItem}
            onChange={e => onChange(e)}
        ></textarea>

        
        <button onClick={() => create()} className="listItemButtons">Submit</button>
        <button onClick={() => leavePage()} className="listItemButtons">Done</button>
    </div>
 );
};
export default CreateListItem;