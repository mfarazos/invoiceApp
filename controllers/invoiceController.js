const mongoose = require('mongoose');
const { companySchema } = require('../schema/companySchema');
const { campaignSchema } = require('../schema/comopaignSchema');
const { userSchema } = require('../schema/userSchema');
const companyData = mongoose.model("company", companySchema); 
const campaignData = mongoose.model('campaign', campaignSchema);
const userData = mongoose.model('user', userSchema);
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { google } = require('googleapis');
const path = require('path');
//const pdf = require('html-pdf-node');
const pdf = require('html-pdf');
const fs = require('fs');




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
        let { companyName, _id, ...companyDetails } = req.body;

        // Ensure company name is provided
        if (!companyName) {
            return res.status(400).json({ success: false, message: "Company name is required" });
        }

        

        // If _id is provided, check if it's a valid ObjectId and update the company
        if (_id && mongoose.Types.ObjectId.isValid(_id)) {
            let updatedCompany = await companyData.findOneAndUpdate(
                { _id: _id },
                { $set: { companyName, ...companyDetails } },
                { new: true }
            );

            return res.json({ success: true, data: updatedCompany });
        } else {
            // Check if the company already exists
        let existingCompany = await companyData.findOne({ companyName: companyName });

        if (existingCompany) {
            return res.status(400).json({ success: false, message: "Company name already exists" });
        }
            // Create a new company
            let newCompany = await companyData.create({ companyName, ...companyDetails });

            return res.json({ success: true, data: newCompany });
        }
    } catch (error) {
        console.error("MongoDB Error:", error); // Log MongoDB specific error
        return res.status(400).json({ success: false, message: error.message }); // Return a readable error message
    }
};



