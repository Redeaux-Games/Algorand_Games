# RPGGames.Fun Server
## Powered by Algorand

## About
The RPGGames.Fun server will consist of a backend rest api that will give frontend javascript games access to the Algorand blockchain.

### Author
G.M.H. @ High Plains Design Studio

### Social
I can be reached on Twitter @GM_HPDS.

### Requirements
In order to install this server, you will need Node.js (currently v14.17.3) and npm. 
This application also uses a PureStake API key. An API key can be obtained by creating a free account at https://www.purestake.com/technology/algorand-api/.

### Install
First, clone this repository from Github (https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository). Next, create a file in the /bin folder called env.js. This file must contain the command
process.env.API_KEY="PureStake_API_KEY_goes_here"

After it has been installed, navigate to the main directory in the terminal and enter the commands:
npm install
npm run start

### About the Games
Currently, there are no games added with this server. A folder called "games" should be placed within the public directory. Games in that folder can then have access to the backend api.