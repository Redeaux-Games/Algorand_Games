# Changes

## v0.0.1

* ignored public/dist.
* added account to localStorage on front end.
* added checks to determine if the account is opted in to the NRPG Coin.
* added a Dockerfile
* added support for AlgoSigner extension on Google Chrome. This extension is now required. Users now connect to their Algorand account using the AlgoSigner wallet.

## v0.0.0

The application allows the user to connect their Algorand account by entering their 25 key word password. 
In order for the user to play the games, they must connect to an Algorand account. Otherwise, the user
will be redirected to the home page where they can enter their password keys. The games index displays 
links to the names of any directories that may be in the /public/games folder.