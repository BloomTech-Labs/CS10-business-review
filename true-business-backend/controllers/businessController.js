const Business = require('../API/businessModel');

const createBusiness = (req, res) => {
    const { name, type, contact } = req.body;
    console.log("Creating a Business: " + name)

    if (name && type && contact) {
        const business = new Business({ name, type, contact });

        business
            .save() // returns a promise
            .then(function(business) {
                res.status(201).json(business);
            })
            .catch(function(error) {
                res.status(500).json({
                    error: 'There was an error while saving the Business to the Database. (' + error + ')'
                });
            });
    } else {
        res.status(400).json({
            errorMessage: 'Please provide both name and type for the Business.'
        });
    }
};

const getBusiness = (req, res) => {
    const { name } = req.params;
    console.log("Getting Business: " + name)
    Business
        .findOne({"name": name})
        .then(business => {
            if(business) {
                res.status(200).json(business);
            } else {
                res.status(400).json({
                    error: "Business not found."
                })
            }
        })
        .catch(function(error) {
            res.status(500).json({ 
                error: 'The business information could not be retrieved. (' + error + ')' 
            });
        });
};

module.exports = {
    createBusiness,
    getBusiness
};