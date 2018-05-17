/*
States :
"?" : Unrevealed
"!" : Flagged
"X" : revealed bomb
"0" to "8" : revealed cell with surrounding bombs
"" : Intermediate state in order to avoid infinite recursive calls of OnClick
*/

class Cell {
    constructor(id, isBomb, GetNeighbors) {
        this.id = id;
        this.isBomb = isBomb;
        this.state = "?";
        this.GetNeighbors = GetNeighbors;
    }

    onClick = (isFlagMode) => {
        // The cell is toggle with or without the flag mode tool
        if (isFlagMode) {
            // The flag mode tool is activated, change the state of the cell from flagged to un flagged and vice versa
            if (this.state === "!") {
                this.state = "?";
                return true;
            } else if (this.state === "?") {
                this.state = "!";
                return true;
            }
        }
        else if (this.state === "?") {
            // Cell unrevealed            
            this.state = "";
            if (this.isBomb) {
                this.state = "X";
            } else {
                this.state = "" + this.GetNeighbors(this.id, true);
            }
            return true;
        }
        // In any other case
        return false;
    }
}

export default Cell;
