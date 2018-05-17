import React, { Component } from 'react';
import { Modal, Header, Segment, Grid, Button, Icon, Input, List, Container } from 'semantic-ui-react';
import Cell from './components/Cell.js';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      Cells: [],
      inputRows: 7,
      inputCols: 13,
      inputBombs: 13,
      isFlagMode: false,
      message: "Have Fun !",
      modalOpen: false,
    }
    this.state.rows = this.state.inputRows;
    this.state.cols = this.state.inputCols;
    this.state.bombs = this.state.inputBombs;
    this.state.Cells = this.Instantiate();
  }

  handleOpen = () => this.setState({ modalOpen: true })

  handleClose = () => this.setState({ modalOpen: false })

  Loose = () => {
    // Unflagging cells
    this.state.Cells.filter(cell => cell.state === "!").map((cell) => cell.onClick(true))
    this.state.Cells.map((cell) => cell.onClick(false))
    this.setState({ message: "Game Over !" })
  }

  Win = () => {
    // Flagging remaining bombs
    this.state.Cells.filter(cell => cell.isBomb && cell.state !== "!").map((cell) => cell.onClick(true))
    this.setState({ message: "------ You won ! -------" })
  }



  GetNeighbors = (id) => {
    let rows = this.state.rows;
    let cols = this.state.cols;
    let Neighbors = [
      id - cols,
      id + cols]
    if (id % cols !== 0) {
      Neighbors.push(id - 1);
      Neighbors.push(id + cols - 1);
      Neighbors.push(id - cols - 1);
    } if (id % cols !== cols - 1) {
      Neighbors.push(id + 1);
      Neighbors.push(id + cols + 1);
      Neighbors.push(id - cols + 1);
    }
    let total = 0;
    let Cells = this.state.Cells;
    Neighbors.filter(neiId => (neiId >= 0 && neiId < cols * rows && Cells[neiId].isBomb)).map((neiId) => {
      total += 1;
      return null;
    });
    if (total === 0) {
      Neighbors.filter(neiId => (neiId >= 0 && neiId < cols * rows)).map((neiId) => {
        Cells[neiId].onClick(false);
        return null;
      });
    }
    return total;
  }

  Restart = () => {
    let { inputCols, inputRows, inputBombs } = this.state;
    if (inputCols < 1 || inputRows < 1 || inputBombs < 1 || inputCols > 16 || inputBombs >= inputCols * inputRows) {
      this.handleOpen();
    } else {
      this.setState({
        cols: parseInt(inputCols, 10),
        rows: parseInt(inputRows, 10),
        bombs: parseInt(inputBombs, 10),
        message: "Have Fun !",
      }, () => this.setState({ Cells: this.Instantiate() }));
    }
  }

  Instantiate = () => {
    console.log("Instantiating ...");
    let { rows, cols, bombs } = this.state;
    let Cells = [];
    var bombsIds = []
    while (bombsIds.length < bombs) {
      let randomnumber = Math.floor(Math.random() * rows * cols);
      if (bombsIds.indexOf(randomnumber) > -1) continue;
      bombsIds.push(randomnumber);
    }
    for (var i = 0; i < rows; i++) {
      for (var idx = 0; idx < cols; idx++) {
        let id = i * cols + idx;
        let isBomb = bombsIds.indexOf(id) > -1;
        let cell = new Cell(id, isBomb, this.Loose, this.GetNeighbors);
        Cells.push(cell);
      }
    }
    return Cells;
  }

  handleClick = (cell) => {
    let { bombs, rows, cols, Cells } = this.state;
    let Unknowned = Cells.filter(cell => cell.state === "?" || cell.state === "!").length;
    if (Unknowned === rows * cols && cell.isBomb) {
      let id = cell.id;
      while (cell.isBomb) {
        Cells = this.Instantiate();
        cell = Cells[id];
      }
    }
    let updated = cell.onClick(this.state.isFlagMode);
    if (updated) {
      this.setState({ Cells: Cells });
      // Check is won
      Unknowned = Cells.filter(cell => cell.state === "?" || cell.state === "!").length;
      if (Unknowned === bombs) {
        let Exploded = Cells.filter(cell => cell.state === "X").length;
        if (Exploded === 0) {
          this.Win();
        }
      }
    }
  }

  handleToolChange = (value) => {
    this.setState({ isFlagMode: value });
  }

  handleInputChange = (event) => {
    let target = event.target;
    let name = target.name;
    let value = target.value;
    this.setState({ [name]: value });
  }

  render() {
    let { message, inputCols, inputRows, inputBombs, isFlagMode, rows, cols, Cells } = this.state;
    let Rows = [];
    if (Cells.length === rows * cols) {

      let Cols = [];
      for (let idx = 0; idx < cols; idx++) {
        Cols.push(
          <Grid.Column key={rows * cols + idx} style={{ padding: "0" }}>
            <Button inverted color='black' disabled size="massive" icon style={{ margin: "0", Height: "18px", Width: "18px" }}>
              <Icon name={"minus"} />
            </Button>
          </Grid.Column >
        );
      }
      Rows.push(<Grid.Row columns={cols} style={{ padding: "0" }} key={rows + 1} stretched centered verticalAlign="middle" textAlign="center">{Cols}</Grid.Row>);


      for (let i = 0; i < rows; i++) {
        let Cols = [];
        for (let idx = 0; idx < cols; idx++) {
          let cell = Cells[i * cols + idx];
          let icon;
          switch (cell.state) {
            case "?":
              icon = <Icon name={"question"} />;
              break;
            case "!":
              icon = <Icon name={"flag"} />;
              break;
            case "X":
              icon = < Icon name={"bomb"} />;
              break;
            default:
              icon = cell.state;
            // icon = <Image src={imgtest} size='small' />;
          }
          Cols.push(
            <Grid.Column key={cell.id} style={{ padding: "0" }}>
              <Button size="massive" icon style={{ margin: "0", Height: "18px", Width: "18px" }} onClick={() => this.handleClick(cell)}>
                {icon}
              </Button>
            </Grid.Column >
          );
        }
        Rows.push(<Grid.Row columns={cols} style={{ padding: "0" }} key={i} stretched centered verticalAlign="middle" textAlign="center">{Cols}</Grid.Row>);
      }

      Cols = [];
      for (let idx = 0; idx < cols; idx++) {
        Cols.push(
          <Grid.Column key={rows * cols + idx} style={{ padding: "0" }}>
            <Button inverted color='black' disabled size="massive" icon style={{ margin: "0", Height: "18px", Width: "18px" }}>
              <Icon name={"minus"} />
            </Button>
          </Grid.Column >
        );
      }
      Rows.push(<Grid.Row columns={cols} style={{ padding: "0" }} key={rows} stretched centered verticalAlign="middle" textAlign="center">{Cols}</Grid.Row>);


    }

    return (
      <div style={{ textAlign: "center" }}>
        <Modal
          open={this.state.modalOpen}
          onClose={this.handleClose}
          size='small'
          style={{
            marginTop: '0px !important',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}
        >
          <Header icon='browser' content='Impossible parameters ...' />
          <Modal.Content >
            <h3>Height, Width and Bombs should be greater than 1. Width can't be greater than 16 and there cannot be only bombs.</h3>
          </Modal.Content>
          <Modal.Actions>
            <Button color='green' onClick={this.handleClose} inverted>
              <Icon name='checkmark' /> Got it
          </Button>
          </Modal.Actions>
        </Modal>
        <Segment inverted textAlign='center'>
          <Header textAlign='center' icon as='h1'>
            <Icon name='bomb' />
            <Header.Content>
              Mine Sweeper Game
             </Header.Content>
          </Header>
          <List horizontal>
            <List.Item>
              <Input name="inputRows" value={inputRows} type="number" iconPosition='left' placeholder='Height' onChange={this.handleInputChange}>
                <Icon name='resize vertical' />
                <input />
              </Input>
            </List.Item>
            <List.Item>
              <Input name="inputCols" value={inputCols} type="number" iconPosition='left' placeholder='Width' onChange={this.handleInputChange}>
                <Icon name='resize horizontal' />
                <input />
              </Input>
            </List.Item>
            <List.Item>
              <Input name="inputBombs" value={inputBombs} type="number" iconPosition='left' placeholder='Bombs' onChange={this.handleInputChange}>
                <Icon name='bomb' />
                <input />
              </Input>
            </List.Item>
            <List.Item>
              <Button size="medium" inverted onClick={this.Restart} ><Icon name='repeat' />New game</Button>
            </List.Item>
          </List>
        </Segment>
        <Container>
          <Segment><Header as='h2'>{message}</Header>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Segment compact raised>
                <Grid centered textAlign="center" verticalAlign="middle" style={{ display: "table-row" }}>
                  {Rows}
                </Grid>
              </Segment>
            </div>
            <Header>Tools :</Header>
            <Button.Group>
              <Button onClick={() => this.handleToolChange(false)} secondary={!isFlagMode ? true : null}>Sweep Mode</Button>
              <Button.Or />
              <Button onClick={() => this.handleToolChange(true)} secondary={isFlagMode ? true : null}>Flag Mode</Button>
            </Button.Group>
          </Segment>
        </Container>
      </div >
    );
  }
}

export default App;
