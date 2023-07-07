import React from 'react';
import settings from '../config/settings';
import AlertPopup from "../elements/AlertPopup";
import NameRater from "../elements/NameRater";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import Button from "@material-ui/core/Button";
import Rating from "@material-ui/lab/Rating";

const axios = require('axios').default;

const {apiBaseURL} = settings;

class Refine extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rating: 1,
            namesWithRatings: [],
            searchInProgress: false,
        };
        this.alert = React.createRef();
    }

    setRating(event) {
        const rating = parseInt(event.target.value);
        this.setState(state => ({...state, rating: rating}));
    }

    findNames() {
        this.setState(state => ({...state, namesWithRatings:[], searchInProgress: true}));

        axios.get(`${apiBaseURL}/people/${this.props.user}/ratings`,
            {params: {minRating: this.state.rating}})
            .then(resp => this.setState(state => ({...state, namesWithRatings: resp.data})))
            .catch(this.handleError.bind(this))
            .finally(() => this.setState(state => ({...state, searchInProgress: false})));
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
                key={"refine-" + nameWithRating.name.name}
                name={nameWithRating.name.name}
                sex={nameWithRating.name.sex}
                user={this.props.user}
                initialRating={nameWithRating.rating ? nameWithRating.rating.stars : null}
                handleError={this.handleError.bind(this)}
            />
        );
        const inProgressIcon = this.state.searchInProgress ? <HourglassEmptyIcon  fontSize="inherit"/> : "";
        return <>
            <div>
                <AlertPopup ref={this.alert}/>
            </div>
            <div>
                Refine rating for names rated this or above:
            </div>
            <div>
                <Rating
                    name={"Refine-rating"}
                    style={{"marginLeft": "5px"}}
                    value={this.state.rating}
                    onChange={this.setRating.bind(this)}
                    size={"medium"}
                />
            </div>
            <div style={{marginBottom: "10px"}}>
                <Button
                    disabled={this.state.searchInProgress}
                    variant="contained"
                    onClick={() => {
                        this.findNames();
                    }}
                >Refine</Button>
                {inProgressIcon}
            </div>
            <div>{names}</div>
        </>
    }
}

export default Refine;