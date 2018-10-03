const axios = require("axios");
const faker = require("faker");

const genReviews = count => {
  console.log(`** Generating ${count} reviews.`);

  for (let i = 0; i < count; i++) {
    let promises = [];
    // axios.get("http://localhost:3001/api/user/random")
    // .then(response => {
    //   console.log("user", response.data)
    // })
    // .catch(error => {
    //   console.log("error", error);
    // })
    axios.get("http://localhost:3001/api/business/random")
    .then(response => {
      console.log("business", response.data)
    })
    .catch(error => {
      console.log("error", error);
    })
    // Promise.all([
    //   ,
    //   axios.get("http://localhost:3001/api/business/random"),
    // ])
    //   .then(function([user, business]) {
    //     const review = {
    //       reviewer: user.data._id,
    //       title: faker.lorem.sentence(),
    //       body: faker.lorem.paragraph(),
    //       numberofLikes: faker.random.number(12345),
    //       newMongoId: business.data._id,
    //       stars: faker.random.number(5),
    //     };
    //     console.log("FUCKING REVIEW", review)

    //     axios
    //       .post("http://localhost:3001/api/review/create", review)
    //       .then(result => {
    //         console.log(
    //           `   Review Id: ${result.data._id} for user: ${result.data.reviewer} and business: ${
    //             result.data.newMongoId
    //           }`,
    //         );
    //       })
    //       .catch(error => {
    //         console.log("Nope");
    //       });
    //   })
    //   .catch(error => console.log({ NOPE: error }));
  }

  console.log("Done.");
};

const genUsers = count => {
  console.log(`** Generating ${count} users.`);

  for (let i = 0; i < count; i++) {
    const data = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      username: faker.internet.userName(),
      password: "12345",
      numberofLikes: faker.random.number(1000),
    };
    axios({
      url: "http://localhost:3001/api/user/register",
      method: "post",
      data: data,
    })
      .then(result => {
        console.log(`   ${result.data.name} (${result.data.email})`);
      })
      .catch(error => {
        if (error.response) {
          console.log(error.response.data);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
      });
  }
};

module.exports = { genReviews, genUsers };
