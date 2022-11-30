import mongoose from 'mongoose';

const ListSchema = new mongoose.Schema({
    user:{
        type: 'ObjectId',
        ref: 'User'
    },
    listType: {
        type: Number,
    
    },
    listItem: {
        type: String,
        required: true
    },
    itemBought: {
        type:Boolean,
    },
    date:{
        type: Date,
        default: Date.now
    }
});

const List = mongoose.model('list',ListSchema);

export default List;