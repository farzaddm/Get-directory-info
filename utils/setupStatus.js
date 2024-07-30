const fs = require("fs");
const path = require("path");

const setupCompletePath = path.join(__dirname, '../setup_complete');

let isSetupComplete = fs.existsSync(setupCompletePath);

function checkSetupComplete() {
  return isSetupComplete;
}

function setSetupComplete(status) {
  isSetupComplete = status;
}

module.exports = {
  checkSetupComplete,
  setSetupComplete
};