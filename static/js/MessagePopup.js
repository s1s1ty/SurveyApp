import React, { Component } from 'react';

import axio from 'axios';

class MessagePopup extends Component {
  constructor(props){
    super(props);
    this.state = {
      isActive: false,
      projectName: '',

    }
  }

  componentDidMount(){
    event.preventDefault();
    this.setState({ isActive: true})
  }

  toggleModal(){
    this.setState({
      isActive: !this.state.isActive
    })
  }


  render() {
    
    return (
      <div className="App">

          <div className={(this.state.isActive) ? 'modal-shadow' : "modal-shadow hide"}>

            <div className="survey-modal">
                <h3>Edit Sucessful</h3><hr/>
              <button onClick={this.toggleModal.bind(this)} className="btn btn-danger">Cancel</button>
            </div>

          </div>
      </div>
    );
  }
}

export default MessagePopup;