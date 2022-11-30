import React, {useState} from 'react';
import axios from 'axios';
import {useHistory} from 'react-router-dom';
import './styles.css'

const UpdateBought = ({token,bought}) =>{
    //const [postData, setPostData] = useState({
        //token:token
    //let history = useHistory();
    const [postData, setPostData]=useState({
        token:token,
        bought:false

    });


const color='';
  
const updateAndSetColor = async()=>{
    try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                }
            };
            const body = bought;
            const res = await axios.put(
                `http://localhost:5000/api/lists/${bought._id}`,
                body,
                config
            );

              if (bought){
                color='ltblue';                      
            }
            else{
                color='white'
            }
        setPostData({
            ...postData,
            [bought]: !bought,
            [color]:color
           
                
        })
        //renderButton(color);

    } catch (error) {
            console.error(`Error updating bought flag: ${error.response.data}`);
    }
    


 return (
     <div className="bought-button" >       
    
        <button className={'colorSelect'+color}  onClick={() => updateAndSetColor(bought)}>Bought</button>
    </div>
 );

};
};

export default UpdateBought;