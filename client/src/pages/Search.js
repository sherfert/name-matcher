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
import Checkbox from "@material-ui/core/Checkbox";
import {faMars, faVenus, faVenusMars} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import FormGroup from "@material-ui/core/FormGroup";

const axios = require('axios').default;

const {apiBaseURL} = settings;

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: "exact",
            namesWithRatings: [],
            searchInProgress: false,
            findBoys: true,
            findGirls: true,
            findNeutral: true
        };
        this.alert = React.createRef();
    }

    findNames(name) {
        this.setState(state => ({...state, names:[], searchInProgress: true}));

        let sexes = [
            {str: "boy", enabled: this.state.findBoys},
            {str: "girl", enabled: this.state.findGirls},
            {str: "neutral", enabled: this.state.findNeutral},
        ].filter(obj => obj.enabled).map(obj => obj.str);

        axios.get(`${apiBaseURL}/names/${name}/rating`, {params: {mode: this.state.mode, sexes: {list: sexes}, user: this.props.user}})
            .then(resp => this.setState(state => ({...state, namesWithRatings: resp.data})))
            .catch(this.handleError.bind(this))
            .finally(() => this.setState(state => ({...state, searchInProgress: false})));
    }

    selectMode(event) {
        const mode = event.target.value;
        this.setState(state => ({...state, mode: mode}));
    }

    handleChange(event) {
        const name = event.target.name;
        const checked = event.target.checked;
        this.setState(state => ({ ...state, [name]: checked }));
    }

    handleError(err) {
        if (this.alert.current) {
            this.alert.current.handleError(err);
        } else {
            console.log(err);
        }
    }

    render() {
        const names = this.state.namesWithRatings.map(nameWithRating =>
            <NameRater
                key={nameWithRating.name.name}
                name={nameWithRating.name.name}
                sex={nameWithRating.name.sex}
                user={this.props.user}
                initialRating={nameWithRating.rating ? nameWithRating.rating.stars : null}
                handleError={this.handleError.bind(this)}
            />
        );
        const inProgessIcon = this.state.searchInProgress ? <HourglassEmptyIcon  fontSize="inherit"/> : "";
        return <>
            <div>
                <AlertPopup ref={this.alert}/>
            </div>
            <div>
                <FormControl>
                    <FormLabel>Search Mode</FormLabel>
                    <RadioGroup row name="mode" value={this.state.mode} onChange={this.selectMode.bind(this)}>
                        <FormControlLabel value="exact" control={<Radio/>} label={"Exact"}/>
                        <FormControlLabel value="prefix" control={<Radio/>} label={"Prefix"}/>
                        <FormControlLabel value="suffix" control={<Radio/>} label={"Suffix"}/>
                    </RadioGroup>
                </FormControl>
            </div>
            <div className={this.state.mode === "exact" ? 'hidden' : ''} >
                <FormControl>
                    <FormLabel>Sex</FormLabel>
                    <FormGroup row>
                        <FormControlLabel control={<Checkbox checked={this.state.findBoys} onChange={this.handleChange.bind(this)} name="findBoys" />} label={<FontAwesomeIcon icon={faMars}/>}/>
                        <FormControlLabel control={<Checkbox checked={this.state.findGirls} onChange={this.handleChange.bind(this)} name="findGirls" />} label={<FontAwesomeIcon icon={faVenus}/>}/>
                        <FormControlLabel control={<Checkbox checked={this.state.findNeutral} onChange={this.handleChange.bind(this)} name="findNeutral" />} label={<FontAwesomeIcon icon={faVenusMars}/>}/>
                    </FormGroup>
                </FormControl>
            </div>
            <div>
                <TextForm buttonText={"Search"} submitted={(name) => {
                    this.findNames(name);
                }}/>
                {inProgessIcon}
            </div>
            <div>{names}</div>
        </>
    }
}

export default Search;