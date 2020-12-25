import React from 'react';
import settings from '../config/settings';
import AlertPopup from "../elements/AlertPopup";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import SexCheckboxes from "../elements/SexCheckboxes";
import NameRater from "../elements/NameRater";

const axios = require('axios').default;

const {apiBaseURL} = settings;

class Rate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            namesToRate: [],
            searchInProgress: false
        };
        this.alert = React.createRef();
        this.sexCheckboxes = React.createRef();
    }

    componentDidMount() {
        this.fetchNextNames();
    }

    fetchNextNames() {
        this.setState(state => ({...state, searchInProgress: true, namesToRate: []}));

        const sexes = this.sexCheckboxes.current.sexes();

        axios.get(`${apiBaseURL}/people/${this.props.user}/names-to-rate`, {params: {sexes: {list: sexes}}})
            .then(resp => this.setState(state => ({...state, namesToRate: resp.data})))
            .catch(this.handleError.bind(this))
            .finally(() => this.setState(state => ({...state, searchInProgress: false})));
    }

    handleRated() {
        this.setState(
            state => ({...state, namesToRate: [...state.namesToRate.slice(1)]}),
            () => {
                if (this.state.namesToRate.length === 0) {
                    this.fetchNextNames();
                }
            }
        );
    }

    handleError(err) {
        if (this.alert.current) {
            this.alert.current.handleError(err);
        } else {
            console.log(err);
        }
    }

    render() {
        const inProgressOrDone = this.state.searchInProgress ? <HourglassEmptyIcon fontSize="inherit"/> : "Nothing left to rate.";
        const nextName = this.state.namesToRate[0];
        const nameRater = nextName ?
            <NameRater
                big
                key={"rate-" + nextName.name}
                name={nextName.name}
                sex={nextName.sex}
                user={this.props.user}
                initialRating={null}
                handleRated={this.handleRated.bind(this)}
                handleError={this.handleError.bind(this)}
            /> : inProgressOrDone;
        return <>
            <div>
                <AlertPopup ref={this.alert}/>
            </div>
            <div>
                <SexCheckboxes
                    ref={this.sexCheckboxes}
                    handleChanged={this.fetchNextNames.bind(this)}
                />
            </div>
            <div>{nameRater}</div>
        </>
    }
}

export default Rate;