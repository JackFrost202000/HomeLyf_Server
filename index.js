//Imports from packages
const express = require("express");
const mongoose = require("mongoose")
const cors = require("cors");


//Import from other files
const authRouter = require('./routes/auth');
const adminRouter = require("./routes/admin");
const productRouter = require("./routes/product");

//INIT
const PORT = process.env.PORT || 3000;
const app = express();
const DB = "mongodb+srv://amitpotdukhe20:cmPUrefrPzB0BIuW@homelyfcluster0.4fzxngg.mongodb.net/?retryWrites=true&w=majority";

//middleware
app.use(cors());
app.use(express.json());
app.use(authRouter);
app.use(adminRouter);
app.use(productRouter);

//connections
mongoose.connect(DB).then(()=>{
    console.log("Connection Successful");
})
.catch((e)=>{
    console.log(e);
});

app.listen(PORT, "0.0.0.0", ()=>{
    console.log(`connected at port ${PORT}`);
});
