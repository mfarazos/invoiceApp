const cors = require("cors");
const { createCompany } = require("../controllers/invoiceController");

const CustomRoutes = (http, express) => {
  http.get("/compaignapp", (req, res) => {
    res.send("compaign app");
  });

  http.use(cors());
  http.use(express.static("dist"));
  http.use(express.urlencoded({ extended: true }));
  http.use(express.json());

  http.post("/invoiceApp/createCompany", createCompany);
  // http.post("/costingapp/insertFormData", insertFormData);
  // http.post("/costingapp/Adminlogin", Adminlogin);
  // http.post("/costingapp/insertAdminFormData", insertAdminFormData);
  // http.get("/costingapp/getAdminFormData", getAdminFormData);
  // http.post("/costingapp/addDate", addDate);
  // http.post("/costingapp/hubspotData", hubspotData);
};

module.exports = CustomRoutes;