const getCompany = async (req, res) => {
  try {
      // Query parameters with default values
      const { companyName, limit = 10, page = 1 } = req.query;

      // Ensure limit and page are valid integers
      const parsedLimit = parseInt(limit, 10);
      const parsedPage = parseInt(page, 10);

      // Validate parsed values
      if (isNaN(parsedLimit) || isNaN(parsedPage) || parsedPage < 1) {
          return res.status(400).json({ success: false, error: 'Invalid limit or page value' });
      }

      let query = {};
      if (companyName) {
          query.companyName = { $regex: companyName, $options: 'i' }; // Case-insensitive search
      }

      // Pagination calculation
      const skip = (parsedPage - 1) * parsedLimit;

      // Fetch companies using aggregation pipeline
      let companies = await companyData.aggregate([
          { $match: query }, // Match documents based on query
          { 
              $project: {
                  companyNameLower: { $toLower: "$companyName" }, // Case-insensitive sorting
                  companyName: 1,
                  email: 1,
                  createdDate: 1,
                  website: 1,
                  title: 1,
                  businessName: 1,
                  contact: 1,
                  phone: 1,
                  city: 1,
                  stateFormation: 1,
                  zipCode: 1,
                  entityType: 1,
                  accountExecutive: 1,
                  accountManager: 1,
                  customerNumber: 1
              }
          },
          { $sort: { companyNameLower: 1 } }, // Alphabetically sort case-insensitive
          { $skip: skip }, // Skip documents for pagination
          { $limit: parsedLimit } // Limit results per page
      ]);

      // Count total companies matching the query
      const totalCompanies = await companyData.countDocuments(query);

      return res.json({
          success: true,
          data: companies,
          total: totalCompanies,
          pages: Math.ceil(totalCompanies / parsedLimit), // Calculate total pages
          currentPage: parsedPage // Current page number
      });
  } catch (error) {
      console.error(error); // Log error for debugging
      return res.status(400).json({ success: false, error: error.message }); // Return error message
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

const cloneCampaign = async (req, res) => {
  try {
    // 1. Extract the campaign ID from the request body
    const { id } = req.body;

    // 2. Find the campaign by ID
    let campaign = await campaignData.findOne({ _id: id });

    if (!campaign) {
      return res.status(404).json({ success: false, message: "Campaign not found" });
    }

    let oldCompanyName = campaign.campaignName;
    let oldOrderId = campaign.orderId;

    // Convert the Mongoose document to a plain JavaScript object
    let campaignObject = campaign.toObject();

    // Remove fields that should not be duplicated
    delete campaignObject._id;
    delete campaignObject.campaignName;
    delete campaignObject.orderId;

    // 3. Clone the campaign details
    const clonedCampaignDetails = {
      ...campaignObject, // Spread operator to copy the existing details
      campaignName: `${oldCompanyName} clone`, // Modify campaignName
      orderId: `${oldOrderId} clone`, // Modify orderId
      createdDate: Date.now(), // Set new created date
    };

    // 4. Save the cloned campaign
    const newCampaign = await campaignData.create(clonedCampaignDetails);

    res.send({ success: true, data: newCampaign, oldCampaign: campaign });

  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(400).json({ success: false, error: error.message });
  }
};


  const makepdf = async (req, res) => {
    const { id } = req.body;
    try {
      //let id = '66b2525750a029e8b26291be'; // Sample ID
      let campaigndat = await campaignData.aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(id) }  // Match the campaign by ID
        },
        {
          $lookup: {
            from: 'users',            // The collection name for users
            localField: 'userId',      // Field in the campaign schema that references the user
            foreignField: '_id',       // Field in the user collection to match
            as: 'user'                 // Output array field name for the user data
          }
        },
        {
          $lookup: {
            from: 'companies',         // The collection name for companies
            localField: 'companyId',    // Field in the campaign schema that references the company
            foreignField: '_id',        // Field in the company collection to match
            as: 'company'               // Output array field name for the company data
          }
        },
        {
          $project: {
            _id: 1,                     // Include the campaign's ID
            compaignName: 1,                       // Include campaign name
            orderId: 1,                            // Include order ID
            website: 1,                            // Include website
            email: 1,                              // Include email
            title: 1,                              // Include title
            businessName: 1,                  // Include legal business name
            contact: 1,                            // Include contact
            phone: 1,                              // Include phone
            city: 1,                               // Include city
            stateOfFormation: 1,                   // Include state of formation
            zipCode: 1,                            // Include zip code
            typeOfEntity: 1,                       // Include type of entity
            acctExec: 1,                           // Include account executive
            acctMngr: 1,                           // Include account manager
            cNumber: 1,                            // Include company number
            mailDropQuantity: 1,                   // Include mail drop quantity
            mailDropDate: 1,                       // Include mail drop date
            estimatedMailDropDate: 1,              // Include estimated mail drop date
            estimatedMailSortDate: 1,              // Include estimated mail sort date
            estimatedMailEntry: 1,                 // Include estimated mail entry
            estimatedInHomeDelivery: 1,            // Include estimated in-home delivery
            eventDate: 1,                          // Include event date
            emailedProofTo: 1,                     // Include emailed proof to
            seedMailer: 1,                         // Include seed mailer
            createdDate: 1,                        // Include created date
            data: 1,                               // Include data array           // Include the campaign's description or any other field
            // Include other campaign fields as needed here
            userName: { $arrayElemAt: ['$user.username', 0] },          // Extract userName from the user array
            companyName: { $arrayElemAt: ['$company.companyName', 0] }  // Extract companyName from the company array
          }
        }
      ]);
      //console.log(campaign);
     // return res.send({ success: true, message: "PDF generated successfully", file: campaign });
      let campaign  = campaigndat[0];
      // Dynamically fetching values from the database response
      let companyName = campaign?.companyName || "N/A";
      let contact = campaign?.contact || "N/A";
      let phoneNumber = campaign?.phoneNumber || "N/A";
      let email = campaign?.email || "N/A";
      let acctExec = campaign?.acctExec || "Brandon Grindel";
      let mailDropQuantity = campaign?.mailDropQuantity || "N/A";
      let estimatedMailSortDate = campaign?.estimatedMailSortDate || "N/A";
      let estimatedUspsMailEntry = campaign?.estimatedUspsMailEntry || "N/A";
      let estimatedInHomeDelivery = campaign?.estimatedInHomeDelivery || "N/A";
      let eventDates = campaign?.eventDates || "N/A";
      let paymentDueDate = campaign?.paymentDueDate || "N/A";
  
      let orderDetails = campaign?.data || []; 
      let totalCost = 0;
      let tableRows = ""
      // Create dynamic table rows for the order details
      orderDetails.map(detail => {
        tableRows +=`<tr style="text-align: center; font-size: 11pt; border-bottom: 1px solid #eee;">
          <td style="padding: 5pt;">${detail.quantity}</td>
          <td style="padding: 5pt;">${detail.service}</td>
          <td style="padding: 5pt;" colspan="4">${detail.description} </td>
          <td style="padding: 5pt;"> </td>
        </tr>`
        totalCost += detail.cost;
    })
  
      // Your dynamic HTML template
      let html = `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8" />
      </head>
      <body style="margin: 0; font-family: 'Helvetica Neue', 'Helvetica', Arial, sans-serif;">
  
        <table style="width: 100%; border-spacing: 5px; line-height: 1.5;">
          <!-- Header -->
          <tr>
            <td>
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="font-size: 14pt; background-color: #eee;">
                  <td style="padding: 10pt;">
                    <strong>THINK INK MARKETING, INC.</strong>
                  </td>
                  <td style="color: #C00000; padding: 10pt;">
                    <strong>Invoice: ${companyName}</strong>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
  
          <!-- Address and Date -->
          <tr>
            <td>
              <table style="width: 100%;">
                <tr style="font-size: 11pt;">
                  <td style="padding: 10pt;">
                    3308 W. Warner Ave <br> 
                    Santa Ana, CA 92704 <br>
                    P: 714.841.2041 <br>
                    F: 714.841.2012  <br>
                    E: Brandon@ThinkInkMarketing.com <br>
                  </td>
                  <td style="padding: 10pt; vertical-align: top;">
                    <strong>DATE: ${new Date().toLocaleDateString()} <br><br>
                    From The Desk Of: ${acctExec}</strong>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
  
          <!-- Sold To and On Behalf -->
          <tr>
            <td>
              <table style="width: 100%;">
                <tr style="font-size: 11pt;">
                  <td style="padding: 10pt;">
                    <strong>SOLD TO:</strong> ${companyName}, ${contact}, ${phoneNumber}, ${email}
                  </td>
                  <td style="padding: 10pt;">
                    <strong>ON BEHALF:</strong> ${companyName}, ${contact}, ${phoneNumber}, ${email}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
  
          <!-- Invoice Details -->
          <tr>
            <td style="padding-bottom: 30pt;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="text-align: center; background-color: #eee; font-size: 11pt;">
                  <th style="padding: 5pt;">ACCT EXEC</th>
                  <th style="padding: 5pt;">MAIL DROP QUANTITY</th>
                  <th style="padding: 5pt;">ESTIMATED MAIL SORT DATE <span style="color: #FF0000;">*</span></th>
                  <th style="padding: 5pt;">ESTIMATED USPS MAIL ENTRY <span style="color: #FF0000;">*</span></th>
                  <th style="padding: 5pt;">ESTIMATED IN-HOME DELIVERY <span style="color: #FF0000;">*</span></th>
                  <th style="padding: 5pt;">EVENT DATES</th>
                  <th style="padding: 5pt; color: #C00000;">PAYMENT DUE DATE</th>
                </tr>
                <tr style="text-align: center; font-size: 11pt; border-bottom: 1px solid #eee;">
                  <td style="padding: 5pt;">${acctExec}</td>
                  <td style="padding: 5pt;">${mailDropQuantity}</td>
                  <td style="padding: 5pt;">${estimatedMailSortDate}</td>
                  <td style="padding: 5pt;">${estimatedUspsMailEntry}</td>
                  <td style="padding: 5pt;">${estimatedInHomeDelivery}</td>
                  <td style="padding: 5pt;">${eventDates}</td>
                  <td style="padding: 5pt; color: #C00000;">${paymentDueDate}</td>
                </tr>
              </table>
            </td>
          </tr>
  
          <!-- Order Details Table -->
          <tr>
            <td style="padding-bottom: 20pt;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="text-align: center; background-color: #eee; font-size: 11pt;">
                  <th colspan="7" style="padding: 5pt;">Order Details</th>
                </tr>
                <tr style="text-align: center; background-color: #eee; font-size: 11pt;">
                  <th style="padding: 5pt;">QUANTITY</th>
                  <th style="padding: 5pt;">SERVICE</th>
                  <th colspan="4" style="padding: 5pt;">DESCRIPTION</th>
                  <th style="padding: 5pt;">COST</th>
                </tr>
                ${tableRows}
                <tr style="text-align: center;">
                  <td colspan="5" style="padding: 5pt;"></td>
                  <td style="padding: 5pt; border-top: 2px solid #eee;" align="right"><strong>Total:</strong></td>
                  <td style="padding: 5pt; border-top: 2px solid #eee;"><strong>$${totalCost.toFixed(2)}</strong></td>
                </tr>
              </table>
            </td>
          </tr>
  
          <!-- Notes Section -->
          <tr>
            <td style="padding-bottom: 5pt; font-size: 11pt;">
              <table>
                <tr>
                  <th align="left"><strong>Note:</strong></th>
                </tr>
                <tr>
                  <td>
                    <p>This is an Invoice for the services named above and is subject to the conditions listed below...</p>
                    <p style="color: #FF0000;">*Mail Sort Dates, USPS Mail Entry Dates, and Estimated In-Home Delivery Dates are all subject to change.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
  
          <!-- Acceptance Section -->
          <tr>
            <td>
              <table>
                <tr>
                  <th align="left"><mark>To Accept This Invoice:</mark></th>
                </tr>
                <tr>
                  <td style="padding-top: 10pt; padding-bottom: 10pt;">
                    <label for="pname"><strong>Print Name:</strong></label>
                    <input type="text" id="pname" name="pname" style="border: 0; border-bottom: 1px solid black; width: 300px;">
                  </td>
                </tr>
                <tr>
                  <td>
                    <label for="sname"><strong>Sign Name:</strong></label>
                    <input type="text" id="sname" name="sname" style="border: 0; border-bottom: 1px solid black; width: 300px;">
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
  
      </body>
      </html>`;
  
      // Here, generate the PDF using a suitable library
      let options = { format: 'A4', printBackground: true, };
      let file = { content: html };
  
  //const pdfBuffer = await pdf.generatePdf(file, options);
  //fs.writeFileSync('output.pdf', pdfBuffer);
  //console.log('PDF created successfully!');
  pdf.create(html, options).toFile('output.pdf', async (err, result) => {
    if (err) {
      console.log(err);
      return res.send({ success: false, message: "PDF Not generated" });
    }
  
    console.log(result); // { filename: '/app/output.pdf' }
    
    try {
      let uploadedFile = await uploadFile(campaign); // Upload the PDF file
      return res.send({ success: true, message: "PDF generated successfully", fileId: uploadedFile.fileId, folderId: uploadedFile.folderId, pdflink: uploadedFile.pdflink  });
    } catch (uploadError) {
      console.log(uploadError);
      return res.send({ success: false, message: "File upload failed" });
    }
  });
      
  
    } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(500).send({ success: false, message: "Failed to generate PDF", error: error.message });
    }
  };

