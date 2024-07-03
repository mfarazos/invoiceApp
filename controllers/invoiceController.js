// invoiceController.js

const mongoose = require('mongoose');
const { companySchema } = require('../schema/companySchema');
const { compaignSchema } = require('../schema/comopaignSchema');
const companyData = mongoose.model("company", companySchema);
const campaignData = mongoose.model('campaign', compaignSchema);

const createCompany = async (req, res) => {
    try {
        let companyName = req.body.companyName;

        let company = await companyData.create({ companyName });

        res.send({ success: true, data: company });
    } catch (error) {
        return res.status(400).json({ success: false, error });
    }
};

const getCompany = async (req, res) => {
    try {
        const { companyName } = req.query;

        let query = {};
        if (companyName) {
            query.companyName = companyName;
        }

        let companies = await companyData.find(query);

        res.send({ success: true, data: companies });
    } catch (error) {
        return res.status(400).json({ success: false, error });
    }
};

const insertCampaignDetails = async (req, res) => {
    try {
        // Extract campaign details from request body
        let campaignDetails = req.body;

        // Insert campaign details into MongoDB
        let campaign = await campaignData.create(campaignDetails);

        res.send({ success: true, data: campaign });
    } catch (error) {
        return res.status(400).json({ success: false, error });
    }
};

const getCampaignDetails = async (req, res) => {
    try {
        const { campaignName } = req.query;

        if (!campaignName) {
            return res.status(400).json({ success: false, error: "Campaign name is required." });
        }

        let campaign = await campaignData.findOne({ campaignName });

        if (!campaign) {
            return res.status(404).json({ success: false, error: "Campaign not found." });
        }

        res.send({ success: true, data: campaign });
    } catch (error) {
        return res.status(400).json({ success: false, error });
    }
};

module.exports = { createCompany, getCompany, insertCampaignDetails, getCampaignDetails };
