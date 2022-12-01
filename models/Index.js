import mongoose from 'mongoose';

const IndexSchema = new mongoose.Schema({
    user:{
        type: 'ObjectId',
        ref: 'User'
    },
    list1TypeCreated: {
        type: Boolean,
    
    },
    list2TypeCreated: {
        type: Boolean,
    },
    list3TypeCreated: {
        type:Boolean,
    },
    list4TypeCreated:{
        type: Boolean,
    }
});

const Index = mongoose.model('index',IndexSchema);

export default Index;