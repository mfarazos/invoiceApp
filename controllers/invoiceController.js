const mongoose = require("mongoose");
const { CompanySchema } = require ("../schema/companySchema.js");
const { ComopaignSchema } = require ("../schema/comopaignSchema.js");
const companyData = mongoose.model("company", CompanySchema);
const companyCompaigns = mongoose.model("compaign", ComopaignSchema);
const  response  = require("../helper/response.js");

const createCompany = async (req, res) => {
    try {
        let companyName = req.body.companyName

        let company = await companyData.insertMany({companyName: companyName });
     
        res.send({"sucess": true, "data": company})    
    } catch (error) {
        return res.status(400).json({ sucess: false , error: error }); 
    }
    
    
}

//getcompany

module.exports = {createCompany };