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

const getCompany = async (req, res) => {
    try {
        const { companyName } = req.query;

        let query = {};
        if (companyName) {
            query.companyName = companyName;
        }

        let companies = await companyData.find(query);

        res.send({ "success": true, "data": companies });
    } catch (error) {
        return res.status(400).json({ success: false, error: error });
    }
};

const insertCampaignDetails = async (req, res) => {
    try {
       
        let campaignDetails = req.body;

       
        let campaign = await campaignData.create(campaignDetails);

        res.send({ success: true, data: campaign });
    } catch (error) {
        return res.status(400).json({ success: false, error });
    }
};
const getCampaignDetails = async (req, res) => {
    try {
        const { campaignName } = req.query;
        let query = {};
        if (campaignName) {
            query.campaignName = campaignName;
        }
        let campaigns = await campaignData.find(query);
        res.send({ success: true, data: campaigns });
    } catch (error) {
        return res.status(400).json({ success: false, error });
    }
};




//getcompany

module.exports = { createCompany, getCompany, insertCampaignDetails, getCampaignDetails };