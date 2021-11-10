import * as React from 'react'
import * as ReactDOM from 'react-dom'

class AlgoAccountConnectForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            sk: {},
            error: null,
            heading: "Please Connect your Algorand Account.",
            connected: false
        }

        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {
        if(localStorage.getItem('addr')) {
            let addr = localStorage.getItem('addr')
            let sk = localStorage.getItem('sk')
            this.setState({sk: {addr: addr, sk: sk}, connected: true, heading: "You are connected."})
        }
    }

    handleSubmit(e) {
        e.preventDefault()
        // get the keys from the inputs and join them together to make the mnemonic
        const keys = []
        for (let i = 1; i <= 25; i++) {
            const key = document.getElementById('key-' + i).value
            keys.push(key)
        }

        const mnemonic = keys.join(' ')

        // call the Api to check the 25 mnemonic.
        fetch('/api/connect', {
            method: "post",
            body: JSON.stringify({mnemonic: mnemonic}),
            headers: {
                "Content-type": "application/json"
            }
        })
            .then(res => {
                // Get the response promise and turn it into json.
                res.json().then(data => {
                    // Check if data includes data.error. If it does, add it as a warning before the form.
                    if (data.error) {
                        this.setState({error: <p className="bg-warning">{data.error}</p>})
                    } else {
                        // if no error, then there is an sk object with address and sk.
                        this.setState({sk: data.sk, connected: true, heading: "You are connected."})

                        // Save the data to the local storage.
                        localStorage.setItem('addr', data.sk.addr);
                        localStorage.setItem('sk', data.sk.sk)
                    }
                })
            })
            .catch(e => {
                // I haven't come across this error yet... it may need some work.
                this.setState({error: <p className="bg-warning">{e.toString()}</p>})
            })
    }

    render() {
        const connected = this.state.connected

        let content
        if (!connected) {
            // If not connected, make the 25 key inputs.
            const keys = []
            for(let i = 1; i <= 25; i++) {
                let bg = ""
                const input = (
                    <div className={"mb-2 col-12 col-md-6 col-lg-4 " + bg} key={i}>
                        <label htmlFor={"key-" + i}>Key {i}</label>
                        <input
                            id={"key-" + i}
                            className="form-control"
                            type="text"
                            required
                        />
                    </div>
                )
                keys.push(input)
            }
            // The content if the user is not connected to an Algorand account.
            content = (
                <div>
                    <p>In order to interact with RPGGames.Fun, you must connect an Algorand account. Please enter your 25 key word password.</p>
                    <form onSubmit={this.handleSubmit} id="algoAccountForm">
                        <div className="mb-4 row">
                            {keys}
                        </div>
                        <div className="text-center">
                            <button 
                                type="submit"
                                className="btn btn-primary"
                            >Connect</button>
                        </div>
                    </form>
                </div>

            )
        } else {
            // The user is connected to an Algorand account.
            
            // Content once the user is connected to an Algorand account.
            content = (
                <div className="text-center">
                    <p>Address: {this.state.sk.addr}</p>
                    <p>Now that you are connected to an Algorand account, take a look at our <a href="/games">games</a>. </p>
                </div>
            )
        }

        return (
            <div>
                <h2 className="text-center">{this.state.heading}</h2>
                {this.state.error}
                {content}
            </div>
        )
    }
}

let domContainer = document.querySelector('#algoAccountConnectForm')
ReactDOM.render(<AlgoAccountConnectForm />, domContainer)