import express, { application } from 'express';
import connectDatabase from './config/db';
import { check, validationResult} from 'express-validator';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import User from './models/User';
import Post from './models/Post';
import Lists from './models/Lists';
import Index from './models/Index';
import jwt from 'jsonwebtoken';
import config from 'config';
import auth from './middleware/auth';
import { Schema } from 'mongoose';



// Init express application

const app = express();

// Configure Middleware to parse JSON so endpoint understands User model.
app.use(express.json({extended: false}));
app.use(
    cors({
        origin: 'http://localhost:3000'
    })
);

connectDatabase();

// API endpoints
/**@route GET
 * @desc Test endpoint
 */

// Test endpoint
app.get('/',(req,res)=>res.send('http get request sent to root api endpoint'));

// Create HTTP POST request to log and return requested body.
// Register user.
app.post('/api/users', 
[
    check('name','Please enter your name').not().isEmpty(),
    check('email','Please enter a valid email').isEmail(),
    check('password','Please enter a password with 6 or more characters').isLength({min:6})
],
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(422).json({errors:errors.array()});
    } else {
        const { name,email,password} = req.body;
        try{
            // Check if user exists
            let user = await User.findOne({ email:email});
            if (user) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'User already exists'}] });
            }

            //Create new user
            user = new User({
                name: name,
                email: email,
                password: password
            });

            //Encrypt the password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            //Save to the db and return
            await user.save();
            
            
            // Generate and return a JWT token
            returnToken(user,res);  
            
        }catch(error){
            res.status(500).send('Server error ' + error);
        }

     }

    });

    /**
     * @route GET api/auth
     * @desc Authentication error
     */
    app.get('/api/auth', auth, async(req, res) => {
        try{
            const user = await User.findById(req.user.id);
            res.status(200).json(user);
        }catch (error){
            res.status(500).send('Unknown server error for authentication path');
        }
    });

    /**
     * @route POST API/login
     * @desc Login User
     */
    app.post(
        '/api/login',
        [
            check('email', 'Please enter a valid email').isEmail(),
            check('password', 'A password is required').exists()
        ],

        async (req,res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({errors:errors.array()});
            }else{
        
                const { email, password } = req.body;
    
                try{
                    //Check if user exists
                    let user = await User.findOne({email:email});
                    
                    if (!user) {
                        return res
                            .status(400)
                            .json({errors:[{msg:'Invalid email or password.'}] });
                    }

                    // Check password
                    const match = await bcrypt.compare(password, user.password);
                    if (!match) {
                        return res
                            .status(400)
                            .json({error: [{msg:'Invalid email or password.'}] });
                    }
                    //Generate and return a jwt token
                    returnToken(user,res);
                }catch(error) {
                    res.status(500).send('Server error');
                }
            }

        }
    );

    // Post endpoints
    /**
     * 
     * @route POST api/posts 
     * @desc Create post 
     */

    app.post(
        '/api/posts',
        [
            auth,
            [
                check('title','Title text is required.').not().isEmpty(),
                check('body','Body text is required.').not().isEmpty()
            ]
        ],
        async (req, res) => {
            const errors= validationResult(req);
            if(!errors.isEmpty()) {
                res.status(400).json({errors:errors.array()});
            }else {
                const {title,body} = req.body;
                try{
                    // Get the user who created the post
                    const user = await User.findById(req.user.id);

                    // Create a new post
                    const post = new Post({
                        user: user.id,
                        title:title,
                        body:body
                    });

                    // Save to the db and return
                    await post.save();
                    res.json(post);
                }catch (error) {
                    console.error(error);
                    res.status(500).send('Server error');
                }
            }
        }   
    
    );

     /**
     * 
     * @route Post api/index
     * @desc Post an Index entry to db
     */
    app.post('/api/updateIndex',auth, async(req,res)=>{
        //console.log("in api/index");
        const errors= validationResult(req);
            if(!errors.isEmpty()) {
                console.log("ERror in validation of index pkt..");
                res.status(400).json({errors:errors.array()});
            }else {
                const {itemNumber} = req.body;
                console.log("About to try to add index...");
                try{
                    // Get the user who created the post
                    const user = await User.findById(req.user.id);
                    const indexEntry="list"+itemNumber+"TypeCreated";
                    // Create a new post
                    const index = new Index({
                        user: user.id,
                        list1TypeCreated:false,
                        list2TypeCreated:true,
                        list3TypeCreated:false,
                        list4TypeCreated:false
                    });

                    // Save to the db and return
                    await index.save();
                    res.json(index);
                }catch (error) {
                    console.error(error);
                    res.status(500).send('Server error');
                }
            }
       }
    );

       // Post endpoints
    /**
     * 
     * @route POST api/lists 
     * @desc Create list 
     */

    app.post(
        '/api/lists',
        [
            auth,
            [
                check('listItem','a list item is required.').not().isEmpty()
    
            ]
        ],
        async (req, res) => {
            const errors= validationResult(req);
            if(!errors.isEmpty()) {
                console.log("Error validating list Item request.")
                res.status(400).json({errors:errors.array()});
            }else {
                //const {title,body} = req.body;
                const listText = req.body.listItem;
                const listT = req.body.listType;
                console.log("LISTT IN SERVER:",listT );
                //if (listT.length==0){
                //    listT=0;
                //}
                console.log("List Type is: ",listT);
                //console.log("REQUEST BODY  IS:" ,req.body);
               //console.log("REQUEST LISTITEM IS: ",req.body.listItem);
                try{
                    // Get the user who created the list item
                    const user = await User.findById(req.user.id);

                     // Create a new item
                    const item = new Lists({
                        user: user.id,
                        //user:user,
                        listType:listT,
                        listItem:listText,
                        itemBought:false,
                        date:Date()


                    });
                    
                    // Save to the db and return
                    await item.save();
                    console.log("Supposedly saved to db");
                    res.json(item);
                }catch (error) {
                    console.error(error);
                    res.status(500).send('Server error');
                }
            }
        }   
    
    );

    /**
     * 
     * @route GET api/index 
     * @desc Get the user's index of lists 
     */

    app.get('/api/index',auth, async(req,res)=>{
        try{
            const user = await User.findById(req.user.id);
            const index = await Index.find(user);
            res.json(index);
        } catch(error) {
            console.error(error);
            res.status(500).send('Server error');
        }
    });

    /**
     * 
     * @route GET api/list 
     * @desc Get list items 
     */

    app.get('/api/lists/xmas',auth, async(req,res)=>{
        const errors= validationResult(req);
        if(!errors.isEmpty()) {
                console.log("Error validating list Item request.")
                res.status(400).json({errors:errors.array()});
         }
        try{
             // Get the user who created the list item
            const user = await User.findById(req.user.id);
            console.log("in Try block for db search.");
            console.log("This user is:",user);
            //console.log("This list type is",listType);
            //const list = await Post.find(any).sort({date:-1});
            //const list = await Lists.find();
            const list = await Lists.find({
                user:user,
               // listItem:"llllll",
               listType:2
            });
           
            res.json(list);
           console.log("SERVER Found documents in DB: ");
           console.log("List of items found:", list);
        } catch(error) {
            console.error(error);
            res.status(500).send('Server error');
        }
    });

        app.get('/api/lists/groc',auth, async(req,res)=>{
        const errors= validationResult(req);
        if(!errors.isEmpty()) {
                console.log("Error validating list Item request.")
                res.status(400).json({errors:errors.array()});
         }
        try{
             // Get the user who created the list item
            const user = await User.findById(req.user.id);
            console.log("in Try block for db search.");
            console.log("This user is:",user);
            //console.log("This list type is",listType);
            //const list = await Post.find(any).sort({date:-1});
            //const list = await Lists.find();
            const list = await Lists.find({
                user:user,
               // listItem:"llllll",
               listType:1
            });
           
            res.json(list);
           console.log("SERVER Found documents in DB: ");
           console.log("List of items found:", list);
        } catch(error) {
            console.error(error);
            res.status(500).send('Server error');
        }
    });

          app.get('/api/lists/gen',auth, async(req,res)=>{
        const errors= validationResult(req);
        if(!errors.isEmpty()) {
                console.log("Error validating list Item request.")
                res.status(400).json({errors:errors.array()});
         }
        try{
             // Get the user who created the list item
            const user = await User.findById(req.user.id);
            console.log("in Try block for db search.");
            console.log("This user is:",user);
            //console.log("This list type is",listType);
            //const list = await Post.find(any).sort({date:-1});
            //const list = await Lists.find();
            const list = await Lists.find({
                user:user,
               // listItem:"llllll",
               listType:4
            });
           
            res.json(list);
           console.log("SERVER Found documents in DB: ");
           console.log("List of items found:", list);
        } catch(error) {
            console.error(error);
            res.status(500).send('Server error');
        }
    });

    /**
     * 
     * @route GET api/posts/:id
     * @desc Get post
     */

    app.get('/api/posts/:id', auth, async(req,res) =>{
        try{
            const {itemBought} =req.body;
            const list = await Lists.findById(req.params.id);

            // Make sure a post was found
            if(!list) {
                return res.status(404).json({msg:'List not found'});
            }

            res.json(list);

        } catch(error){
            console.error(error);
            res.status(500).send('Server error');
        }

    }
    );

    /**
     * 
     * @route DELETE api/posts/:id 
     * @desc Delete a post 
     */

    app.delete('/api/posts/:id', auth, async(req,res)=> {
        try {
            const post = await Post.findById(req.params.id);

            //Make sure the post was found
            if (!post) {
                return res.status.apply(404).json({msg: 'Post not found.'});
            }

            // Make sure the request user created the original post
            if (post.user.toString()!== req.user.id){
                return res.status(401).json({msg: 'User not authorized to remove post.'});
            }

            await post.remove();
            res.json({msg: 'Post removed.'});
        }catch (error) {
            console.error(error);
            res.status(500).send('Server error');
        }
    });

       /**
     * 
     * @route DELETE api/lists/:id 
     * @desc Delete a list item
     */

    app.delete('/api/lists/:id', auth, async(req,res)=> {
        try {
            console.log("in Delete in server.js...");
            const item = await Lists.findById(req.params.id);
            console.log("found the item: ", item);
            //Make sure the post was found
            if (!item) {
                return res.status.apply(404).json({msg: 'List Item not found.'});
            }
            console.log('FOUND ITEM TO DELETE....:', item);
            /* Make sure the request user created the original post
            if (listItem.user.toString()!== req.user.id){
                return res.status(401).json({msg: 'User not authorized to remove post.'});
            }*/

            await item.remove();
            res.json({msg: 'Item removed.'});
        }catch (error) {
            console.error(error);
            res.status(500).send('Server error');
        }
    });

    /**
     * 
     * @route PUT api/lists/:id 
     * @desc update a list 
     */

    app.put('/api/lists/bought/:id',auth, async (req,res) => {
        console.log("In app.put....");
        try{
            
            //const {title,body}=req.body;
            const {listItem,itemBought,listType}=req.body
            const item = await Lists.findById(req.params.id);

            //Make sure the list was found
            if(!item){
                return res.status(404).json({msg: 'Item not found'});
            }

            //Make sure the request user created the list
            if(item.user.toString()!== req.user.id){
                return res.status(401).json({msg: 'User not authorized to edit post.'})
            }

            //UPdate the items bought status and return
            //const listItem = await Lists.findById()
            console.log("value of body/itemBought in put: ",itemBought);
            //console.log("Value of itemType in put:",listType);
            //item.itemBought=newBought;
            
            await Lists.updateOne(
                {_id: item},
                    {$set:{
                       // "listType":listType,
                        "itemBought":itemBought
                        }});
            
            
            res.json(item);

        }catch (error) {
            console.error(error);
            res.status(500).send('Server error');
        }

    });


    //returnToken fn 
    const returnToken = (user,res) => {
        const payload = {
            user: {
                id:user.id
            }
        };

        jwt.sign(
            payload,
            config.get('jwtSecret'),
            {expiresIn:'10hr'},
            (err, token) => {
                if (err) throw err;
                res.json({token: token});
            }
        );
    };
    
// Connection listener
const port = 5000;
app.listen(port, () => console.log(`Express server running on port ${port}`));
