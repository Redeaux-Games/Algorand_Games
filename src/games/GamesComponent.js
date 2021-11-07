import * as React from 'react'
import * as ReactDOM from 'react-dom'

class GamesComponent extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        if(localStorage.getItem('addr')) {
            const scriptTag = document.createElement("script");
            scriptTag.src = "js/main.js";
            scriptTag.async = true;
            document.body.appendChild(scriptTag);
        } else {
            window.location.replace("/");
        }
        
    }

    render() {
        return (
            <div>
            </div>
        )

    }
}

let domContainer = document.querySelector('#gamesComponent')
ReactDOM.render(<GamesComponent />, domContainer)