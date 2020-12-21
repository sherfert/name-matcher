import React from 'react';
import Popup from 'reactjs-popup';
import settings from './config/settings';
import Person from "./Person";
import TextForm from "./forms/TextForm";
import AlertPopup from "./forms/AlertPopup";
import ReactDOM from "react-dom";
import MainPage from "./MainPage";

const axios = require('axios').default;

const {apiBaseURL} = settings;

class People extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            names: []
        };
        this.alert = React.createRef();
        this.fetchNames()
    }

    fetchNames ()  {
        axios.get(`${apiBaseURL}/people/`)
            .then(resp => this.setState(state => ({...state, names: resp.data.map(person => person.name)})))
            .catch(err => {if (this.alert.current) {this.alert.current.handleError(err);} else {console.log(err);}});
    }

    addPerson(name) {
        axios.post(`${apiBaseURL}/people/${name}`)
            .then(() => this.fetchNames())
            .catch(err => {if (this.alert.current) {this.alert.current.handleError(err);} else {console.log(err);}});
    }

    goToMainPageForPerson(name) {
        ReactDOM.render(<MainPage name={name} />, document.getElementById('root'));
    }

    render() {
        const persons = this.state.names.map(name => <Person name={name} onClick={() => this.goToMainPageForPerson(name)} />);
        return <>
            <div>
                <AlertPopup ref={this.alert}/>
            </div>
            <h1>Who are you?</h1>
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