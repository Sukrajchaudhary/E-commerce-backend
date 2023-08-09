const { Brand } = require("../model/Brand")

exports.fetchBrans= async(req,res)=>{
    try {
        const brans=await Brand.find({}).exec();
        res.status(200).json(brans)
    } catch (error) {
        return res.status(400).json(error.message)
    }
}
exports.createBrans= async(req,res)=>{
    try {
        const brands= await Brand(req.body);
        const response=await brands.save();
        res.status(200).json(response)
    } catch (error) {
        return res.status(400).json(error.message)
    }
}