const mongoose = require("mongoose");

var messageSchema = new mongoose.Schema(
  {
     from: {
       id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
       },
       user: {
         type: String,
         required: true
       }
     },
     text: {
       type: String,
       required: true,
       minlength: 1,
       maxlength: 144
     }
  }
);

module.exports = mongoose.model("Message", messageSchema);
