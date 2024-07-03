const cors = require("cors");
const { createCompany, getCompany, insertCampaignDetails, getCampaignDetails } = require("../controllers/invoiceController");

const CustomRoutes = (http, express) => {
  http.get("/compaignapp", (req, res) => {
    res.send("compaign app");
  });

  http.use(cors());
  http.use(express.static("dist"));
  http.use(express.urlencoded({ extended: true }));
  http.use(express.json());

 // Company Routes
 router.post("/invoiceApp/createCompany", createCompany);
 router.get("/invoiceApp/getCompany", getCompany);

 // Campaign Routes
 router.post("/invoiceApp/insertCampaignDetails", insertCampaignDetails);
 router.get("/invoiceApp/getCampaignDetails", getCampaignDetails);
}
  // http.post("/costingapp/insertFormData", insertFormData);
  // http.post("/costingapp/Adminlogin", Adminlogin);
  // http.post("/costingapp/insertAdminFormData", insertAdminFormData);
  // http.get("/costingapp/getAdminFormData", getAdminFormData);
  // http.post("/costingapp/addDate", addDate);
  // http.post("/costingapp/hubspotData", hubspotData);


module.exports = CustomRoutes;
