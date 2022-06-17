import express from "express";
import axios from "axios";
import photoUpload from "./multer.js";
import FormData from "form-data";
import fs from "fs";
const router = express.Router();
router.post("/", async (req, res, next) => {
  console.log(req.body);
  await axios
    .post(
      "https://accounts.zoho.com/oauth/v2/token?refresh_token=1000.308998a9366916b750522b4a96d18203.e74b77b666f82c39419b20473581a092&client_id=1000.ZSY7S65HCLLWAEYYQYYFH19DWVZO5U&client_secret=7603528194e867a2efae0deea341cf1907ec8f937e&redirect_uri=https://creatorapp.zoho.com/cosmedica/crm&grant_type=refresh_token"
    )
    .then(async (response) => {
      await axios
        .post(
          "https://creator.zoho.com/api/v2/cosmedica/crm/form/Leads",
          req.body,
          {
            headers: {
              Authorization: `Bearer ${response.data.access_token}`,
            },
          }
        )
        .then(async (response) => {
          return res.status(200).json({
            ID: response.data.data.ID,
            message: "Data Upload Successfully.",
          });
        })
        .catch((error) => {
          console.log(error.response);
        });
    })
    .catch((error) => {
      console.log(error.response);
      return res.status(500).json({
        message: "Error",
      });
    });
});
router.post(
  "/sendPhoto",
  photoUpload.single("file"),
  async (req, res, next) => {
    const { direction, ID } = req.body;
    console.log(direction);
    await axios
      .post(
        "https://accounts.zoho.com/oauth/v2/token?refresh_token=1000.308998a9366916b750522b4a96d18203.e74b77b666f82c39419b20473581a092&client_id=1000.ZSY7S65HCLLWAEYYQYYFH19DWVZO5U&client_secret=7603528194e867a2efae0deea341cf1907ec8f937e&redirect_uri=https://creatorapp.zoho.com/cosmedica/crm&grant_type=refresh_token"
      )
      .then(async (response) => {
        var form = new FormData();
        form.append("file", fs.createReadStream(req.file.path));
        console.log(response.data.access_token);
        await axios
          .post(
            `https://creator.zoho.com/api/v2/cosmedica/crm/report/test_Leads/${ID}/${direction}/upload`,
            form,
            {
              headers: {
                Authorization: `Bearer ${response.data.access_token}`,
                ...form.getHeaders(),
              },
            }
          )
          .then(async (resData) => {
            return res.status(200).json({ message: resData.data.data.message });
          })
          .catch((error) => {
            console.log("error.response", error);
            return res.status(500).json({
              message: "Error",
            });
          });
      })
      .catch((err) => {
        console.log("err.response", err.response);
        return res.status(500).json({
          message: "Error",
        });
      });
  }
);
export default router;
