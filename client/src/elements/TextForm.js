import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

class TextForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const value = event.target.value
        this.setState(state => ({...state, value: value}));
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.submitted(this.state.value);
        if (this.props.resetOnSubmit) {
            this.setState(state => ({...state, value: ''}));
        }
    }


    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <TextField style={{margin: "5px"}} type="search" value={this.state.value} onChange={this.handleChange} />
                <Button style={{margin: "5px"}} type="submit" variant="contained">{this.props.buttonText}</Button>
            </form>
        );
    }
}

export default TextForm;