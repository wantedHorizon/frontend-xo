import React, { Component, Fragment } from 'react';

import { Row,Table,  Col } from 'react-bootstrap';

import './Game.css';

class Game extends Component {

    constructor() {
        super();
        this.state = {
            gameData: null
        }
    }
    componentDidMount() {
        // console.log(this.props);
        this.setState({
            gameData: this.props.gameData,
            gameId: this.props.gameId,
            gameBetweenSeconds: 5,
        });


        this.props.socket.on('nextGameData', data => {
            // console.log(data);
            this.setState({
                gameId: data.game_id,
                gameData: data.game_data,
                gameBetweenSeconds: 5,
            });
        });
        this.props.socket.on('gameInterval', data => {
            // console.log(data);
            this.setState({
                gameBetweenSeconds: data
            });
        });

        this.props.socket.on('opponentLeft', data => {
            this.props.opponentLeft();
        });

        this.props.socket.on('selectCellResponse', data => {
            // console.log(data);
            this.setState({
                gameData: data
            });
        });
    }
    selectCell = (i, j) => {
        this.props.socket.emit('selectCell', { gameId: this.state.gameId, "i": i, "j": j });
    };

    generateCellDOM = () => {
        // console.log(this.state.gameData);
        let customTable = []
        for (let row = 0; row < 3; row++) {
            let children = []
            for (let col = 0; col < 3; col++) {
                let showWinnerCell = false;
                if (this.state.gameData.game_status === "won") {
                    for (let k = 0; k < this.state.gameData.winning_combination.length; k++) {
                        if (row === this.state.gameData.winning_combination[k][0] && col === this.state.gameData.winning_combination[k][1]) {
                            showWinnerCell = true;
                            break;
                        }
                    }
                }
                children.push(
                    <td key={"cell" + row + col} className={showWinnerCell ? "winner-cell" : ""} >
                        <div key={"cell-div" + row + col} className={"cell cell-" + this.state.gameData.playboard[row][col]} onClick={(this.state.gameData.game_status !== "ongoing" || this.props.socket.id !== this.state.gameData.whose_turn || this.state.gameData.playboard[row][col] ? () => void (0) : () => this.selectCell(row, col))}>
                        </div>
                    </td>)
            }
            customTable.push(<tr key={"row" + row} >{children}</tr>)
        }
        return customTable
    }

    render() {
        return (

            this.state.gameData ? <Fragment>
                <Row>
                    <Col>
                        <p className={"text-center " + (this.props.socket.id !== this.state.gameData.whose_turn ? "active-player" : "")}>
                            {this.props.socket.id === this.state.gameData.player1 ? (this.state.gameData.game_status === "won" && this.state.gameData.game_winner === this.state.gameData.player2 ? "Opponent is Winner!!! " : " ") + this.state.gameData[this.state.gameData.player2].email + " | Played : " + this.state.gameData[this.state.gameData.player2].played + " | Won : " + this.state.gameData[this.state.gameData.player2].won + " | Draw : " + this.state.gameData[this.state.gameData.player2].draw : (this.state.gameData.game_status === "won" && this.state.gameData.game_winner === this.state.gameData.player1 ? "Opponent is Winner!!! " : " ") + this.state.gameData[this.state.gameData.player1].email + " | Played : " + this.state.gameData[this.state.gameData.player1].played + " | Won : " + this.state.gameData[this.state.gameData.player1].won + " | Draw : " + this.state.gameData[this.state.gameData.player1].draw}
                        </p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Table bordered>
                            <tbody>
                                {
                                    this.generateCellDOM()
                                }
                            </tbody>
                        </Table>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p className={"text-center " + (this.props.socket.id === this.state.gameData.whose_turn ? "active-player" : "")}>{
                            this.props.socket.id === this.state.gameData.player1 ? (this.state.gameData.game_status === "won" && this.state.gameData.game_winner === this.state.gameData.player1 ? "You are Winner!!! " : " ") + this.state.gameData[this.state.gameData.player1].email + " | Played : " + this.state.gameData[this.state.gameData.player1].played + " | Won : " + this.state.gameData[this.state.gameData.player1].won + " | Draw : " + this.state.gameData[this.state.gameData.player1].draw : (this.state.gameData.game_status === "won" && this.state.gameData.game_winner === this.state.gameData.player2 ? "You are Winner!!! " : " ") + this.state.gameData[this.state.gameData.player2].email + " | Played : " + this.state.gameData[this.state.gameData.player2].played + " | Won : " + this.state.gameData[this.state.gameData.player2].won + " | Draw : " + this.state.gameData[this.state.gameData.player2].draw}
                        </p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p className="text-center">
                            {this.state.gameData.game_status === "won" ? "New Game will be start in " + this.state.gameBetweenSeconds + " seconds." : ""}
                        </p>
                    </Col>
                </Row>
            </Fragment> : <p>Gathering Data</p>

        );
    }
}

export default Game;