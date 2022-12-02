import './App.css';
import React from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route, Link, withRouter } from 'react-router-dom';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import PostList from './components/PostList/PostList';
import Post from './components/Post/Post';
import CreatePost from './components/Post/CreatePost';
import EditPost from './components/Post/EditPost';
import PostListItem from './components/PostList/PostListItem';
import CreateListItem from './components/ListItem/CreateListItem';
//import UpdateBought from './components/ListItem/UpdateBought';




class App extends React.Component {
  state = {
    list: [],
    listItem: null,
    //listType:0,
    //bought:false,
    boughtChanged:false,
    posts: [],
    post: null,
    token: null,
    user: null,
    displayNewList: false,
    listType:4,
    listDisplay:"Christmas",
   //listName:"Xmas",
    updateButtons: false,
    initialize:"true"
    //newItem:true
  };  //end state


  componentDidMount() {    
      this.authenticateUser();
  };  // end componentDidMount


  authenticateUser = () => {
    
    const token = localStorage.getItem('token');

    if (!token){
      localStorage.removeItem('user')
      this.setState({ user: null});
    }  //end if no token

    if (token) {

      const config = {
        headers:{
          'x-auth-token': token
        }
      };
      axios.get('http://localhost:5000/api/auth', config)  
        .then((response) =>{
          localStorage.setItem('user', response.data.name)
          //this.setState({user: response.data.name})
          this.setState(
         {
          user: response.data.name,
          token: token
         },
          () => {
            this.loadData();
         }
        );
        })
        .catch((error) => {
          localStorage.removeItem('user');
          this.setState({user:null});
          console.error('Error logging in user. ');
        })
        
    
  }  // end if token

  };  //end AuthenticateUser    

  
   loadData = (listName) =>{

    
      let {initialize} = this.state;

      console.log("in loadData....");
      
      console.log("Value of initialize:",initialize);
      
      const {token} = this.state;
      if(initialize===true){
        listName="Xmas";
        this.setState({initialize:false});     
       }

      console.log("Value of listName:",listName); 
      
      if (token) {
    
      const config = {
        headers:{
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      };
     // const {listItem} = this.state;
     

  //console.log("Value of listItem in loadData", listItem);
        // Get the user's desired list
        if(listName==="Xmas"){
         axios.get('http://localhost:5000/api/lists/xmas', config)  
        .then((response) =>{
          this.setState({list: response.data});
         
           console.log("THese are the list values:",response.data);
           //let LD = this.convert(response.data[0].listType);
           this.setState({listDisplay:"Christmas"});
           this.displayNewList=false;
        })
        .catch((error) => {
          console.error('Error fetching data: ');
        });
      } else if (listName==="Groc"){
         axios.get('http://localhost:5000/api/lists/groc', config)  
        .then((response) =>{
          this.setState({list: response.data});
         
           console.log("THese are the list values:",response.data);
           //let LD = this.convert(response.data[0].listType);
           this.setState({listDisplay:"Grocery"});
           this.displayNewList=false;
           //window.location.reload();
        })
        .catch((error) => {
          console.error('Error fetching data: ');
        });

      } else{

         axios.get('http://localhost:5000/api/lists/gen', config)  
        .then((response) =>{
          this.setState({list: response.data});
         
           console.log("THese are the list values:",response.data);
           //let LD = this.convert(response.data[0].listType);
           this.setState({listDisplay:"General"});
           this.displayNewList=false;
           
           
        })
        .catch((error) => {
          console.error('Error fetching data: ');
        });
      }
      this.setState({updateButtons:true});
    //this.history.pushState("/");

    }  // end if token
    
   };  // end loadData

   getList = listName =>{

    
      this.loadData(listName);
    
      
    

   }; //end getList

   viewPost = post => {
      console.log(`view ${post.title}`);
      this.setState({
        post:post
      });
   };  // end ViewPost

   deleteItem = listItem =>{
    const {token, list}=this.state;
    console.log("list, listItem: ", {list},{listItem});

    if (token) {
      const config = {
        headers: {
          'x-auth-token':token
        }  
      }
      console.log("listItem in app.js:", {listItem});
      axios
        .delete(`http://localhost:5000/api/lists/${listItem._id}`, config)
        .then(response => {
          const newList = this.state.list.filter(p =>p._id !== listItem._id);
          this.setState({
            lists: [...newList]
          });
          this.displayNewList=true;
          //this.setState({displayNewList:true});
          window.location.reload();
        })
        .catch(error => {
          console.error(`Error deleting item: ${error}`);
        });
    }
  };  // end Delete Item

  editListItem = listItem => {
   
    this.setState({
      listItem:listItem
    });
  };   //end editPost

  onListItemCreated = (listItem,listType,listDisplay)=>{
    console.log("IN onlistItemCreated.");
    const newList = [...this.state.list];
    //this.convert(listType);
    this.setState({
      list:newList,
      listItem:listItem,
      listType:listType,
      listDisplay:this.convert(newList[0].listType)    

    });

    console.log("Updated state var:", this.State);
   
    this.list.itemBought=false;
    this.displayNewList=true;
    this.setState({displayNewList:true});
   
    //this.setState({bought:false});
    

  };   //end onListItemCreated

  handleUpdateBought = (list, listItem, displayNewList,listType) => {
        //let history= useHistory();
       //UpdateBought(bought);
      // console.log("initial VALUE OF BOUGHT IN HANDLEUPDATEBOUGHT", `${list.itemBought}`);
       //console.log("VALUE of STATE:",this.state);
        const {token}=this.state;
        //const bought=list.bought;
      
        console.log("HANDLEUPDATE BOUGHT CALLED FOR ITEM",`${list.listItem}` );
        
        if (list.itemBought===false){ //&& (this.boughtChanged===true)){
          //this.setState({bought:true});
          list.itemBought=true;

        }else{ 
          //this.setState({bought:false});
          list.itemBought=false;
        }
      
        this.displayNewList=true;
      
        //console.log("Toggled value of bought:",list.itemBought);
    
    const updateBought  =  async() =>{
      const {token}=this.state;
    //if (token) {
      //console.log("VALUE of BOUGHT IN UPDATETOGGLEBOUGHT: ",list.itemBought);
      const newBought = list.itemBought;
      const newListStatus = {
          listItem:list.listItem,
          itemBought:newBought, 
         // listType: list.listType

      };
    try{
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token':token
        }  
      }
      const body=JSON.stringify(newListStatus);
      //console.log("ABOUT TO CALL AXIOS PUT");
      //console.log("THis List.ID :", list._id);
      //console.log("token:",token);
      //console.log("body:" ,{body});

      const res = await axios.put(
        `http://localhost:5000/api/lists/bought/${list._id}`,body,config)
        .then(response => {
          console.log("GOT A RESPONSE");
          //const newList = this.state.list.filter(p =>p._id !== listItem._id);
          this.setState({
             itemBought:list.itemBought,
             //itemTypeState:list.listType
          });
          this.displayNewList=true;
          this.boughtChanged=true;
          //window.location.reload();
          //this.setState({displayNewList:true});
          //history.pushState('/');
        })
        .catch(error => {
          console.error(`Error updating bought: ${error}`);
        });

    }catch (error){
      console.error(`Error updating bought:`);
    }
 // };  // end UpdatePost
    
  };
  updateBought(list.itemBought);

};

