import React, { Component } from 'react';
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import UserDetail from './components/UserDetail';
import Users from './components/Users';
import Game from './components/Game';
import { Container } from 'react-bootstrap';
import socketIOClient from "socket.io-client";

class App extends Component {
  constructor() {
    super();
    this.state = {
      endpoint: "http://localhost:5000",
      socket: null,
      isGameStarted: false,
      gameId:null,
      gameData: null,
    };
  }

  componentDidMount() {
    const { endpoint } = this.state;
    // Made a connection with server
    const socket = socketIOClient(endpoint);
    socket.on("connected", data => {
      this.setState({ socket: socket })
    });
  }
  registrationConfirmation = (data) => {
    //
    this.setState({ isRegistered: data });
  };

  opponentLeft = (data) => {
    //
    alert("Opponent Left");
    this.setState({ isGameStarted: false, gameId: null, gameData: null });
  };
  gameStartConfirmation = (data) => {

    this.setState({ isGameStarted: data.status, gameId: data.game_id, gameData: data.game_data });
  };

  render() {

    return (

      <Container>
        {
          !this.state.isGameStarted ? !this.state.isRegistered ? <header className="App-header">
           <h1 className="titleH1">React && Nodejs XO GAME</h1>
            {this.state.socket
              ? <UserDetail socket={this.state.socket} registrationConfirmation={this.registrationConfirmation} />
              : <p>Loading...</p>}
          </header> :

            <Users socket={this.state.socket} gameStartConfirmation={this.gameStartConfirmation} /> :
            <Game socket={this.state.socket} gameId={this.state.gameId} gameData={this.state.gameData} opponentLeft={this.opponentLeft} />
        }
      </Container>
    );
  }
}

export default App;
