//we build server
const express=require('express')
const cors =require('cors');
const bcrypt =require('bcrypt')
const jWt=require('jsonwebtoken')
const dotenv=require('dotenv')
dotenv.config()
const {rateLimit}=require('express-rate-limit')
let secretkey=process.env.SECRETKEY

const app=express();
const port=process.env.port

//step 1 require the package means import mongoose
const mongoose=require('mongoose');

//sste 2 establish a connection
//connection string
async function connection(){
  await mongoose.connect(process.env.MONGODBURL)
}
//step 3 create schema
let productschema =new mongoose.Schema({
  title:{type:String,required:true},
  price:{type:Number,required:true},
  image:{type:String,required:true},
})

//step 4 create model
const productsmodel= mongoose.model('products',productschema)


const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
	// store: ... , // Redis, Memcached, etc. See below.
})




////middleware
app.use(cors())

app.use(limiter)

app.use(express.json())


 
////design an api

app.get('/',(req,res)=>{
    res.send('Hello guys')
})

/

////design an api where seller send the product (data) now


//let finalproducts= await productsmodel.findOne({title:'chair'})
//console.log(finalproducts)

//let finalproducts= await productsmodel.findById("69575d7f3cbfebd304223b38")
//console.log(finalproducts)


//let  finalproducts=await productsmodel.create([{
  
//title:"premium bag",
//price:"200",
//image:"https://res.cloudinary.com/dhdepk5ib/image/upload/v1757696461/samples/ecommerce/leather-bag-gray.jpg"
//}])


//let finalproducts= await productsmodel.findByIdAndUpdate("69575fd49239f09a2efdd0f3",{title:'premium chair'} )
//console.log(finalproducts)


////design an api where seller send the details and i will store in database
app.post('/products',async(req,res)=>{
  try{
      const{title,price,image}=req.body
      await productsmodel.create({title,price,image})
      res.status(201).json({msg:"products are added successfully"})
    }catch(error){
      res.json({
        msg:error.message
      })
    }
   })


//api 3 --> fetch the data from the db and send these data to client
app.get('/products',async(req,res)=>{
  try{
   let products= await productsmodel.find()
   res.status(200).json(products)

  }catch (error){
    res.json({
      msg:error.message
    })
  }
})

app.delete('/products',async(req,res)=>{
  try{
   let products= await productsmodel.findByIdAndDelete("69575fd49239f09a2efdd0f4")
   res.status(200).json({
     msg:"products deleted successfully"
    })
    
  }catch (error){
    res.json({
      msg:error.message
    })
  }
})

app.put('/products',async(req,res)=>{
  try{
    let products= await productsmodel.findByIdAndUpdate("69575fd49239f09a2efdd0f4" ,{price:150})
    res.status(200).json({
      msg:"products updated successfully"
    })
    
  }catch (error){
    res.json({
      msg:error.message
    })
  }
})

let userschema =new mongoose.Schema({
  email:{type:String,required:true,unique:true},
  username:{type:String,required:true},
  password:{type:String,required:true},
})

const usermodel = mongoose.model('users',userschema)



//registration

app.post('/register',async(req,res)=>{
  try{
    const {email,username,password}=req.body
    
    let users=await usermodel.findOne({email})
    if(users) return res.json("user already exists")
      //hasspassword
    let hassedpassword =await bcrypt.hash(password,10)
    await usermodel.create({email,username,password:hassedpassword})
    res.status(201).json("registration successful")
  }catch (error){
    res.json({msg:error.message})
  }
})


//login
app.post('/login',async(req,res)=>{
  try{
    const{email,password}=req.body
    let users=await usermodel.findOne({email})
    if(!users) return res.json({msg:"invalid credentials"})
      let checkpassword=await bcrypt.compare(password,users.password)
    if(!checkpassword) return res.json({"msg":"email or password is incorrect"})
      let payload={email:email} 
    let token= jWt.sign(payload,secretkey,{expiresIn:'1h'})
    res.json({msg:"login successful",token:token
    }) 
  } catch(err){
    res.json({
      msg:err.message
    })
  }})
  
  
  app.listen(port,async()=>{
      console.log(`server is running on ${port}`)
      connection();
      console.log("DB connected")
  })