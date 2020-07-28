import React, { Component, Fragment } from 'react';
import { ListGroup } from 'react-bootstrap';
import './Users.css';
class Users extends Component {
    constructor() {
        super();
        this.state = {
            opponents: []
        };
    }
    selectOpponent = (index) => {
        this.props.socket.emit('selectOpponent', { "id": this.state.opponents[index].id });
    };

    componentDidMount() {
        this.props.socket.on('getOpponentsResponse', data => {
            // console.log(data);
            this.setState({
                opponents: data
            });
        });
        this.props.socket.on('newOpponentAdded', data => {
            // console.log(data);
            this.setState({
                opponents: [...this.state.opponents, data]
            });
        });
        this.props.socket.on('opponentDisconnected', data => {
            let flag = false;
            let i = 0;
            for (i = 0; i < this.state.opponents.length; i++) {
                if (this.state.opponents[i].id === data.id) {
                    flag = true;
                    break;
                }
            }
            if (flag) {
                let array = [...this.state.opponents];
                array.splice(i, 1);
                this.setState({ opponents: array });
            }
        });
        this.props.socket.on('excludePlayers', data => {
            console.log(data);
            for (let j = 0; j < data.length; j++) {
                let flag = false;
                let i = 0;
                for (i = 0; i < this.state.opponents.length; i++) {
                    if (this.state.opponents[i].id === data[j]) {
                        flag = true;
                        break;
                    }
                }
                if (flag) {
                    let array = [...this.state.opponents];
                    array.splice(i, 1);
                    this.setState({ opponents: array });
                }
            }

        });
        this.props.socket.on('gameStarted', data => {
            console.log(data);
            this.props.gameStartConfirmation(data);
        });

        this.props.socket.emit('getOpponents', {});
    }

    render() {
        return (
            <Fragment>
                <h3>Select opponent</h3>
                <ListGroup onSelect={this.selectOpponent}>
                    {this.state.opponents.map(function (opponent, index) {
                        return <ListGroup.Item  action={true} className="opponent-item" key={index} eventKey={index} >{opponent.email} </ListGroup.Item>;
                    })}
                </ListGroup></Fragment>
        );
    }
}

export default Users;