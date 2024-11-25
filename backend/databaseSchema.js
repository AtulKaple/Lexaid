import mongoose from 'mongoose';


const dataSchema=new mongoose.Schema({
    inputPrompt:{
        type:String,
        required:true
    },
    outputResponse:{
        type:String,
        required:true
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  });

  const Queries = mongoose.model('query',dataSchema);

  export default Queries;