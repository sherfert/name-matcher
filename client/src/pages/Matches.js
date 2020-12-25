import React from 'react';
import settings from '../config/settings';
import AlertPopup from "../elements/AlertPopup";
import FormControl from "@material-ui/core/FormControl";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import SexCheckboxes from "../elements/SexCheckboxes";
import Button from "@material-ui/core/Button";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Match from "../elements/Match";
import Pagination from "@material-ui/lab/Pagination";

const axios = require('axios').default;

const {apiBaseURL} = settings;

class Matches extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            otherUser: "",
            matches: [],
            searchInProgress: false,
            users: [],
            page: 1,
            rowCount: 0,
        };
        this.alert = React.createRef();
        this.sexCheckboxes = React.createRef();
        this.fetchUsers();
    }

    pageCount() {
        return Math.ceil(this.state.rowCount / 10);
    }

    skipCount() {
        return (this.state.page - 1) * 10;
    }

    limitCount() {
        return 10;
    }

    fetchUsers()  {
        axios.get(`${apiBaseURL}/people/`)
            .then(resp => this.setState(state => ({...state, users: resp.data.map(person => person.name)})))
            .catch(this.handleError.bind(this));
    }

    fetchMatches() {
        this.setState(state => ({...state, searchInProgress: true}));

        const sexes = this.sexCheckboxes.current.sexes();

        axios.get(`${apiBaseURL}/people/${this.props.user}/matches`,
            {params: {otherUser: this.state.otherUser, sexes: {list: sexes}, skip: this.skipCount(), limit: this.limitCount()}})
            .then(resp => this.setState(state => ({...state, matches: resp.data})))
            .catch(this.handleError.bind(this))
            .finally(() => this.setState(state => ({...state, searchInProgress: false})));
    }

    fetchMatchesCount() {
        this.setState(state => ({...state, rowCount: 0}));

        const sexes = this.sexCheckboxes.current.sexes();

        axios.get(`${apiBaseURL}/people/${this.props.user}/matchesCount`,
            {params: {user: this.props.user, otherUser: this.state.otherUser, sexes: {list: sexes}}})
            .then(resp => this.setState(state => ({...state, rowCount: resp.data})))
            .catch(this.handleError.bind(this));
    }

    selectOtherUser(event) {
        const otherUser = event.target.value;
        this.setState(state => ({...state, otherUser: otherUser}));
    }

    handleChangePage(event, newPage) {
        this.setState(
            state => ({...state, page: newPage}),
            () => {
                this.fetchMatches();
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
        const inProgressIcon = this.state.searchInProgress ? <HourglassEmptyIcon  fontSize="inherit"/> : "";
        const dropDownItems = this.state.users
            .filter(user => user !== this.props.user)
            .map(user => <MenuItem key={user} value={user}>{user}</MenuItem>);
        const matches = this.state.matches.map(match =>
            <Match
                key={"matches-" + match.name.name}
                name={match.name.name}
                sex={match.name.sex}
                firstRating={match.myRating.stars}
                secondRating={match.otherRating.stars}
            />
        );
        return <>
            <div>
                <AlertPopup ref={this.alert}/>
            </div>
            <div>
                <FormControl style={{minWidth: 120, marginBottom: "10px"}}>
                    <InputLabel id="other-user-label">Match with</InputLabel>
                    <Select
                        labelId="other-user-label"
                        id="other-user"
                        value={this.state.otherUser}
                        onChange={this.selectOtherUser.bind(this)}
                    >
                        {dropDownItems}
                    </Select>
                </FormControl>
            </div>
            <div>
                <SexCheckboxes ref={this.sexCheckboxes} />
            </div>
            <div style={{marginBottom: "10px"}}>
                <Button
                    disabled={this.state.otherUser === "" || this.state.searchInProgress}
                    variant="contained"
                    onClick={() => {
                        this.fetchMatchesCount();
                        this.fetchMatches();
                    }}
                >Find matches</Button>
                {inProgressIcon}
            </div>
            <div>
                {matches}
            </div>
            <div hidden={this.state.rowCount === 0}>
                <Pagination
                    color="primary"
                    count={this.pageCount()}
                    siblingCount={2}
                    page={this.state.page}
                    onChange={this.handleChangePage.bind(this)}
                />
            </div>
        </>
    }
}

export default Matches;