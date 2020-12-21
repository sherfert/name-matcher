import React from 'react';

function Person(props) {
    return (
        <div onClick={props.onClick} className="person">
            {props.name}
        </div>
    );
}

export default Person;