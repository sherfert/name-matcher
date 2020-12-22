import React from "react";
import {faMars, faVenus, faVenusMars} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

class NameRater extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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

    render() {
        return (
            <div>{this.props.name} {this.iconFor(this.props.sex)}</div>
        );
    }
}

export default NameRater;