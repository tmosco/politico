const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json()); // for parsing application/json
app.get("/", (req, res) => {
  res.send("Hello World");
});

const version = "v1";

let offices = [];
const officesRequiredFields = ["name", "type"];
const baseUrl = `/api/${version}`;
app.post(`${baseUrl}/offices`, (req, res) => {
  const { body } = req;
  let isValid = true;
  const keys = Object.keys(body);
  officesRequiredFields.forEach(field => {
    isValid = isValid && keys.includes(field);
  });
  if (isValid) {
    const id = offices.length + 1;
    const data = {
      id,
      name: body.name,
      type: body.type
    };
    offices.push(data);
    const status = 201;
    res.status(status).json({
      status,
      data
    });
  } else {
    const missingKeys = officesRequiredFields.filter(
      key => !Object.keys(body).includes(key)
    );
    res.status(400).json({
      status: 400,
      error: `The ${missingKeys[0]} of the office is missing`
    });
  }
});

app.get(`${baseUrl}/offices`, (req, res) => {
  res.status(200).json({ status: 200, data: offices });
});

app.get(`${baseUrl}/offices/:officeId`, (req, res) => {
  const foundOffice = offices.find(
    office => office.id === parseInt(req.params.officeId, 10)
  );
  if (foundOffice) {
    res.status(200).json({ status: 200, data: foundOffice });
  } else {
    res.status(404).json({ status: 404, error: "Office not found" });
  }
});

app.patch(`${baseUrl}/offices/:officeId/:name`, (req, res) => {
  const { officeId, name } = req.params;
  const found_Office = offices.find(
    office => office.id === parseInt(officeId, 10)
  );
  if (found_Office) {
    found_Office.name = name;
    offices = offices.map(office =>
      office.id === parseInt(office, 10) ? found_Office : office
    );
    res.status(200).json({
      status: 200,
      data: found_Office
    });
  } else {
    res.status(404).json({ status: 404, error: "Office not found" });
  }
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});

app.delete(`${baseUrl}/offices/:officeId`, (req, res) => {
  const officeId = parseInt(req.params.officeId, 10);
  const foundOffice = offices.find(office => office.id === officeId);
  if (foundOffice) {
    offices = offices.filter(office => office.id !== officeId);
    res.status(202).json({
      status: 202,
      data: {
        message: "office successfully deleted"
      }
    });
  } else {
    res.status(404).json({
      status: 404,
      error: "office not found"
    });
  }
});


module.exports = app;
