/*
*/



class Cell {
    constructor(id, isBomb, Loose, GetNeighbors) {
        this.Loose = Loose;
        this.id = id;
        this.isBomb = isBomb;
        this.state = "?";
        this.GetNeighbors = GetNeighbors;
    }

    onClick = (isFlagMode) => {
        if (isFlagMode) {
            if (this.state === "!") {
                this.state = "?";
                return true;
            } else if (this.state === "?") {
                this.state = "!";
                return true;
            }
        }
        else if (this.state === "?") {
            // Prevent error
            this.state = "";
            if (this.isBomb) {
                this.state = "X";
                this.Loose();
            } else {
                this.state = "" + this.GetNeighbors(this.id);
            }
            return true;
        }
        return false;
    }
}

export default Cell;
