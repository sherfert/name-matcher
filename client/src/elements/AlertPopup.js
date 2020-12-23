import React from "react";
import Alert from "@material-ui/lab/Alert";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Collapse from "@material-ui/core/Collapse";

class AlertPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            alertMessage: undefined
        };

         this.handleError = this.handleError.bind(this);
    }

    handleError (err) {
        const msg = (err.response && err.response.data && err.response.data.message) || err.message;
        this.setState(state => ({...state, alertMessage: msg}));
    }

    render() {
        return (
            <Collapse in={this.state.alertMessage !== undefined}>
                <Alert
                    severity="error"
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                this.setState(state => ({...state, alertMessage: undefined}));
                            }}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                >
                    {this.state.alertMessage}
                </Alert>
            </Collapse>
        );
    }
}

export default AlertPopup;