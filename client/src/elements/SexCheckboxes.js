import React from "react";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMars, faVenus, faVenusMars} from "@fortawesome/free-solid-svg-icons";
import FormControl from "@material-ui/core/FormControl";

class SexCheckboxes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            findBoys: true,
            findGirls: true,
            findNeutral: true
        };

        this.sexes = this.sexes.bind(this);
    }

    handleSexCheckboxChange(event) {
        const name = event.target.name;
        const checked = event.target.checked;
        this.setState(
            state => ({...state, [name]: checked}),
            () => {
                if (this.props.handleChanged) {
                    this.props.handleChanged();
                }
            }
        );
    }

    sexes() {
        return [
            {str: "boy", enabled: this.state.findBoys},
            {str: "girl", enabled: this.state.findGirls},
            {str: "neutral", enabled: this.state.findNeutral},
        ].filter(obj => obj.enabled).map(obj => obj.str);
    }

    render() {
        return (
            <FormControl>
                <FormLabel>Sex</FormLabel>
                <FormGroup row>
                    <FormControlLabel control={<Checkbox checked={this.state.findBoys} onChange={this.handleSexCheckboxChange.bind(this)} name="findBoys" />} label={<FontAwesomeIcon icon={faMars}/>}/>
                    <FormControlLabel control={<Checkbox checked={this.state.findGirls} onChange={this.handleSexCheckboxChange.bind(this)} name="findGirls" />} label={<FontAwesomeIcon icon={faVenus}/>}/>
                    <FormControlLabel control={<Checkbox checked={this.state.findNeutral} onChange={this.handleSexCheckboxChange.bind(this)} name="findNeutral" />} label={<FontAwesomeIcon icon={faVenusMars}/>}/>
                </FormGroup>
            </FormControl>
        );
    }
}

export default SexCheckboxes;