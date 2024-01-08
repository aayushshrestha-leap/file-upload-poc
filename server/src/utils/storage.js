const fs = require("fs");

function saveToCloud(data, id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      fs.writeFile(`./files/${id}.kvb`, data.toString(), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            url: `http://localhost:3000/api/files/${id}.kvb`
          });
        }
      });
    }, 2000);
  });
}

function deleteFromCloud(name) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      fs.unlink(`./files/${name}.kvb`, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    }, 2000);
  });
}

module.exports = {
  saveToCloud,
  deleteFromCloud
};
