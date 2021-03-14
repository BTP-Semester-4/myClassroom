const mongoose=require("mongoose");
const uniqueValidator=require("mongoose-unique-validator");
const Schema=mongoose.Schema;
const passportLocalMongoose=require('passport-local-mongoose');

const UserSchema= new Schema({
  email:{
    type:String,
    required:true,
    unique:true,
  },
  name:String,
  value:Number,
});
UserSchema.plugin(passportLocalMongoose);
UserSchema.plugin(uniqueValidator, { message: 'Email already exist' });
module.exports=mongoose.model('User',UserSchema);
