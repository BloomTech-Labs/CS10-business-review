const axios = require('axios')
const faker = require('faker');

const genReviews = (count) => {
    console.log(`** Generating ${count} reviews.`);

    for(let i = 1; i <= count; i++) {
        Promise.all([
            axios.get('http://localhost:3001/api/user/random'),
            axios.get('http://localhost:3001/api/business/random')
        ]).then(function([user, business]) {
            const review = {
                reviewer: user.data._id,
                title: faker.lorem.sentence(),
                body: faker.lorem.paragraph(),
                numberofLikes: faker.random.number(12345),
                newMongoId: business.data._id,
                stars: faker.random.number(5)
            };
    
            axios({
                url: 'http://localhost:3001/api/review/create',
                method: 'post',
                data: review
            }).then(result => {
                console.log(`   Review Id: ${result.data._id} for user: ${result.data.reviewer} and business: ${result.data.newMongoId}`);
            }).catch(error => {
                if (error.response) {
                    console.log(error.response.data);
                } else if (error.request) {
                    console.log(error.request);
                } else {
                    console.log('Error', error.message);
                }
            });            
        });    
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

module.exports = { genReviews, genUsers };
