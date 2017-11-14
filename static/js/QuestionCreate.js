import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';


// CREATE AND UPDATE QUESTION
class QuestionCreate extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			datas: [],
			type: 'R',
			project: '',
			status: 'new',
			question_id: '',

		}

	}

	// DEFAULT SET 1 QUESTION OR ALL EXISTING QUESTION UNDER PROJECT
	componentDidMount(){
		let project_id = this.props.match.params.projectId;
		let url = "/survey/api/question/" + project_id + "/";
		let that = this;
		this.setState({project: project_id});
		axios.get(url)
		.then((results) => {
			let request_data = results.data
			console.log(results.data)
			
      		let data = this.state.datas; 
      		if( request_data.length === 0  && data.length === 0){
      			data.push({
				question_name: 'click to write question text',
				answer_options: [
						{name: 'click to write choice 1', 'choice': true},
						{name: 'click to write choice 1', 'choice': true},
						{name: 'click to write choice 1', 'choice': true},
					],
				type: this.state.type,
				project: project_id,
				question_id: ''

			})
      		}
      		else{
      			this.setState({status: 'update'});
      			let i;
      			var j=0;
      			let ans_split = "";
      			for (i = 0; i < request_data.length; i++) { 
      				
      				ans_split = request_data[i].answer_option.split(',')
      				var ans_list = new Array();
      				
      				for ( j = 0; j < ans_split.length; j++){
						ans_list.push({
							name: ans_split[j], choice:true,
						})
					}
					console.log("id", request_data[i].id)
					data.push({
							question_name: request_data[i].question_name,
							answer_options: ans_list,
							type: request_data[i].question_type,
							project: project_id,
							question_id: request_data[i].id
						})
					
				}
      		}
      		this.setState({datas: data})
      		
    	})
    	.catch( (error) =>{
      		console.log(error);
    	});
	}

	// FORE FOR ADD NEW QUESTION
	addRow(event){
		event.preventDefault();
		let data = this.state.datas;
		// For multiple choice question
		if( this.state.type == 'R'){
			data.push({
					question_name: 'click to write question text',
					answer_options: [
							{name: 'click to write choice 1', 'choice': true},
							{name: 'click to write choice 1', 'choice': true},
							{name: 'click to write choice 1', 'choice': true},
						],
					type: this.state.type,
					project: this.state.project,
					question_id: ''
				});
		}
		else{
			data.push({
					question_name: 'click to write question text',
					answer_options: [
						{name: '', 'choice': true},
					],
					type: this.state.type,
					project: this.state.project,
					question_id: ''
				});
		}
		this.setState({ datas: data });
	}

	// CHANGE QUESTION TEXT ON CLICK EVENT
	onChangeQuestion( index, event){
		event.preventDefault();
		let all_data = this.state.datas; 
		all_data[index].question_name = event.target.value;
		this.setState({ datas: all_data })
		
	}

	// CHANGE ANSWER TEXT ON CLICK EVENT
	onChangeOption(question_index, index, event){
		let all_data = this.state.datas;
		let currentQues = all_data[question_index].answer_options[index];
		currentQues.name = event.target.value;
		this.setState({ datas: all_data })
	}

	// DIPLAY ALL ANS OPTION IN FORMAT
	displayAnswerOption(answer_options, question_index){

		if( answer_options.length > 1){
			return answer_options.map( (option, index) =>{
				return(
					
					<li className="list-group-item" key={index}>
						<div className="input-group">
							<span className="input-group-addon">
								<input type="radio" name={question_index} value={option.name}/> 
		      				</span>
							<input className="form-control ques-form-control" type="text" name="ans_op" value= {option.name} 
								onChange={this.onChangeOption.bind(this, question_index, index)} />
						</div>
					</li>
				)
			})
		}
		else{
			return answer_options.map( (option, index) =>{
				return(
					
					<li className="list-group-item" key={index}>
						<input className="form-control ques-form-control" type="text" name="ans_op" value= {option.name} 
								onChange={this.onChangeOption.bind(this, question_index, index)} />
					</li>
				)
			})
		}
	}

	// DELETE 1 QUESTION FROM DB
	removeRow(question_id, index, event){
		let url = "/survey/api/questions/" + question_id + "/";
		if( this.state.status == "new" ){ // for new add
			let all_data = this.state.datas;
			if( all_data.length > 1){
				all_data.splice(index, 1);
				this.setState({ datas: all_data});
			}
		}
		else{ // for update view
			axios.delete(url)
			.then((response) => {
			    console.log(response);
			    let all_data = this.state.datas;
				if( all_data.length > 1){
					all_data.splice(index, 1);
					this.setState({ datas: all_data});
				}
			})
			  .catch(function (error) {
			    console.log(error);
			});
		}
	}

	// FIRE FOR UPDATE EXISTING QUESTION OR ADD NEW QUESTION 
	updateRow(question_id, index, event){
		let url="";
		let method="";

		let all_data = this.state.datas;
		let current_ques = all_data[index];
		console.log("update row data", current_ques, "index", index);

		if( current_ques.question_id ){
			method="PUT";
			url = "/survey/api/questions/" + question_id + "/";
		}
		else{
			method="POST";
			url="/survey/api/questions/";
			current_ques = [current_ques];
		}

		axios({
			method: method,
			url: url,
			data: current_ques,
			headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
		})
		.then(function (response) {
		    console.log(response);
		})
		  .catch(function (error) {
		    console.log(error);
		});
		
	}

	// FIRE FOR SAVE QUESTION IN DB
	saveQuestion(){
		let url = '/survey/api/questions/';
		let method = 'POST';
		let all_data = this.state.datas;
		this.setState({ datas: all_data })
		
	    axios(
	    {
	      url: url,
	      data: all_data,
	      method: method,
	      headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
	    })
	    .then(function (response) {
	      console.log(response.data);      
	      
	    })
	    .catch(function (error) {
	      console.log(error);
	    });
	}

	// FIRE FOR UPDATE QUESTION TYPE
	changeType(event){
		var value = event.target.value;
		this.setState({ type: value })
	}

	// ALL QUESTION DISPLAY
	displayRow(){
		let newData = this.state.datas;
		let rowData = newData.map( (data, index) =>{
			return(
				<div className="well" key={ index }>
			    		<ul className="list-group">
			    			<h3 className="list-group-item-heading">
			    				Q. <input className="ques-input" type="text" name="text_field" 
			    					onChange={ this.onChangeQuestion.bind(this, index) } value={ data.question_name } />
			    			</h3>

			    			{ this.displayAnswerOption(data.answer_options, index) }
			    		</ul>
			    	
				    	<button title="Delete" className="btn btn-danger pull-right" onClick={ this.removeRow.bind(this, data.question_id, index)}>
				    		<span className="glyphicon glyphicon-remove"></span>
				    	</button>
				    	<div className={(this.state.status=='new') ? "update-button hide" : "update-button"}>
					    	<button title="Update" className="btn btn-success pull-right" onClick={ this.updateRow.bind(this, data.question_id, index)}>
					    		<span className="glyphicon glyphicon-ok"></span>
					    	</button> 
				    	</div>
			    </div>
		    )
		})

		return rowData;
	}

	// QUESTION TYPE SELECT HTML
	questionType(){
		return(
			<select className="form-control select-form" name="ques_type" onChange = {this.changeType.bind(this) }>
				<option value="R" >Radio</option>
				<option value="T" >TextField</option>
			</select>
		)
	}

	// HIDE AND SHOW BUTTON FOR UPDATE AND CRETAE QUESTION VIEW
	displayButton(){
		let projectId = this.state.project;

		console.log(projectId);
		if( this.state.status == 'new'){
			return(
				<div className="btn-group">
		    		<button className="btn btn-success" onClick={ this.saveQuestion.bind(this) }>
		    			<span className="glyphicon glyphicon-save"></span> Create Survey
	    			</button>
	    			<Link to={`/survey/home/preview-question/${projectId}`} className="btn btn-info" >
							<span className="glyphicon glyphicon-book"></span> Preview question
					</Link>
		    		<button className="btn btn-primary" onClick={ this.addRow.bind(this) }>
							<span className="glyphicon glyphicon-plus"></span> Create a new question
					</button>
					{ this.questionType() }
				</div>
			)
		}
		else{
			return(
				<div className="btn-group">
	    			<Link to={`/survey/home/preview-question/${projectId}`} className="btn btn-info" >
							<span className="glyphicon glyphicon-book"></span> Preview question
					</Link>
					<button className="btn btn-primary" onClick={ this.addRow.bind(this) }>
							<span className="glyphicon glyphicon-plus"></span> Create a new question
					</button>
					{ this.questionType() }
				</div>
			)
		}
	}

	render() {
	    return (
	    	<div className="App">
	        	{ this.displayRow() }
	        	{ this.displayButton() }
	        	
	      </div>
	    );
  }
}

export default QuestionCreate;

