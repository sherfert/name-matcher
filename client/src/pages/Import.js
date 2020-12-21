import React from 'react';
import settings from '../config/settings';
import AlertPopup from "../forms/AlertPopup";
import TextForm from "../forms/TextForm";

const axios = require('axios').default;

const {apiBaseURL} = settings;

class Import extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.alert = React.createRef();
    }

    addName(name) {
        axios.post(`${apiBaseURL}/names/${name}`)
            .then(() => this.fetchNames())
            .catch(err => {if (this.alert.current) {this.alert.current.handleError(err);} else {console.log(err);}});
    }

    render() {
        return <>
            <div>
                <AlertPopup ref={this.alert}/>
            </div>
            <TextForm buttonText={"Add single name"} submitted={(name) => {
                this.addName(name);
            }}/>
        </>
    }
}

export default Import;