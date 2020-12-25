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
import SexCheckboxes from "../elements/SexCheckboxes";

const axios = require('axios').default;

const {apiBaseURL} = settings;

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: "exact",
            namesWithRatings: [],
            searchInProgress: false,
        };
        this.alert = React.createRef();
        this.sexCheckboxes = React.createRef();
    }

    findNames(name) {
        this.setState(state => ({...state, names:[], searchInProgress: true}));

        const sexes = this.sexCheckboxes.current.sexes();

        axios.get(`${apiBaseURL}/names/${name}/rating`, {params: {mode: this.state.mode, sexes: {list: sexes}, user: this.props.user}})
            .then(resp => this.setState(state => ({...state, namesWithRatings: resp.data})))
            .catch(this.handleError.bind(this))
            .finally(() => this.setState(state => ({...state, searchInProgress: false})));
    }

    selectMode(event) {
        const mode = event.target.value;
        this.setState(state => ({...state, mode: mode}));
    }

    handleSexCheckboxChange(event) {
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
                key={"search-" + nameWithRating.name.name}
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
                <SexCheckboxes ref={this.sexCheckboxes} />
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