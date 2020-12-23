import React, {Component} from 'react';

class AddPlan extends Component {
    constructor() {
        super();

        this.state = {

        }
    }

    render() {
        return (
            <React.Fragment>
                <div class="row justify-content-center">
                    <h1>This will be the page to add training plan {this.props.match.params.id}</h1>
                </div>
            </React.Fragment>
        )
    }
}

export default AddPlan;
