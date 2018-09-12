import React, { Component } from 'react';

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {"name1" : "Taco Bell", "name2": "Fred Meyer", "name3":"Mcdonald", "name4":"Out Names"}
    }

    search = (search) => {

    console.log("Show Seach", search)

    }
    render() {

        return (
          <div>{this.search}</div>
        );
    }
}

export default Search;