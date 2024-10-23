const mongoose=require('mongoose');
const {Schema}=mongoose;

const likeSchema=new Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    post_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post',
        required:true,
    },
    liked_at:{
        type:Date,
        default:Date.now,
    },
},
{
    timestamps:true,
    indexes:[
        {
            unique:true,
            fields:['post_id','user_id'],
        },
    ],
});

const Like=mongoose.model('Like',likeSchema);
module.exports=Like;