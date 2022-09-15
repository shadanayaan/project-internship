const internModel = require('../model/internModel')
const collegeModel = require('../model/collageModel')
const validator = require ("validator")





const createIntern = async function (req,res) {
    try {
        const internData = req.body
        const { name, mobile, email, collegeName} = internData
        
        if (Object.keys(internData).length < 1){
        return res.status (400).send({status : false, message : "Bad request"})
        }
//------------------intern name validation---------------
        if (!internData.name){
        return res.status (400).send({status: false, message : "required name"})
        }
        
        if (!(/^[a-zA-Z ]{3,}$/).test(internData.name))
        return res.status(400).send({status:false, message:'Only alphabets in name!!'})

//------------------intern name validation---------------
        if (!internData.name){
        return res.status (400).send({status: false, message : "required name"})
        }
        
        if (!(/^[a-zA-Z ]{3,}$/).test(internData.name))
        return res.status(400).send({status:false, message:'Only alphabets in name!!'})

//------------------intern CollegeName validation---------------
        if (!internData.collegeName){
        return res.status (400).send({status: false, message : "required collegeName"})
        }
        
        if (!(/^[a-zA-Z]{3,5}$/).test(internData.collegeName))
        return res.status(400).send({status:false, message:'Only alphabets in collegeName and length between (3-5)'})


// -----------------for email validation------------------
        if (!internData.email){
        return res.status (400).send({status : false, message: "required email"})
        }

        if (!validator.isEmail(internData.email.trim())){
        return res.status(400).send({status : false, message : "required valid email"})
        }

        const findEmail = await internModel.find({email : internData.email})

        if (findEmail.length > 0){
        return res.status(400).send({status : false, message :"email is aldready taken"})
        }
        
// --------------------for phone validation----------------
        if (!internData.mobile){
        return res.status(400).send({status : false, message : "required mobile Number"})
        }
        
        if (!(/^[0-9]{10}$/).test(internData.mobile)){
        return res.status(400).send({status : false, message : "mobile number is invalid"})
        }

        const findMobile = await internModel.find({mobile : internData.mobile})
       
        if (findMobile.length > 0){
        return res.status(400).send({status : false, message :"mobile Number is aldready taken"})
        }

    //------------------collegeDetails validation-------------------- 

        let collegeDetails = await collegeModel.findOne({name:collegeName})
        
        if (!collegeDetails){
        return res.status(400).send({ status : false, message : "college details not found"})
        }

        let collegeId = collegeDetails._id
        let newData ={name,mobile,email,collegeId}
        const newIntern = await internModel.create(newData)
        
        return res.status(201).send({status:true, message:"internship successfully created", data:newIntern})
        
    }
    catch(err) {
        return res.status(500).send({status: false, message:"Error" ,error:err.message})
    }
}


const geDetails = async function(req, res){
    try{    
        let name = req.query.name

//---------------validation for name(collgeName abberiviation)----------------------------
        let query = req.query    
        let comp = ['name']
        if(!Object.keys(query).every(ele=>comp.includes(ele)))
        return res.status(400).send({status : false, message : "wrong query given"})

        if (!name){
        return res.status(400).send({status : false, message : "name is required"})
        }
        
        if (!name.trim() || !(/^[a-zA-Z]{3,}$/).test(name)){
        return res.status(400).send({status : false, message : "Enter valid abbreviation"})
        }

        let collegeData = await collegeModel.findOne({name:name})

        //-----if college not found--------
        if(!collegeData){
        return res.status(400).send({status : false, message : "college not found"})
        }

        let college_id =collegeData._id

        //-----if college_id not found--------
        if(!college_id){
        return res.status(400).send({status : false, message : "college id is not found"})
        }

        let internData =await internModel.find({collegeId:college_id, isDeleted: false}).select({name:1,email:1,mobile:1})
        
        res.status(200).send({staus:true, name:collegeData.name,fullName:collegeData.fullName,logoLink:collegeData.logoLink,interns:internData})
        
        }catch(err){
        return res.status(500).send({status:false, message:'Error', error:err.message})
        }
    }
    
    
    module.exports.geDetails=geDetails
    module.exports.createIntern=createIntern