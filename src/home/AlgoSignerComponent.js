import * as React from 'react';
import * as ReactDOM from 'react-dom';
// import * as algosdk from 'algosdk';


class AlgoSignerComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content: null,
            connected: false
        };
        this.connect = this.connect.bind(this);
        this.generateAccountList = this.generateAccountList.bind(this);
        this.selectAccount = this.selectAccount.bind(this);
    }

    /**
     * connect() is called when the user presses the button to connect to AlgoSigner.
     */
    connect() {
        // Connect to the AlgoSigner
        AlgoSigner.connect()
        // then handle the connect() Promise.
        .then((d) => {
            // When connected, set localStorage to connected
            localStorage.setItem('AlgoSignerConnected', 'true');
            this.generateAccountList();
        })
        // Catch AlgoSigner.connect() errors.
        .catch((e) => {
            console.error(e);
            const content = (
                <div>
                    <p>{e.message}</p>
                    <p>AlgoSigner is installed, but there is an error. In order for this application to work, you must be using Google Chrome with the AlgoSigner extension installed. Find more information at <a href="https://chrome.google.com/webstore/detail/algosigner/kmmolakhbgdlpkjkcjkebenjheonagdm?hl=en-US" target="_blank">AlgoSigner in the Chrome Store</a>.</p>
                </div>
            );
            this.setState({content: content});
        });
    }

    /**
     * componentDidMount()
     */
    componentDidMount() {
        // Check if AlgoSigner is installed.
        if (typeof AlgoSigner !== 'undefined') {
            // if AlgoSigner is installed, check if localStorage('AlgoSignerConnected') is 'true'
            if (localStorage.getItem('AlgoSignerConnected') === 'true') {
                // Just because localStorage('AlgoSignerConnected') is set and true, does not mean that the user is actually connected. They could have logged out of their wallet. Make sure to check if the user is connected to AlgoSigner even if the localStorage  shows the user connected.

                AlgoSigner.connect()
                .then(d => {
                    // Check if localStorage('account') is set. This is a selected account.
                    if (localStorage.getItem('account')) {
                        const content = (
                            <div>
                                <p>AlgoSigner is installed and connected! Your chosen account is : {localStorage.getItem('account')}</p>
                            </div>
                        );
                        this.setState({content: content});
                    // else, there is not set account. Generate a list of accounts from which to choose.
                    } else {
                        this.generateAccountList();
                    }   
                })
                // Catch AlgoSigner.connect() errors.
                .catch((e) => {
                    console.error(e);
                    const content = (
                        <div>
                            <p>{e.message}</p>
                            <p>AlgoSigner is installed, but there is an error. In order for this application to work, you must be using Google Chrome with the AlgoSigner extension installed. Find more information at <a href="https://chrome.google.com/webstore/detail/algosigner/kmmolakhbgdlpkjkcjkebenjheonagdm?hl=en-US" target="_blank">AlgoSigner in the Chrome Store</a>.</p>
                        </div>
                    );
                    this.setState({content: content});
                });

            } else {
                const content = (
                    <div>
                        <button className="btn btn-primary" onClick={this.connect}>Connect to AlgoSigner</button>
                    </div>
                )
                this.setState({content: content})
            }
        } else {
            const content = (
                <div>
                    <p>AlgoSigner is NOT installed. In order for this application to work, you must be using Google Chrome with the AlgoSigner extension installed. Find more information at <a href="https://chrome.google.com/webstore/detail/algosigner/kmmolakhbgdlpkjkcjkebenjheonagdm?hl=en-US" target="_blank">AlgoSigner in the Chrome Store</a>.</p>
                </div>
            );
            this.setState({content: content});
        }
    }
    
    generateAccountList() {
        // Get the accounts tracked by the AlgoSigner wallet.
        AlgoSigner.accounts({ ledger: 'MainNet' })
        // then handle the accounts() Promise.
        .then(accs => {
            // cycle through the accounts to make a HTML list of accounts.
            let list = [];
            accs.forEach((acc, index) => {
                const li = (
                    <li  key={index} className="list-group-item">
                        <button className="btn btn-secondary" onClick={this.selectAccount.bind(this, acc.address)}>
                            {acc.address}
                        </button> 
                    </li>
                )
                list.push(li);
            })
            // set the content to select an account
            const content = (
                <div>
                    <p>AlgoSigner is installed and connected! Please choose an account.</p>
                    <ul className="list-group">
                        {list}
                    </ul>
                </div>
            );
            this.setState({content: content});
            // return content;
        });

    }

    /**
     * 
     * @returns check https://reactjs.org/docs/react-component.html#render
     */
    render() {
        return(
            <div className="text-center">
                {this.state.content}
            </div>
        )
    }

    /**
     * selectAccount() is called when the user selects an account from their AlgoSigner wallet.
     */
    selectAccount(address) {
        localStorage.setItem('account', address);
        const content = (
            <div>
                <p>AlgoSigner is installed and connected! Your chosen account is : {localStorage.getItem('account')}</p>
            </div>
        );
        this.setState({content: content});
    }

}

let domContainer = document.querySelector('#algoSignerComponent')
ReactDOM.render(<AlgoSignerComponent />, domContainer)