import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import ShareLinkPopup from "./ShareLinkPopup";


class ProjectList extends React.Component{
	constructor(props){
		super(props);
		this.state ={
			data: [],
			project_name: '',
			isSharePopup: false,
			project_id: ''
		}
		this.deleteProject = this.deleteProject.bind(this);
		this.onChangeProjectName = this.onChangeProjectName.bind(this)
	}

	// GET ALL PROJECT LIST
	componentDidMount(){
		var th = this;
		axios.get("/survey/api/projects/")
		.then(function (results) {
			th.setState({
         		data: results.data,
         		project_id:''
     		});
      		console.log(results.data);
    	})
    	.catch(function (error) {
      		console.log(error);
    	});
	}

	deleteProject(project_id, index, event){
		event.preventDefault();
		let self = this;
		let url = "/survey/api/projects/" + project_id + "/"
		axios.delete(url)
		.then(function (results) {
      		let data = self.state.data; 
      		data.splice(index, 1);
      		self.setState({ data: data });
    	})
    	.catch(function (error) {
      		console.log(error);
    	});
	}

	onChangeProjectName(index, event){
		event.preventDefault()
		let project_name = event.target.value;
		let all_data = this.state.data;
		all_data[index].name = project_name
		this.setState({'data': all_data, project_name:project_name})
	}

	updateProject(project_id, index, event){
		event.preventDefault();
		let self = this;
		let url = "/survey/api/projects/" + project_id + "/";
		axios({
			url: url,
			method: 'PUT',
			data: { name: self.state.project_name }
		})
		.then(function (results) {
      		let data = self.state.data; 
      		self.setState({ data: data });
    	})
    	.catch(function (error) {
      		console.log(error);
    	});

	}

	// STATE UPDATE FOR IF SHARE BUTTON PRESS
	shareProject(project_id, event){
		event.preventDefault();
		this.setState({ isSharePopup: true, project_id:project_id })
	}

	cancelPopup( event ){
		this.setState({ isSharePopup: false })
	}

	render(){
		let pList = this.state.data.map( (project, index) => {
	          return (
	            <div key={index} className="project">
	            	<div className="project-header"> 
	            		Project: {project.name} 
	            		<Link to={`/survey/home/question/${project.id}`}>Create Question</Link>
	            	</div>
		            	<div className="icon">&nbsp;
	            			<Link to={`/survey/home/question/${project.id}`}>
		            			<i className="glyphicon glyphicon-flag"></i>
		            		</Link>
		            		<div className="projectName">
	            				<input value={ project.name } className="project-form-control"
	            				name="project_name" onChange={ this.onChangeProjectName.bind(this, index) }/>			            
			            	</div>
			            </div>

	            	<div className="panel-footer">
		            	<div className="btn-group">
			            		
			            	<button title="Delete Project" className="btn btn-danger" onClick={ this.deleteProject.bind(this, project.id, index) }><span className="glyphicon glyphicon-trash"></span></button>
		              		<button title="Update" className="btn btn-warning" onClick={ this.updateProject.bind(this, project.id, index) }><span className="glyphicon glyphicon-edit"></span></button>
		              	  	<button
				              	  title="Share" 
				              	  className="btn btn-info"
				              	  onClick= { this.shareProject.bind(this, project.id)}>
				            <span className="glyphicon glyphicon-share-alt"></span>
				              	  
		              		</button>
		              		<a href="/survey/export-answer/xls/47/"
				              	  title="Export Answer" 
				              	  className="btn btn-info">
				            <span className="glyphicon glyphicon-share-alt"></span>
				              	  
		              		</a>
			            </div>
	              	</div>
	            </div>
	          );
	        })

		return(
			<div>
		        <h1>All Projects</h1>
		        <div className="projects">{ pList } </div>
		        {(this.state.isSharePopup) ? <ShareLinkPopup project_id={this.state.project_id} isActive={this.state.isSharePopup} onCancelAction={this.cancelPopup.bind(this)} /> : null } 
	      	</div>
      )
	}
}

export default ProjectList;