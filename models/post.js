const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const commentSchema={
  comment:String,
  time:String
};

const postSchema= new Schema ({
  title: String,
  content: String,
  commen:[commentSchema]
});

module.exports=mongoose.model('Post',postSchema);
