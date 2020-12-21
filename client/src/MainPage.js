import React from 'react';
import settings from './config/settings';
import AlertPopup from "./forms/AlertPopup";

const axios = require('axios').default;

const {apiBaseURL} = settings;

class MainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.alert = React.createRef();
    }

    render() {
        return <>
            <div>
                <AlertPopup ref={this.alert}/>
            </div>
            <div>
                Main page for {this.props.name}
            </div>
        </>
    }
}

export default MainPage;