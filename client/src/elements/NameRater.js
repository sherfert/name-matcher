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
        const rating = event.target.value;
        axios.post(`${apiBaseURL}/names/${this.props.name}/rating`, {user: this.props.user, rating: rating})
            .then(() => this.setState(state =>({...state, rating: rating})))
            .catch(this.props.handleError);
    }

    render() {
        return (
            <div>
                {this.props.name} {this.iconFor(this.props.sex)}
                <Rating style={{"marginLeft": "5px"}}
                    value={this.state.rating}
                    onChange={this.rate.bind(this)}
                />
            </div>
        );
    }
}

export default NameRater;