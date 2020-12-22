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
import Button from "@material-ui/core/Button";
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';

const axios = require('axios').default;

const {apiBaseURL} = settings;

class Import extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sex: "boy",
            importInProgress: false
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

    selectFile(event) {
        this.setState(state => ({...state, importInProgress: true}));
        const file = event.target.files[0];
        event.target.value = '';
        const formData = new FormData();
        formData.append("file", file);
        axios.post(`${apiBaseURL}/names-import/`, formData)
            .catch(err => {if (this.alert.current) {this.alert.current.handleError(err);} else {console.log(err);}})
            .finally(() => this.setState(state => ({...state, importInProgress: false})))
        ;

    }

    render() {
        const inProgessIcon = this.state.importInProgress ? <HourglassEmptyIcon  fontSize="inherit"/> : "";
        return <>
            <div>
                <AlertPopup ref={this.alert}/>
            </div>
            <h1>Add a single name</h1>
            <div>
                <div>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Sex</FormLabel>
                        <RadioGroup row aria-label="sex" name="sex1" value={this.state.sex} onChange={this.selectSex.bind(this)}>
                            <FormControlLabel value="boy" control={<Radio/>} label={<FontAwesomeIcon icon={faMars}/>}/>
                            <FormControlLabel value="girl" control={<Radio/>} label={<FontAwesomeIcon icon={faVenus}/>}/>
                            <FormControlLabel value="neutral" control={<Radio/>} label={<FontAwesomeIcon icon={faVenusMars}/>}/>
                        </RadioGroup>
                    </FormControl>
                </div>
                <div>
                    <TextForm resetOnSubmit buttonText={"Add"} submitted={(name) => {
                        this.addName(name);
                    }}/>
                </div>
            </div>
            <h1>Import CSV</h1>
            <div>
                <div>
                    Import a CSV file. The first column is the name, the second is "boy", "girl", or "neutral" (no quotes).
                </div>
                <div>
                    <Button
                        variant="contained"
                        component="label"
                        style={{margin: "5px"}}
                    >
                        Upload File
                        <input
                            type="file"
                            hidden
                            onChange={this.selectFile.bind(this)}
                        />
                    </Button>
                    {inProgessIcon}
                </div>
            </div>
        </>
    }
}

export default Import;