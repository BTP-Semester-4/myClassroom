const mongoose=require('mongoose');
const Schema=mongoose.Schema;   //no need of writing mongoose.Schema everytime instead jst write Schema

const ResourceSchema=new Schema({
    name: String,
    year: String,
    subject: String,
    type: String,   //resources or announcement
    type_title: String,   //description of that subject
    text: String
});

module.exports=mongoose.model('resource',ResourceSchema); //make available outside  model-resource