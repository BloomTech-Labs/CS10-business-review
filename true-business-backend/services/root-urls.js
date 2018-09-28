module.exports = {
  ROOT_URL:
    process.env.NODE_ENV === "production"
      ? {
          WEB: "https://true-business.netlify.com/",
          API: "https://cryptic-brook-22003.herokuapp.com/auth/google"
        }
      : {
          WEB: "http://localhost:3000",
          API: "http://localhost:3001"
        }
};
