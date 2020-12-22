import React from "react";

class NameRater extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <div>{this.props.name} is a {this.props.sex}</div>
        );
    }
}

export default NameRater;