const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const commentSchema={
  crtby:String,
  comment:String,
  time:String
};

const postSchema= new Schema ({
  postby:String,
  title: String,
  content: String,
  time:String,
  commen:[commentSchema]
});

module.exports=mongoose.model('Post',postSchema);
