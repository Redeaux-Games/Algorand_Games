import * as React from 'react'
import * as ReactDOM from 'react-dom'

class GamesComponent extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        // Check if the localStorage('address') is set. This is the selected address after the user has connected to the AlgoSigner wallet.
        if(localStorage.getItem('account')) {
            // FIXME: Just because localStorage('account') is set, does not mean that the user is actually connected. They could have logged out of their wallet. Make sure to check if the user is connected to AlgoSigner even if the localStorage  shows the user connected. This may lead to problems if the game does not first connect to the AlgoSigner extension before making transactions. 
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