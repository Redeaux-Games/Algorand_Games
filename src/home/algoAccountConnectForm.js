import * as React from 'react'
import * as ReactDOM from 'react-dom'

class AlgoAccountConnectForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            sk: {},
            error: null,
            heading: "Please Connect your Algorand Account.",
            connected: false,
            optedIn: false
        }

        this.handleSubmit = this.handleSubmit.bind(this)
        this.btnOptIn = this.btnOptIn.bind(this)
    }

    componentDidMount() {
        // TODO: Erase this... For testing purposes only.
        // localStorage.removeItem('nrpgcOptedIn')

        // Actual code
        if(localStorage.getItem('addr')) {
            let addr = localStorage.getItem('addr')
            let sk = localStorage.getItem('sk')
            console.log(sk)
            this.setState({sk: {addr: addr, sk: sk}, connected: true, heading: "You are connected."})
        }
    }

    btnOptIn(e) {
        console.log("Opt In")
        // At this point, their address should be stored in localStorage. Use that to check if they are opted in to the NRPG Coin.
        fetch(`api/assets/${localStorage.getItem('addr')}`)
        .then(res => {
            res.json().then(data => {
                // The return is the Algorand account. Might as well store this in the localStorage
                console.log(data)
                const temp = JSON.stringify(data)
                localStorage.setItem('account', temp)
                // Now that the localStorage('account') is set, lets check if they have the 368678144 asset (NRPG Coin)
                data.account.assets.forEach(asa => {
                    if(asa['asset-id'] === 368678144) {
                        // if the asset is found, set the localStorage('nrpgcOptedIn') to true
                        localStorage.setItem('nrpgcOptedIn', 'true')
                        console.log("You're opted in!!!!")
                        // refresh the component by setting this.state.optedIn to true
                        this.setState({optedIn: true})
                    } else {
                        // If they do not have the asset id in their assets, they need to opt in using the Algo SDK.
                        localStorage.setItem('nrpgcOptedIn', 'false')
                    }
                })
                // if the localStorage(nrpgcOptedIn) is still false, send an alert
                if(localStorage.getItem('nrpgcOptedIn') === 'false') {
                    if(confirm("You are not opted in to receive the NRPG Coin. Would you like to opt in to it now? You must opt in receive the NRPG Coin to play games on RPGGames.Fun")) {
                        console.log("You are now opting in to receive the NRPG Coin. ")
                        console.log(localStorage.getItem('sk'))   

                        // Fetch the opt-in endpoint in order to opt the user into the asset. 
                        fetch(`api/assets/${localStorage.getItem('addr')}/opt-in/368678144`, {
                            method: 'post',
                            body: JSON.stringify({sk: localStorage.getItem('sk')}),
                            headers: {
                                "Content-type": "application/json"
                            }
                        })
                        .then(res => {
                            res.json().then(data => {
                                console.log(data)
                                // at this point, there is either a successful response or an error response.
                                // However, I can continue to opt in to the asset b/c i'm simply sending 0 of the assets to myself. This is an issue because the account will spend .001 algo
                                if (data.response === 'success') {
                                    alert("You have opted in to receive the NRPG Coin on Algorand.")
                                    localStorage.setItem('nrpgcOptedIn', 'true')

                                    // refresh the component by setting this.state.optedIn to true
                                    this.setState({optedIn: true})
                                }

                            })
                        })
                        .catch(e => {
                            console.log(e)
                        })
                    } else {
                        console.log("You MUST opt in to receive the NRPG Coin in order to play games on RPGGames.Fun.")
                        this.setState({error: "You MUST opt in to receive the NRPG Coin in order to play games on RPGGames.Fun."})
                    }
                }
            })
        })

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
            // body: JSON.stringify({mnemonic: mnemonic}),
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
                        const skString = JSON.stringify(data.sk.sk);
                        this.setState({sk: {addr: data.sk.addr, sk: skString}, connected: true, heading: "You are connected."})

                        // Save the data to the local storage.
                        localStorage.setItem('addr', data.sk.addr);
                        
                        localStorage.setItem('sk', skString)
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
                            // required
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
            // Check if localStorage('nrpgcOptedIn') exists
            if (localStorage.getItem('nrpgcOptedIn') === 'true' || this.state.optedIn) {
                content = (
                    <div className="text-center">
                        <p>Address: {this.state.sk.addr}</p>
                        <p>You are connected to an Algorand account that is opted in to the NRPG Coin (asa #368678144 ). Please, take a look at our <a href="/games">games</a>.</p>
                    </div>
                )   
            } else {
                // they are logged in but not opted in to the nrpg coin
                content = (
                    <div className="text-center">
                        <p>Address: {this.state.sk.addr}</p>
                        <p>You may not be opted in to the NRPG Coin. For the best experience on RPGGames.Fun, you must opt in to the NRPG Coin using your Algorand account.</p>
                        <button className="btn btn-primary" onClick={this.btnOptIn}>Opt In to NRPG Coin</button>
                    </div>
                )
            }

            // Content once the user is connected to an Algorand account.
            // content = (
            //     <div className="text-center">
            //         <p>Address: {this.state.sk.addr}</p>
            //         <p>Now that you are connected to an Algorand account, take a look at our <a href="/games">games</a>. </p>
            //     </div>
            // )
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