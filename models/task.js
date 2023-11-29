const mongoose=require("mongoose");
const taskSchema=new mongoose.Schema(
    
    {
    taskName:{
        type:String,
    },
    description:{
        type:String,
    },
    assignedTo:{
        type:String,
    },
    duration:{
        type:String,
    },
    status:{
      type:String
    },
    notification:{
        type:String
    },
    taskId:{
        type:String
    },
    comments:{
        type:String
    }
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
)

module.exports=mongoose.model("task",taskSchema);