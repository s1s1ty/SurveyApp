import React, { Component } from 'react';

import ProjectList from './ProjectList';

import axio from 'axios';
axio.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axio.defaults.xsrfCookieName = "csrftoken";



class ProjectCreate extends Component {
  constructor(){
    super();
    this.state = {
      isActive: false,
      projectName: '',

    }
  }

  toggleModal(){
    this.setState({
      isActive: !this.state.isActive
    })
  }

  createProjectApi(){
    let self = this;
    axio(
    {
      url: '/survey/api/projects/',
      data: {
        'name': this.refs.projectName.value
      },
      method: 'POST'
    })
    .then(function (response) {
      console.log(response.data);      
      self.setState({
        isActive: !self.state.isActive
      })
      window.location.reload()
      
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  onChangeTextBox(event){
    let eventName = event.target.name;
    let eventValue = event.target.value;
    this.setState({ eventName : eventValue});

  }

  render() {
    return (
      <div className="App">
        <button onClick={this.toggleModal.bind(this)} className="btn btn-success pull-right"><span className="glyphicon glyphicon-plus"></span> Create Project</button>

          <div className={(this.state.isActive) ? 'modal-shadow' : "modal-shadow hide"}>

            <div className="survey-modal">
                <h3>Create a Project</h3><hr/>
                <div className="form-group">
                  <label>Project Name:</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Put a Name" 
                    ref="projectName" 
                    onChange={ this.onChangeTextBox.bind(this) }
                  />
                </div>
                <button onClick={this.createProjectApi.bind(this)} className="btn btn-success">Create Project</button>
                <hr/>
              <button onClick={this.toggleModal.bind(this)} className="btn btn-danger">Cancel</button>
            </div>

          </div>
          
          <ProjectList />

      </div>
    );
  }
}

export default ProjectCreate;

