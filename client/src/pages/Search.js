import React from 'react';
import settings from '../config/settings';
import AlertPopup from "../forms/AlertPopup";
import TextForm from "../forms/TextForm";

const axios = require('axios').default;

const {apiBaseURL} = settings;

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            names: []
        };
        this.alert = React.createRef();
    }

    findName(name) {
        axios.get(`${apiBaseURL}/names/${name}`)
            .then(resp => this.setState(state => ({...state, names: [resp.data.name]})))
            .catch(err => {if (this.alert.current) {this.alert.current.handleError(err);} else {console.log(err);}});
    }

    render() {
        const names = this.state.names.map(name => name);
        return <>
            <div>
                <AlertPopup ref={this.alert}/>
            </div>
            <TextForm buttonText={"Search"} submitted={(name) => {
                this.findName(name);
            }}/>
            <div>{names}</div>
        </>
    }
}

export default Search;