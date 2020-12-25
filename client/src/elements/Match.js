import React from "react";
import Rating from "@material-ui/lab/Rating";
import NameRater from "./NameRater";

function Match(props) {
    return <div>
                {props.name} {NameRater.iconFor(props.sex)}
                <Rating
                    name={"Match-first-" + props.name}
                    style={{"marginLeft": "5px"}}
                    value={props.firstRating}
                    readOnly
                    size={"small"}
                /> /
                <Rating
                    name={"Match-second-" + props.name}
                    style={{"marginLeft": "5px"}}
                    value={props.secondRating}
                    readOnly
                    size={"small"}
                />
            </div>;
}

export default Match;