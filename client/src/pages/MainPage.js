import React from 'react';
import AppBar from "@material-ui/core/AppBar";
import TabPanel from "@material-ui/lab/TabPanel";
import Tab from "@material-ui/core/Tab";
import TabContext from "@material-ui/lab/TabContext";
import TabList from "@material-ui/lab/TabList";
import Import from "./Import";

class MainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tabValue: "rate"
        };
        // this.props.name
    }

    render() {
        return <>
            <div>
                <TabContext value={this.state.tabValue}>
                    <AppBar position="static">
                        <TabList onChange={(ev, val) => {this.setState(state => ({...state, tabValue: val}))}}>
                            <Tab label="Rate" value="rate" />
                            <Tab label="Search" value="search" />
                            <Tab label="Matches" value="matches" />
                            <Tab label="Import" value="import" />
                        </TabList>
                    </AppBar>
                    <TabPanel value="rate">Rate</TabPanel>
                    <TabPanel value="search">Search</TabPanel>
                    <TabPanel value="matches">Matches</TabPanel>
                    <TabPanel value="import"><Import /></TabPanel>
                </TabContext>
            </div>
        </>
    }
}

export default MainPage;