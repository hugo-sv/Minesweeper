import React, { Component } from 'react';
import { int } from 'prop-types';
import { Grid, Segment } from 'semantic-ui-react';
import Cell from './Cell.js';

class Board extends Component {
    // state = { Rows: [] }

    static propTypes = {
        rows: int,
        cols: int,
        bombs: int,
    }

    static defaultProps = {
        rows: 10,
        cols: 10,
        bombs: 10,
    }

    constructor(props) {
        super(props);
    }

    render() {
        const { rows, cols, bombs } = this.props;
        let Rows = [];
        for (var i = 0; i < rows; i++) {
            let rowID = `row${i}`;
            let Cells = [];
            for (var idx = 0; idx < cols; idx++) {
                let cellID = `cell${i}-${idx}`;
                Cells.push(<Grid.Column><Cell id={i * cols + idx} /></Grid.Column>);
            }
            Rows.push(<Grid.Row>{Cells}</Grid.Row>);
        }
        return (
            <Segment>
                <Grid>
                    {Rows}
                </Grid>
            </Segment>
        );
    }
}

export default Board;
