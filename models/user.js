const mongoose=require("mongoose");
const userSchema=new mongoose.Schema(
    {
    username:{
        type:String,
        unique:true,
        required:[true,"Username is required"]
    },
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    email:{
        type:String,
        unique:true,
        required:[true,"Email id is required"]
    },
    role:{
      type:String,
      required:[true,"Role is required"]
    }
    }

)

module.exports=mongoose.model("user",userSchema);