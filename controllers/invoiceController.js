// invoiceController.js

const mongoose = require('mongoose');
const { companySchema } = require('../schema/companySchema');
const { campaignSchema } = require('../schema/comopaignSchema');
const { userSchema } = require('../schema/userSchema');
const companyData = mongoose.model("company", companySchema); 
const campaignData = mongoose.model('campaign', campaignSchema);
const userData = mongoose.model('user', userSchema);
const nodemailer = require('nodemailer');
const crypto = require('crypto');





// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password'
  }
});

// Helper function to generate random password
const generateRandomPassword = () => {
  return crypto.randomBytes(8).toString('hex');
};

const createUser = async (req, res) => {
  try {
    const { username, email } = req.body;

    // Generate random password
    const password = generateRandomPassword();

    // Create user
    let user = await userData.create({ username, email, password });

    // Send password to user's email
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Your account has been created',
      text: `Hello ${username},\n\nYour account has been created. Your password is: ${password}\n\nPlease change your password after logging in.\n\nBest regards,\nYour Company`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ success: false, error: 'Failed to send email' });
      } else {
        console.log('Email sent:', info.response);
        res.send({ success: true, data: user });
      }
    });

  } catch (error) {
    console.error('MongoDB Error:', error);
    return res.status(400).json({ success: false, error });
  }
};

const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if email and password are provided
      if (!email || !password) {
        return res.status(200).json({ success: false, error: 'Email and password are required.' });
      }
  
      // Find user by email
      const user = await userData.findOne({ email });
  
      // Check if user exists and password matches
      if (!user || user.password !== password) {
        return res.status(200).json({ success: false, error: 'Invalid email or password.' });
      }
  
      // If credentials are correct, send success response
      res.send({ success: true, data: user });
    } catch (error) {
      console.error('MongoDB Error:', error);
      return res.status(500).json({ success: false, error: 'Failed to login.' });
    }
  };
  
  
  




const createCompany = async (req, res) => {
    try {
        let companyName = req.body.companyName;

        let companyDetails = req.body;
        if (!companyDetails._id || !mongoose.Types.ObjectId.isValid(companyDetails._id)) {
          delete companyDetails._id;
      }

        if(!companyName){
          return res.send({ success: false, message: "company name required "});
        }

        let getcompany = await companyData.findOne({companyName: companyName })

        if(getcompany){
        return  res.send({ success: false, message: "company name already exist" });
        }

        if (companyDetails._id) {
          // Update existing campaign
          let updateCampaign = await campaignData.findOneAndUpdate(
            { _id: companyDetails._id },
            { $set: companyDetails },
            { new: true }
        );
      return res.send({ success: true, data: updateCampaign });
          
      } else {


        let company = await companyData.create({ companyName });

        res.send({ success: true, data: company });
      }
    } catch (error) {
        console.error("MongoDB Error:", error); // Log MongoDB specific error
        return res.status(400).json({ success: false, message: error });
    }
};



const getCompany = async (req, res) => {
    try {
      const { companyName, limit, page } = req.query;
  
      let query = {};
      if (companyName) {
        query.companyName = { $regex: companyName, $options: 'i' }; // 'i' for case-insensitive search
      }
  
      // Calculate how many documents to skip
      const skip = (parseInt(page) - 1) * parseInt(limit);
  
      // Fetch the companies with pagination
      let companies = await companyData.find(query)
        .limit(parseInt(limit))
        .skip(skip);
  
      // Count the total number of documents matching the query
      const totalCompanies = await companyData.countDocuments();
      console.log(totalCompanies);
  
      res.send({
        success: true,
        data: companies,
        total: totalCompanies,
        pages: Math.ceil(totalCompanies / parseInt(limit)),
        currentPage: parseInt(page)
      });
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }
  };

 const insertCampaignDetails = async (req, res) => {
    try {
        // Extract campaign details from request body
        let campaignDetails = req.body;
        if (!campaignDetails._id || !mongoose.Types.ObjectId.isValid(campaignDetails._id)) {
          delete campaignDetails._id;
      }

        if (campaignDetails._id) {
            // Update existing campaign
            let updateCampaign = await campaignData.findOneAndUpdate(
              { _id: campaignDetails._id },
              { $set: campaignDetails },
              { new: true }
          );
        return res.send({ success: true, data: updateCampaign });
            
        } else {
            // Insert new campaign
            let campaign = await campaignData.create(campaignDetails);
            res.send({ success: true, data: campaign });
        }
    } catch (error) {
        return res.status(400).json({ success: false, message: error });
    }
};

const getCampaignDetails = async (req, res) => {
    try {
     
        const { companyId, userId, campaignName, limit = 10, page = 1 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        if (!companyId || !userId) {
            return res.status(400).json({ success: false, error: 'Company ID is required.' });
        }

        let query = {
            companyId: companyId,
            userId: userId
        };
      if (campaignName) {
        query.campaignName = { $regex: campaignName, $options: 'i' }; // 'i' for case-insensitive search
      }

        const campaign = await campaignData.find(query)
        .limit(parseInt(limit))
        .skip(skip);

        if (campaign.length === 0) {
            return res.status(404).json({ success: false, error: 'No campaigns found for this company.' });
        }

        const totalcampaign = await campaignData.countDocuments(query);
        console.log(totalcampaign);
        res.send({
          success: true,
          data: campaign,
          total: totalcampaign,
          pages: Math.ceil(totalcampaign / +limit),
          currentPage: parseInt(page)
        });

      
    } catch (error) {
        console.error(error);
        return res.status(400).json({ success: false, error: 'Failed to retrieve campaign details' });
    }
};

module.exports = { createCompany, getCompany, insertCampaignDetails, getCampaignDetails, createUser, loginUser };
