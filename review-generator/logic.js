const axios = require('axios')
const faker = require('faker');

const genReviews = (count) => {
    console.log(`** Generating ${count} reviews.`);

    for(let i = 1; i <= count; i++) {
        console.log(`   Generating Review ${i} of ${count}`);
    }

    console.log("Done.")
};

const genUsers = (count) => {
    console.log(`** Generating ${count} users.`);

    for(let i = 1; i <= count; i++) {
        const email = faker.internet.email();
        const data = {
            name: faker.name.findName(),
            email: email,
            username: email,
            password: faker.internet.password()
        }
        axios({
            url: 'http://localhost:3001/api/user/register',
            method: 'post',
            data: data
        }).then(result => {
            console.log(`   ${result.data.name} (${result.data.email})`);
        }).catch(error => {
            if (error.response) {
                console.log(error.response.data);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log('Error', error.message);
            }
        });
    }
};

const genBusinesses = (count) => {
    console.log(`** Generating ${count} businesses.`);

    for(let i = 1; i <= count; i++) {
        console.log(`   Generating Business ${i} of ${count}`);
    }

    console.log("Done.")
};

module.exports = { genReviews, genUsers, genBusinesses };