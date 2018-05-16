import React, { Component } from 'react';
import int from 'prop-types';
import { Icon, Button } from 'semantic-ui-react';


class Cell extends Component {
    static propTypes = {
        id: int,
    }

    static defaultProps = {
        id: 0,
    }

    constructor(props) {
        super(props);
    }

    render() {
        const { id } = this.props;
        return (
            <Button icon>
                <Icon name='world' />
            </Button>
        );
    }
}

export default Cell;
