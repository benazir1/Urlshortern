const express = require("express");
const mongoose = require("mongoose");
const shortUrl =require('./models/shortUrls');
const app = express();
const dotenv =require("dotenv");

dotenv.config();


const PORT = process.env.PORT;
const DB_URL=process.env.DB_URL;

mongoose.connect(DB_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
.then(()=>console.log("connected to DB"))
.catch((err)=>console.log("could not connect to mongoDB",err));

app.set('view engine','ejs')
app.use(express.urlencoded({ extended:false }))

app.get("/",async(req,res)=>{
 const shortUrls = await shortUrl.find()
    res.render('index',{shortUrls: shortUrls });
})
app.post('/shortUrls',async(req,res)=>{
await shortUrl.create({full:req.body.fullUrl})
res.redirect('/')
})

app.get('/:shortUrl', async (req,res) =>{
  const shortUrls = await shortUrl.findOne({ short: req.params.shortUrl })
if(shortUrls === null)
return res.sendStatus(400)

shortUrls.clicks++
shortUrls.save()

res.redirect(shortUrls.full)
})

    
app.listen(PORT,()=>{
    console.log("server is running in PORT",PORT)
});