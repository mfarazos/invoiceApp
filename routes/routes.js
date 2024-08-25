const cors = require("cors");
const { createCompany, getCompany, insertCampaignDetails, makepdf, cloneCampaign, getCampaignDetails, createUser, loginUser  } = require("../controllers/invoiceController");

const CustomRoutes = (http, express) => {
  http.get("/compaignapp", (req, res) => {
    res.send("compaign app");
  });

  http.use(cors());
  http.use(express.static("dist"));
  http.use(express.urlencoded({ extended: true }));
  http.use(express.json());
// user Routes
http.post("/invoiceapp/createUser", createUser);
http.post("/invoiceapp/loginUser", loginUser);

 // Company Routes
 http.post("/invoiceapp/createCompany", createCompany);
 http.get("/invoiceapp/getCompany", getCompany);

 // Campaign Routes
 http.post("/invoiceapp/insertCampaignDetails", insertCampaignDetails);

 http.post("/invoiceapp/MakePDF", makepdf);
 http.post("/invoiceapp/cloneCampaign", cloneCampaign);

 http.get("/invoiceapp/getCampaignDetails", getCampaignDetails);
}
  // http.post("/costingapp/insertFormData", insertFormData);
  // http.post("/costingapp/Adminlogin", Adminlogin);
  // http.post("/costingapp/insertAdminFormData", insertAdminFormData);
  // http.get("/costingapp/getAdminFormData", getAdminFormData);
  // http.post("/costingapp/addDate", addDate);
  // http.post("/costingapp/hubspotData", hubspotData);


module.exports = CustomRoutes;
