const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const votedSchema={
    user:String,
    value:Number,
  };
  

const pollSchema= new Schema ({
  
  title: String,
  voted:[votedSchema]
});

module.exports=mongoose.model('Poll',pollSchema);
