import React, { Component } from 'react';
import { Grid, Icon, Button } from 'semantic-ui-react';

class CellComp extends Component {
    render() {
        const { cell, isFlagMode, handleClick } = this.props;
        // Decorative cell
        if (typeof cell === 'undefined') {
            return (
                <Grid.Column style={{ padding: "0" }}>
                    <Button fluid inverted color='black' disabled icon style={{ margin: "0", Height: "18px", Width: "18px" }}>
                        <Icon name={"minus"} />
                    </Button>
                </Grid.Column >);
        }
        let button;
        // Different button properties and representation for different states
        switch (cell.state) {
            case "?":
                button = (
                    <Button fluid icon style={{ margin: "0", Height: "18px", Width: "18px" }} onClick={() => handleClick(cell)}>
                        <Icon name={"dot circle outline"} />
                    </Button>
                );
                break;
            case "!":
                button = (
                    <Button fluid positive active={!isFlagMode} icon style={{ margin: "0", Height: "18px", Width: "18px" }} onClick={() => handleClick(cell)}>
                        <Icon name={"flag checkered"} />
                    </Button>
                );
                break;
            case "X":
                button = (
                    <Button active negative fluid icon style={{ margin: "0", Height: "18px", Width: "18px" }}>
                        < Icon name={"bomb"} />
                    </Button>
                );
                break;
            case "0":
                button = (
                    <Button active fluid icon style={{ margin: "0", Height: "18px", Width: "18px" }}>
                        {"•"}
                    </Button>
                );
                break;
            default:
                button = (
                    <Button active fluid icon style={{ margin: "0", Height: "18px", Width: "18px" }}>
                        {cell.state}
                    </Button>
                );
        }
        return (
            <Grid.Column style={{ padding: "0" }}>
                {button}
            </Grid.Column >
        );
    }
}

export default CellComp;
