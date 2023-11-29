const mongoose=require("mongoose");

module.exports=async(server)=>{
    try{
        //mongoose connection
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongo Connection Successful");
      
        
        //listening to server
        await server.listen(process.env.PORT,()=>{
            console.log("Server is running")
        });
    }
    catch(err){
        // console.log("mongo connection failed");
        console.log(err);

    }
};