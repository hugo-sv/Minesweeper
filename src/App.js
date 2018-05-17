import React, { Component } from 'react';
import { Modal, Header, Segment, Grid, Button, Icon, Input, List, Container } from 'semantic-ui-react';
import Cell from './components/Cell.js';

class App extends Component {

  constructor(props) {
    super(props);
    // Initializing parameters
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

  Instantiate = () => {
    // Instantitate a gameBoard cell grid with state parameters
    let { rows, cols, bombs } = this.state;
    let Cells = [];
    // Generating randomly list of ids for bombs
    var bombsIds = []
    while (bombsIds.length < bombs) {
      // Select a random cell
      let randomnumber = Math.floor(Math.random() * rows * cols);
      // Check if the cell has not already been selected
      if (bombsIds.indexOf(randomnumber) > -1) continue;
      bombsIds.push(randomnumber);
    }
    // Generating the grid
    for (let id = 0; id < rows * cols; id++) {
      Cells.push(
        new Cell(
          id,
          bombsIds.indexOf(id) > -1,
          this.GetNeighbors,
        ));
    }
    return Cells;
  }

  Restart = () => {
    // Check and update the input parameters before initializing a new game
    let { inputCols, inputRows, inputBombs } = this.state;
    // Checking Parameters
    if (inputCols < 1 || inputRows < 1 || inputBombs < 1 || inputCols > 16 || inputBombs >= inputCols * inputRows) {
      // Activating the warning message
      this.handleOpen();
    } else {
      // Updating parameters
      this.setState(
        {
          cols: parseInt(inputCols, 10),
          rows: parseInt(inputRows, 10),
          bombs: parseInt(inputBombs, 10),
          message: "Have Fun !",
        },
        // Set State Callback
        () => this.setState({ Cells: this.Instantiate() })
      );
    }
  }


  Loose = () => {
    // Handle the player clicking on a Bomb
    // Removing flags
    this.state.Cells.filter(
      cell => cell.state === "!").map(
        cell => cell.onClick(true));
    // Revealing all cells
    this.state.Cells.map(cell => cell.onClick(false));
    // Updating message
    this.setState({ message: "Game Over !" });
  }

  Win = () => {
    // Handle the player winning a game
    // Adding flag to every bombs
    this.state.Cells.filter(
      cell => cell.isBomb && cell.state !== "!").map(
        cell => cell.onClick(true));
    // Updating message
    this.setState({ message: "You won !" });
  }

  GetNeighbors = (id, isRecursive, Cells) => {
    // On revealing, count the number of surrounding bombs
    // if isRecursive, recursively reveals the suroundings of a safe cells
    // Cells is an optional parameter 
    let { rows, cols } = this.state;
    if (typeof Cells === 'undefined') {
      Cells = this.state.Cells;
    }
    // Generationg the list of neighbors ids
    let Neighbors = [id - cols, id + cols];
    if (id % cols !== 0) {
      // Left is not on the edge
      Neighbors.push(id - 1);
      Neighbors.push(id + cols - 1);
      Neighbors.push(id - cols - 1);
    } if (id % cols !== cols - 1) {
      // Right if not on the edge
      Neighbors.push(id + 1);
      Neighbors.push(id + cols + 1);
      Neighbors.push(id - cols + 1);
    }
    // Filtering up and down edge cases
    Neighbors = Neighbors.filter(
      neiId => neiId >= 0 && neiId < cols * rows);
    // Counting bombs
    let total = Neighbors.filter(neiId => Cells[neiId].isBomb).length;
    // If this is a safe cell
    if (isRecursive && total === 0) {
      // Toggling Neighbors
      Neighbors.map(
        neiId => {
          let cell = Cells[neiId];
          // if the cell is flagged, unflag it
          if (cell.state === "!") { cell.onClick(true); }
          // Toggle the cell
          return cell.onClick(false);
        });
    }
    return total;
  }

  handleClick = (cell) => {
    // Handle click on a cell 
    let { isFlagMode, rows, cols, Cells } = this.state;
    // Count unknown cells
    let Unknowned = Cells.filter(cell => cell.state === "?" || cell.state === "!").length;
    // If the player plays for the first time (without the flag tool)
    if (Unknowned === rows * cols && !isFlagMode) {
      // Reroll board until the selected cell is not a bomb
      // Save the ID
      let id = cell.id;
      // Save the flagged cells ids
      let Flagged = Cells.filter(cell => cell.state === "!").map(cell => cell.id);
      console.log(Flagged)
      // Instanciate while the selected cell is not a bomb
      // Also try for the first 20 tries to have a safe cell
      let tries = 0;
      while (cell.isBomb || (this.GetNeighbors(id, false, Cells) > 0 && tries < 20)) {
        tries += 1;
        Cells = this.Instantiate();
        cell = Cells[id];
      }
      // Retrieve the flagged cells if Cells has changed
      if (tries > 0) {
        Flagged.map(id => Cells[id].onClick(true));
      }
      // Update the new Cells
      this.setState(
        { Cells: Cells },
        // Once updated, toggle the cell
        () => { this.toggleCell(cell); }
      );
    }
    else {
      this.toggleCell(cell);
    }
  }

  toggleCell = (cell) => {
    // Toggle the given cell
    let { isFlagMode, bombs, Cells } = this.state;
    // Click on the Cell, receive true if something has been updated
    let updated = cell.onClick(isFlagMode);
    if (updated) {
      // Update the state (force re-render on changing an attribute of a cell)
      this.setState({ Cells: Cells });
      // Check if tool is not the flag mode 
      if (!isFlagMode) {
        // Count unknown cells
        let Unknowned = Cells.filter(cell => cell.state === "?" || cell.state === "!").length;
        // Check if the only remaining cells are bombs
        if (Unknowned === bombs && !cell.isBomb) {
          // The game is won
          this.Win();
        } else if (cell.isBomb) {
          this.Loose();
        }
      }
    }
  }


  handleToolChange = (value) => {
    // Called when the tool is changed (Flag Mode (true) or Sweeper mode (false))
    this.setState({ isFlagMode: value });
  }

  handleInputChange = (event) => {
    // Called when one of the input is updated
    let target = event.target;
    let name = target.name;
    let value = target.value;
    this.setState({ [name]: value });
  }

  handleOpen = () => this.setState({ modalOpen: true })
  // Called the modal (warning for incorrect input) is opened

  handleClose = () => this.setState({ modalOpen: false })
  // Called the modal (warning for incorrect input) is closed

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
              icon = <Icon name={"dot circle outline"} />;
              break;
            case "!":
              icon = <Icon name={"flag checkered"} />;
              break;
            case "X":
              icon = < Icon name={"bomb"} />;
              break;
            default:
              icon = cell.state;
            // icon = <Image src={imgtest} size='small' />;
            // disabled={cell.state !== "?"}
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
