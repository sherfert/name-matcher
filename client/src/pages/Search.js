import React from 'react';
import settings from '../config/settings';
import AlertPopup from "../elements/AlertPopup";
import TextForm from "../elements/TextForm";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import NameRater from "../elements/NameRater";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";

const axios = require('axios').default;

const {apiBaseURL} = settings;

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: "exact",
            names: [],
            searchInProgress: false
        };
        this.alert = React.createRef();
    }

    findName(name) {
        this.setState(state => ({...state, names:[], searchInProgress: true}));

        axios.get(`${apiBaseURL}/names/${name}`, {params: {mode: this.state.mode}})
            .then(resp => this.setState(state => ({...state, names: resp.data})))
            .catch(err => {if (this.alert.current) {this.alert.current.handleError(err);} else {console.log(err);}})
            .finally(() => this.setState(state => ({...state, searchInProgress: false})));
    }

    selectMode(event) {
        const mode = event.target.value;
        this.setState(state => ({...state, mode: mode}));
    }

    render() {
        const names = this.state.names.map(name => <NameRater key={name.name} name={name.name} sex={name.sex} />);
        const inProgessIcon = this.state.searchInProgress ? <HourglassEmptyIcon  fontSize="inherit"/> : "";
        return <>
            <div>
                <AlertPopup ref={this.alert}/>
            </div>
            <div>
                <FormControl>
                    <FormLabel>Search Mode</FormLabel>
                    <RadioGroup name="mode" value={this.state.mode} onChange={this.selectMode.bind(this)}>
                        <FormControlLabel value="exact" control={<Radio/>} label={"Exact"}/>
                        <FormControlLabel value="prefix" control={<Radio/>} label={"Prefix"}/>
                        <FormControlLabel value="suffix" control={<Radio/>} label={"Suffix"}/>
                    </RadioGroup>
                </FormControl>
            </div>
            <div>
                <TextForm buttonText={"Search"} submitted={(name) => {
                    this.findName(name);
                }}/>
                {inProgessIcon}
            </div>
            <div>{names}</div>
        </>
    }
}

export default Search;