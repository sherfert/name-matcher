import React from 'react';
import settings from './config/settings';

const axios = require('axios').default;

const {apiBaseURL} = settings;

class People extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            names: ""
        };
        this.fetchNames()
    }

    fetchNames ()  {
        axios.get(`${apiBaseURL}/people/`)
            .then(resp => this.setState({names: resp.data.map(person => person.name)}))
            .catch(err => console.log(err));
    }
    render() {
        return <>
            <div
                style={{flexDirection: 'column', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                {this.state.names && <div>{`${this.state.names}`}</div>}
            </div>
        </>
    }
}

export default People;