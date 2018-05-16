import React, { Component } from 'react';
import './App.css';
import { Segment, Button, Icon, Input, List } from 'semantic-ui-react';
import Board from './components/Board.js';

class App extends Component {
  render() {
    let rows = 10;
    let cols = 10;
    let bombs = 10;
    return (
      <div className="App">
        <Segment inverted textAlign='center'>
          <h1 className="App-title">Mine Sweeper Game</h1>
          <List horizontal>
            <List.Item>
              <Input type="number" iconPosition='left' placeholder='Height'>
                <Icon name='resize vertical' />
                <input />
              </Input>
            </List.Item>
            <List.Item>
              <Input size='small' type="number" iconPosition='left' placeholder='Width'>
                <Icon name='resize horizontal' />
                <input />
              </Input>
            </List.Item>
            <List.Item>
              <Input type="number" iconPosition='left' placeholder='Bombs'>
                <Icon name='bomb' />
                <input />
              </Input>
            </List.Item>
            <List.Item>
              <Button inverted ><Icon name='repeat' />New game</Button>
            </List.Item>
          </List>
        </Segment>
        <Board rows={rows} cols={cols} bombs={bombs} />
      </div >
    );
  }
}

export default App;
