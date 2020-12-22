import React from "react";

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
                <input type="text" value={this.state.value} onChange={this.handleChange}/>
                <input type="submit" value={this.props.buttonText}/>
            </form>
        );
    }
}

export default TextForm;