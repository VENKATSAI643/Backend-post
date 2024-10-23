const mongoose=require('mongoose');
const {Schema}=mongoose;

const postSchema=new Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    image_url:{
        type:String,
        required:true,
    },
    caption:{
        type:String,
        default:'',
    },
    likes_count:{
        type:Number,
        default:0,
    },
    comments_count:{
        type:Number,
        default:0,
    },
    created_at:{
        type:Date,
        default:Date.now,
    },
    updated_at:{
        type:Date,
        default:Date.now,
    },

},
    {
        timestamps:true,
    });

const Post=mongoose.model('Post',postSchema);
module.exports=Post;