<h1 align="center">Tic-Tac-Toe online"</h1>

<p align="center">
<img alt="Badge" src="https://github.com/dmitrygvl/tic-tac-toe/actions/workflows/sanity-check.yml/badge.svg" />
</p>

<p>This application is a multiplayer Tic-Tac-Toe game.</p>

_**[Deployed here](https://tic-tac-toe-kxy1.onrender.com/)**_

---

<h2>Functionality Description</h2>

<p>To start the game, the first participant must create a game room.</p>
<br/>
<p>The second participant joins the game by selecting the ID of the room created by the first player. After that, the game begins.</p>
<br/>
<p>At the end of each game, players are offered to play again.</p>
<p>The initiator of the room creation starts the new game first.</p>
<br/>
<p>The application allows for observing the gameplay.</p>
<p>Choose the observer mode and then select the room of interest.</p>
<br/>
<h4>The application ensures stability in cases of server disconnection or loss of connection by one of the players.</h4>
<br/>

<h2>Instructions for Testing the Game</h2>

<p>To test the multiplayer mode with server support, follow these steps:</p>
<br/>
<p>Clone the repository:</p>

```properties
git clone https://github.com/dmitrygvl/tic-tac-toe.git
```

<p>Navigate to the server directory:</p>

```properties
cd tic-tac-toe/server
```

<p>Install dependencies:</p>

```properties
npm ci
```

<p>Start the server:</p>

```properties
npm run start
```

<p>After starting the server, the application will be available at the deployment address https://tic-tac-toe-kxy1.onrender.com for testing in multiplayer mode.</p>

<h2>For developers:</h2>

<p>Clone the repository:</p>

```properties
git clone https://github.com/dmitrygvl/tic-tac-toe.git
```

<p>Navigate to the project root directory, install dependencies, and start in development mode:</p>

```properties
cd tic-tac-toe
npm ci
npm run start

```

<p>In a new terminal window, navigate to the server directory and install server dependencies:</p>

```properties
cd server
npm ci
npm run start
```

<p>Now, the application is available at http://localhost:3000/ for testing in the local network.</p>
