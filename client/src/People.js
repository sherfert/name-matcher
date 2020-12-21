import React from 'react';
import Popup from 'reactjs-popup';
import settings from './config/settings';
import Person from "./Person";
import TextForm from "./forms/TextForm";

const axios = require('axios').default;

const {apiBaseURL} = settings;

class People extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            names: []
        };
        this.fetchNames()
    }

    fetchNames ()  {
        axios.get(`${apiBaseURL}/people/`)
            .then(resp => this.setState({names: resp.data.map(person => person.name)}))
            .catch(err => console.log(err));
    }

    addPerson(name) {
        axios.post(`${apiBaseURL}/people/${name}`)
            .then(() => this.fetchNames())
            .catch(err => console.log(err));
    }

    render() {
        const persons = this.state.names.map(name => <Person name={name} />);
        return <>
            <div>
                {persons}
                <Popup
                    trigger={<div><Person name="+"/></div>}
                    modal
                >
                    {close => (
                        <div className="modal">
                            <div className="header"> Add a new user</div>
                            <div className="content">
                                <TextForm submitted={(name) => {
                                    close();
                                    this.addPerson(name);

                                }}/>
                            </div>
                        </div>
                    )}
                </Popup>
            </div>
        </>
    }
}

export default People;