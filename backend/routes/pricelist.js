const express = require("express");
const DlyRate = require("../models/DlyRate");
const { body, validationResult } = require("express-validator");
const router = express.Router();

var fetchuser = require("../middleware/fetchuser");


//ROUTE 1: Get all the Notes using : GET "/api/auth/getuser" . Login required
router.get('/fetchallpricelist',async(req,res)=>{
  try {
      const list=await DlyRate.find({}).sort({vegname:1})
      console.log(list)
      res.json(list) 
  } catch (error) {
      console.error(error.message)
      res.status(500).send("Some error occurred")
 
  }
  
})


//ROUTE 2: Add a new Note using : POST "/api/auth/addnote" . Login required
router.post('/addpricelist',fetchuser,[
  body('vegname','Enter name of a vegetable in Min 3 characters').isLength({min:3}),
  body('price', 'Enter  Current Price'),
  body('unit', 'Enter unit such as Rs/Kg').isLength({min:5}),
  body('tag', 'Enter tag').isLength({min:3}),
  
],async(req,res)=>{

  try {
      const {vegname,price,unit,tag}=req.body

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
const list=new DlyRate({
  vegname,price,unit,tag,user1:req.user1.id,user2:req.user1.id
})
 const saveList=await list.save()

  res.json(saveList)
  } catch (error) {
      console.error(error.message)
    res.status(500).send("Some error occurred")

  }

})

//ROUTE 3: Update a Note using : PUT "/api/auth/updatenote" . Login required
router.put('/updateprielist/:id',fetchuser,async(req,res)=>{
  const {vegname,price,unit,tag}=req.body

  const newList={};
  if(vegname){newList.vegname=vegname}
  if(price){newList.price=price}
  if(unit){newList.unit=unit}
  if(tag){newList.tag=tag}
  //newList.user2=req.user1.id

  //find the note to be updated
  let list=await DlyRate.findById(req.params.id)
  if(!list){res.status(404).send("Not Found")}
  if(list.user1.toString()!==req.user1.id){
      newList.user2=req.user1.id
  }
  list=await DlyRate.findByIdAndUpdate(req.params.id,{$set:newList},{new:true})
  res.json(list)
  console.log(list)
})


//ROUTE 4: Delete a Note using : DELETE "/api/auth/deletenote" . Login required
router.delete('/deletepricelist/:id',fetchuser,async(req,res)=>{
        
    try {
        //find the note to be deleted
    let list=await DlyRate.findById(req.params.id)
    if(!list){res.status(404).send("Not Found")}
    //Allow deletion only if user owns this note
    if(list.user1.toString()!==req.user1.id){
        return res.status(401).send("Only Creator can delete ! Other user can allowed to Update ")
    }

    list=await DlyRate.findByIdAndDelete(req.params.id)
    res.json({"success":"Note has been deleted",list:list})
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Some error occurred")
   
    }
    
  })
    



module.exports = router;
