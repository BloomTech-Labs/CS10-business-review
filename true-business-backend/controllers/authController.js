//THIS CONTROLLER IS NOT NEEDED
const axios = require("axios");

const authUser = () => {
  return new Promise((resolve, reject) => {
    console.log("getting to auth user controller");
    axios

      .get("http://localhost:3001/auth/google", {
        proxy: {
          host: "127.0.0.1",
          port: 3001
        }
      })
      .then(response => {
        resolve(response.data);
      })
      .catch(err => {
        console.error({ googleAuthErr: err });
        if (err) reject(err);
        else
          reject({
            title: "Error",
            message: "Service Unavailable - Please try again later."
          });
      });
  });
};

module.exports = { authUser };
