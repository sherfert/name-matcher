import React from 'react';
import settings from '../config/settings';
import AlertPopup from "../elements/AlertPopup";
import TextForm from "../elements/TextForm";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMars, faVenus, faVenusMars} from "@fortawesome/free-solid-svg-icons";

const axios = require('axios').default;

const {apiBaseURL} = settings;

class Import extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sex: "boy"
        };
        this.alert = React.createRef();
    }

    addName(name) {
        axios.post(`${apiBaseURL}/names/${name}`, {sex: this.state.sex})
            .catch(err => {if (this.alert.current) {this.alert.current.handleError(err);} else {console.log(err);}});
    }

    selectSex(event) {
        const sex = event.target.value;
        this.setState(state => ({...state, sex: sex}));
    }

    render() {
        return <>
            <div>
                <AlertPopup ref={this.alert}/>
            </div>
            <h1>Add a single name</h1>
            <div>
                <FormControl component="fieldset">
                    <FormLabel component="legend">Sex</FormLabel>
                    <RadioGroup row aria-label="sex" name="sex1" value={this.state.sex} onChange={this.selectSex.bind(this)}>
                        <FormControlLabel value="boy" control={<Radio/>} label={<FontAwesomeIcon icon={faMars} />}/>
                        <FormControlLabel value="girl" control={<Radio/>} label={<FontAwesomeIcon icon={faVenus} />}/>
                        <FormControlLabel value="neutral" control={<Radio/>} label={<FontAwesomeIcon icon={faVenusMars} />}/>
                    </RadioGroup>
                </FormControl>
            </div>
            <div>
                <TextForm resetOnSubmit buttonText={"Add"} submitted={(name) => {
                    this.addName(name);
                }}/>
            </div>
        </>
    }
}

export default Import;