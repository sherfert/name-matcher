import React from "react";
import {faMars, faVenus, faVenusMars} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Rating from "@material-ui/lab/Rating";
import settings from "../config/settings";

const axios = require('axios').default;
const {apiBaseURL} = settings;

class NameRater extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rating: this.props.initialRating
        };
    }

    iconFor(sex) {
        switch (sex) {
            case "boy":
                return <FontAwesomeIcon icon={faMars} />;
            case "girl":
                return <FontAwesomeIcon icon={faVenus} />;
            case "neutral":
            default:
                return <FontAwesomeIcon icon={faVenusMars} />
        }
    }

    rate(event) {
        const rating = parseInt(event.target.value);
        axios.post(`${apiBaseURL}/names/${this.props.name}/rating`, {user: this.props.user, rating: rating})
            .then(() => this.setState(state =>({...state, rating: rating})))
            .then(() => {
                if (this.props.handleRated) {
                    this.props.handleRated(rating);
                }
            })
            .catch(this.props.handleError);
    }

    render() {
        const name = this.props.big ?
            <h1>{this.props.name} {this.iconFor(this.props.sex)}</h1>
            : <>{this.props.name} {this.iconFor(this.props.sex)}</>;
        return (
            <div>
                {name}
                <Rating
                    name={"Name-rater-" + this.props.name}
                    style={{"marginLeft": "5px"}}
                    value={this.state.rating}
                    onChange={this.rate.bind(this)}
                    size={this.props.big ? "large" : "medium"}
                />
            </div>
        );
    }
}

export default NameRater;