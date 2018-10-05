# **True Business Reviews**

### _Share your experience with local businesses, recommend a great business to fellow users, and research new adventures!_

True Business Reviews is an app for those who wish to increase their chances of enjoying a great enxperience at local businesses. After logging in, users can read reviews of local business across the globe, add their own reviews, and upload photos to help one another increase their chances of enjoying a great experience.

## **Deployment**

True Business Reviews is deployed with [Netlify](https://www.netlify.com/) and developed with the MERN Stack.

- [MongoDB](https://www.mongodb.com/)
- [Express](https://www.npmjs.com/package/express)
- [React.js](https://reactjs.org/)
- [Node.js](https://nodejs.org)

![MERN](MERNSTACK.jpg)

## **Testing**

Due to the time constraints of the project, we elected to go to a manual testing process at this time. The nature and classification of each Github pull request was required on a standard form. The developer making the pull request was required to describe their method of testing to prove functionality of the addition while maintaining the integrity of the existing code base. At this point a second team member was required to review and approve the addition or change before it could be submitted to the project manager. Finally, the project manager provided final approval and moved the change/addition to the main branch. The project was redeployed from there. Once the code base is complete and stable, the authors intend to implement the [[Jest](https://jestjs.io/) testing suite for formal testing and review due to its ease of use, speed, and strong history of testing applications built with React.

### **Frontend**

```
https://true-business.netlify.com/
```

The frontend of True Business Reviews is created with [React.js](https://reactjs.org/), structured with [react-router](https://www.npmjs.com/package/react-router) and connected via [axios](https://www.npmjs.com/package/axios) to the backend.
A clean presentation with a white-based palette has been chosen in order to provide the smoothest experience to the users by following UX design guidelines.

The general frontend structure consists on:

- The Navigation bar; Google Places API search functionality and a sign-up and log-in component with OAuth option.
- The Landing page;  features popular businesses, popular reviews, and popular reviewers.
- The "Add review" modal; allow's registered users to add their own experiences and photos via Cloudinary by way of React-Dropzone.
- The "User Settings" component; accessed by clicking on the user button on the navigation bar.  Here the premium subscription can be aquired by [Stripe](https://stripe.com) payment, as well as the option to change the password, username, or e-mail, or the option to view all of the user's reviews.
- A business component that displays all reviews for the business, as well as information acquired from the Google Place Details API.

### **Backend**

```
https://cryptic-brook-22003.herokuapp.com
```

True Business Review's backend is created with [Node.js](https://nodejs.org) and [Express](https://www.npmjs.com/package/express) to communicate with the databases needed for the frontend. We have implemented [Stripe](https://stripe.com), [OAuth](https://oauth.net), [Cloudinary](https://cloudinary.com/), [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken), [cors](https://www.npmjs.com/package/cors), [helmet](https://www.npmjs.com/package/helmet), [mongoose](https://www.npmjs.com/package/mongoose), [morgan](https://www.npmjs.com/package/morgan) and [Passport](http://www.passportjs.org/) with [Google](https://www.npmjs.com/package/passport-google-oauth20).

### **Additional Information**

- Progress has been managed in the following Trello board:
  - https://trello.com/b/hroDSJtS/cs10-true-business-reviews.
- The styling BEM convention is followed by this project.
- The code has been formatted uniformly by using [Prettier](https://prettier.io/).

## **Getting Started**

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### **Prerequisites**

You will need [Node.js](https://nodejs.org) to run True Business Reviews locally.

Start installing the necessary modules with

```
yarn
```

On the `root`, `true-business-backend` and `true-business` folder.

Start the servers with

```
yarn start
```

By running the command on the `true-business-backend` and `true-business` folder simultaneously.

Next, create a `.env` file in the backend folder to store all sensitive infomation. In this file you will store API client IDs, keys and Secrets as well as URIs and additional data of confidential nature.

### _MongoDB setup and URI retrieval_

We will need to create an [mLab](https://mlab.com/) account and database to retrieve the Mongo URI and get it ready to store the necessary data.

The Mongo URI should be then copied and pasted in the newly created `.env` file. It should look like this:

```
 DB_URI=mongodb://user:password@dsXXXXX.mlab.com:XXXXX/your-db-name
```

### _APIs Setup_

Next, we need to create the necessary APIs to enable OAuth:

_Google+ API_

You need a standard [Google](www.gmail.com) account, create one if needed.

Go to Google's [_developers page_](https://console.developers.google.com) and create the Google + API.

Copy the client ID and secret and paste it in your `.env` file. It should look like this:

```
CLIENT_ID=XXXXXXXXXXXX-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.apps.googleusercontent.com
CLIENT_SECRET=XXXX_XXXXXXXXXXXXXXXXXXX
```

Then, add the following credentials:

- Authorized origins

  - https://localhost:3000/
  - http://localhost:3000/

- Authorized Redirect URIs
  - https://localhost:3000/auth/google/redirect
  - http://localhost:3000/auth/google/redirect

Finally, don't forget to enable the API.

_Stripe, etc._

The credentials and keys should be added to your local `.env` file.

## Authors

- **[David Loveday](https://github.com/AquilaVirtual)**
- **[Jason Metten](https://github.com/metten0)**
- **[Sophie Muller](https://github.com/sophiemullerc)**
- **[Cody Windeknecht](https://github.com/cwindeknecht)**

## License

MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Acknowledgments

The authors of this project would like to thank our friends at Lambda School for their support.
