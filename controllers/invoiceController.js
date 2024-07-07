// invoiceController.js

const mongoose = require('mongoose');
const { companySchema } = require('../schema/companySchema');
const { compaignSchema } = require('../schema/comopaignSchema');
const { userSchema } = require('../schema/userSchema');
const companyData = mongoose.model("company", companySchema); 
const campaignData = mongoose.model('campaign', compaignSchema);
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
        return res.status(400).json({ success: false, error: 'Email and password are required.' });
      }
  
      // Find user by email
      const user = await userData.findOne({ email });
  
      // Check if user exists and password matches
      if (!user || user.password !== password) {
        return res.status(401).json({ success: false, error: 'Invalid email or password.' });
      }
  
      // If credentials are correct, send success response
      res.send({ success: true, message: 'Login successful.' });
    } catch (error) {
      console.error('MongoDB Error:', error);
      return res.status(500).json({ success: false, error: 'Failed to login.' });
    }
  };
  
  
  




const createCompany = async (req, res) => {
    try {
        let companyName = req.body.companyName;

        let company = await companyData.create({ companyName });

        res.send({ success: true, data: company });
    } catch (error) {
        console.error("MongoDB Error:", error); // Log MongoDB specific error
        return res.status(400).json({ success: false, error });
    }
};



const getCompany = async (req, res) => {
    try {
      const { companyName, limit = 10, page = 1 } = req.query;
  
      let query = {};
      if (companyName) {
        query.companyName = { $regex: companyName, $options: 'i' }; // 'i' for case-insensitive search
      }
  
      // Calculate how many documents to skip
      const skip = (page - 1) * limit;
  
      // Fetch the companies with pagination
      let companies = await companyData.find(query)
        .limit(parseInt(limit))
        .skip(skip);
  
      // Count the total number of documents matching the query
      const totalCompanies = await companyData.countDocuments(query);
  
      res.send({
        success: true,
        data: companies,
        total: totalCompanies,
        pages: Math.ceil(totalCompanies / limit),
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

        // Insert campaign details into MongoDB
        let campaign = await campaignData.create(campaignDetails);

        res.send({ success: true, data: campaign });
    } catch (error) {
        return res.status(400).json({ success: false, error });
    }
};

const getCampaignDetails = async (req, res) => {
    try {
     
        const { companyId, userId, compaignName, limit = 10, page = 1 } = req.query;

        if (!companyId || !userId) {
            return res.status(400).json({ success: false, error: 'Company ID is required.' });
        }

        let query = {
            companyId: companyId,
            userId: userId
        };
      if (compaignName) {
        query.companyName = { $regex: compaignName, $options: 'i' }; // 'i' for case-insensitive search
      }

        const campaign = await campaignData.find(query)
        .limit(parseInt(limit))
        .skip(skip);

        if (campaign.length === 0) {
            return res.status(404).json({ success: false, error: 'No campaigns found for this company.' });
        }

        const totalcampaign = await companyData.countDocuments(query);
  
        res.send({
          success: true,
          data: campaign,
          total: totalcampaign,
          pages: Math.ceil(totalcampaign / limit),
          currentPage: parseInt(page)
        });

      
    } catch (error) {
        console.error(error);
        return res.status(400).json({ success: false, error: 'Failed to retrieve campaign details' });
    }
};

module.exports = { createCompany, getCompany, insertCampaignDetails, getCampaignDetails, createUser, loginUser };
