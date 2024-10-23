const mongoose=require('mongoose');
const {Schema}=mongoose;

const commentSchema=new Schema({
    post_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post',
        required:true,
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    comment:{
        type:String,
        required:true,
    },
    created_at:{
        type:Date,
        default:Date.now,
    },
},
{
timestamps:true,
});

const Comment=mongoose.model('Comment',commentSchema);
module.exports=Comment;