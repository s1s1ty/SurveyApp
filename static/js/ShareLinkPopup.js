import React, { Component } from 'react';

import axio from 'axios';

class ShareLinkPopup extends Component {
  constructor(props){
    super(props);
    this.state = {
     
      projectName: '',

    }
  }

  toggleModal(event){
    event.preventDefault();
    this.props.onCancelAction( event );
  }


  render() {
    let url = "/survey/home/preview-question/"+this.props.project_id+"/";
    return (
      <div className="App">

          <div className={(this.props.isActive) ? 'modal-shadow' : "modal-shadow hide"}>

            <div className="survey-modal">
                <h3>Share Survey Link</h3><hr/>
                <div className="form-group">
                  <label>Project Name: {this.props.project_name}</label>
                  <input 
                    type="text" 
                    className="form-control"
                    value={ url }
                    readOnly/>
                </div>
              <button onClick={this.toggleModal.bind(this)} className="btn btn-danger">Cancel</button>
            </div>

          </div>
      </div>
    );
  }
}

export default ShareLinkPopup;