const getFolderId = async (driveService, folderName, parentFolderId = null) => {
    const query = `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and trashed=false`;
    const folderQuery = parentFolderId ? `${query} and '${parentFolderId}' in parents` : query;
    
    const response = await driveService.files.list({
      q: folderQuery,
      fields: 'files(id, name)',
      spaces: 'drive',
    });
    
    return response.data.files.length ? response.data.files[0].id : null;
  };
  
  // Function to create a new folder
  const createFolder = async (driveService, folderName, parentFolderId = null) => {
    const fileMetadata = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: parentFolderId ? [parentFolderId] : [],
    };
    
    const folder = await driveService.files.create({
      resource: fileMetadata,
      fields: 'id',
    });
    
    return folder.data.id;
  }
  
  // Upload file function
  const uploadFile = async (campaign) => {
    try {
      // Load client secrets from a local file
      const CREDENTIALS_PATH = path.join(__dirname, '../apikey.json'); // Make sure this path is correct
  
      // Authorize a client with credentials
      const auth = new google.auth.GoogleAuth({
        keyFile: CREDENTIALS_PATH,
        scopes: ['https://www.googleapis.com/auth/drive.file'],
      });
  
      // Create drive service instance
      const driveService = google.drive({ version: 'v3', auth });
  
  
  
      const parentFolderName = campaign?.userName;
      let parentFolderId = await getFolderId(driveService, parentFolderName);
      if (!parentFolderId) {
        parentFolderId = await createFolder(driveService, parentFolderName);
      }
      console.log(`Parent Folder ID ("Faraz"): ${parentFolderId}`);
      
      // Step 2: Check/Create Child Folder ("Company") inside "Faraz"
      const childFolderName = campaign?.companyName;
      let childFolderId = await getFolderId(driveService, childFolderName, parentFolderId);
      if (!childFolderId) {
        childFolderId = await createFolder(driveService, childFolderName, parentFolderId);
      }
      console.log(`Child Folder ID ("Company"): ${childFolderId}`);
      
      // Step 3: Upload the File ("campaign.pdf") inside "Company" folder
      const filePath = path.join(__dirname, '../output.pdf'); // File path
      const fileMetadata = {
        name: 'output.pdf', // File name
        parents: [childFolderId], // Parent folder (Company) ID
      };
      const media = {
        mimeType: 'application/pdf', // MIME type
        body: fs.createReadStream(filePath), // File stream
      };
      
      const file = await driveService.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id',
      });
      
      console.log(`File ID ("campaign.pdf"): ${file.data.id}`);
      
      // Step 4: Set Permissions for the User on File and Folders
      const personalEmail = 'waliiqbal2020@gmail.com'; // Replace with your email
      await setPermissions(driveService, parentFolderId, personalEmail); // Set permissions on "Faraz" folder
      await setPermissions(driveService, childFolderId, personalEmail); // Set permissions on "Company" folder
      await setPermissions(driveService, file.data.id, personalEmail); // Set permissions on file
      
      await campaignData.findOneAndUpdate({_id: campaign._id } , {$set: {fileId: file.data.id }})

      console.log('Task completed successfully.');
      return { fileId: file.data.id, folderId: file.data.id, pdflink: file.data.id };
  
  
      // const folderName = 'NewFolder'; // Folder name to check or create
   
      //  // Step 1: Check if folder exists
      //  let folderId = await getFolderId(driveService, folderName);
      //  if (!folderId) {
      //    // If folder does not exist, create a new folder
      //    folderId = await createFolder(driveService, folderName);
      //  }
      //  console.log(`Folder ID: ${folderId}`);
      // // File details
      // const filePath = path.join(__dirname, '../output.pdf'); // Multer saves the file path in req.file.path
      // const fileMetadata = {
      //   name: 'output.pdf', // Original file name
      //   parents: [folderId] // Replace 'your-folder-id' with the actual folder ID
      // };
      // const media = {
      //   mimeType: 'application/pdf', // File mime type
      //   body: fs.createReadStream(filePath), // File stream
      // };
  
      // // Upload file
      // const file = await driveService.files.create({
      //   resource: fileMetadata,
      //   media: media,
      //   fields: 'id',
      // });
  
      // console.log(`File ID: ${file.data.id}`);
      // const personalEmail = 'waliiqbal2020@gmail.com'; // Replace with your personal email
      // await setPermissions(driveService, file.data.id, personalEmail);
      // await setPermissions(driveService, folderId, personalEmail);
      // return({ success: true, fileId: file.data.id, folderId: folderId });
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ success: false, error: 'Failed to upload file' });
    }
  };
  
  const setPermissions = async (driveService, fileId, emailAddress) => {
    try {
      await driveService.permissions.create({
        fileId: fileId,
        requestBody: {
          role: 'writer',
          type: 'user',
          emailAddress: emailAddress,
        },
      });
      console.log(`Permissions set for file ID: ${fileId}`);
    } catch (error) {
      console.error('Error setting permissions:', error);
    }
  };
 

module.exports = { createCompany, getCompany, insertCampaignDetails, getCampaignDetails, createUser, loginUser, makepdf, cloneCampaign };