convert=(listT)=>{
  console.log("IN CONVERT....)");
  //let listType2=list[list.length-1].listType;
  //let listDisplay="General";
  //listT=this.list[this.list.length-1].listType;
  if(listT===1){ 
        this.setState({listDisplay:"Grocery"});
        this.listDisplay="Grocery";
        this.setState({listType:1});
  }
   else if (listT===2){
        //this.updateState({listType:"Christmas"});
        this.setState({listDisplay:"Christmas"});
        this.setState({listType:2});
        this.listDisplay="Christmas";
        
   }

  else if (listT===3){
        //this.setState({listType:"CLothing"});
        this.setState({listDisplay:"CLothing"});
        this.setState({listType:3});
        this.listDisplay="Clothing";
  }

  else{
        this.setState({listDisplay:"General"});
        this.listDisplay="General";
        this.setState({listType:4});
  }
  return this.listDisplay;
};


   
   logOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.setState({user:null, token:null});
    this.setState({initialize:true});
    this.setState({listName:"Xmas"});
   }; // end logOut
  
  


  render() {
    let { user, list, post, listItem, token, listType,listDisplay,displayNewList} = this.state;
    const authProps = {
      authenticateUser: this.authenticateUser,
    };
  
       

    return  (
    <Router>
      <div className="App"> 
        <header className="App-header">
        <h1 id="title">List It!</h1>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
             {(user)? (
              <Link to="/new-list">Create List</Link>
        
             ) : (
              <Link to="/register">Register</Link>
             )}
            </li>
            <li>
              {user? (
                <Link to="" onClick={this.logOut}>Logout</Link>
              ) : (
                <Link to="/login">Log in</Link>
              )}
            </li>
            
          </ul>
        </header>
        <main>
         <Switch>
          <Route exact path="/">
            {user ? (
              <React.Fragment>
              <div id="homePage">
              <div id="listLinks">
              
                    <React.Fragment>
                    <button id="index" onClick={()=>this.getList("Xmas")}>Christmas List</button>
                    <button id="index"onClick={()=>this.getList("Groc")} >Grocery</button>
                    <button id="index"onClick={()=>this.getList("Gen")}>General List</button>
                    </React.Fragment> 
                
              </div>
              <div id="actualList">
              <div id="greeting"> {user}'s {listDisplay} List!</div>
              
                {this.displayNewList===true? (
                   this.displayNewList=false
                   //window.location.reload()
                ) : (this.displayNewList)}

              <PostList
                list={list}
                listItem={listItem}
                clickPost={this.viewPost}
                PostListItem={this.PostListItem}
              
                deleteItem={this.deleteItem}
                handleUpdateBought={this.handleUpdateBought}
              
                editListItem={this.editListItem}
                //bought={bought}
                boughtChanged={this.boughtChanged}
                listType={listType}
                displayNewList={displayNewList}
                />
              </div>
              </div> 
              </React.Fragment> 
            )  :  (
              <React.Fragment>
              <div id="initMsg">
               Please Register or Login.
               </div>
              </React.Fragment>
              
            )} 
          </Route>
          
          <Route path="/posts/:postId">
              <Post post={post} />                  
          </Route>
          <Route path="/new-list">
              <CreateListItem token={token} onListItemCreated={this.onListItemCreated} convert={this.convert} list={list}/>
            
          </Route>
          <Route path="/edit-post/:postId">
              <EditPost
              token={token}
              post={post}
              onPostUpdated={this.onPostUpdated}/>
          </Route>
          <Route 
              exact path="/register"
              render ={()=><Register {...authProps}/>}
            />
            
            <Route 
              exact path="/login" 
              render={() => <Login {...authProps}/>}
            />
          </Switch>
    
         </main>   
      </div>
    </Router>
  );
 }  //end render
}

export default App;
