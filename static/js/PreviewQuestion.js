import React, { Component } from "react";

import axios from "axios";


class PreviewQuestion extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			datas: [],
			project_id: '',
			ans_data: {},
			answer: ''
		}
	}

	componentDidMount(){
		let project_id = this.props.match.params.projectId;
		let url = "/survey/api/question/" + project_id + "/";
		let that = this;
		this.setState({project_id: project_id});
		axios.get(url)
		.then((results) => {
			let request_data = results.data			
      		let data = this.state.datas; 
      		if( request_data.length === 0){
      			data.push({
				question_name: 'click to write question text',
				answer_options: [
						{name: 'click to write choice 1', 'choice': true},
						{name: 'click to write choice 1', 'choice': true},
						{name: 'click to write choice 1', 'choice': true},
					],
				type: this.state.type,
				project_id: project_id,
				question_id: ''

			})
      		}
      		else{
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
					data.push({
							question_name: request_data[i].question_name,
							answer_options: ans_list,
							type: request_data[i].question_type,
							project_id: project_id,
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

	onChangeRadio(question_id, question_index, event){
		let value = event.target.value;
		let {ans_data} = this.state;
		ans_data[ question_id ] = value
	}

	onChangeText(question_id, question_index, event){
		let {ans_data} = this.state;
		ans_data[ question_id ] = event.target.value
		console.log(ans_data)
		this.setState({answer: event.target.value});
	}

	// ANSWER OPTIONS DISPLAY
	displayAnswerOption(answer_options, question_index, question_id){
		if( answer_options.length > 1){
			return answer_options.map( (option, index) =>{
				return(
					
					<li className="list-group-item" key={index}>
						<div className="input-group">
							<span className="input-group-addon">
								<input type="radio" name={question_index} value={option.name} 
								onClick={ this.onChangeRadio.bind(this, question_id, question_index) } readOnly/> 
		      				</span>
							<input className="form-control ques-form-control" type="text" name="ans_op" value= {option.name} 
								readOnly/>
						</div>
					</li>
				)
			})
		}
		else{
			return answer_options.map( (option, index) =>{
				return(
					<li className="list-group-item" key={index}>
						<input className="form-control ques-form-control" type="text" name="ans_op" value= {this.state.answer} 
						 onChange={ this.onChangeText.bind(this, question_id, question_index) }/>
					</li>
				)
			})
		}
	}

	// ALL QUESTION DISPLAY
	displayData(){
		let newData = this.state.datas;
		let rowData = newData.map( (data, index) =>{
			return(
				<div className="well" key={ index }>
			    		<ul className="list-group">
			    			<h3 className="list-group-item-heading">
			    				Q. <input className="ques-input" type="text" name="text_field" 
			    					value={ data.question_name } readOnly/>
			    			</h3>

			    			{ this.displayAnswerOption(data.answer_options, index, data.question_id) }
			    		</ul>
			    </div>
		    )
		})

		return rowData;
	}

	// FIRE FOR SAVE ANSWER IN DB
	saveAnswer(event){
		let post_data = this.state.ans_data;
		console.log(post_data);
		axios(
	    {
	      url: "/survey/api/answers/",
	      data: post_data,
	      method: "POST",
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

	// DISPLAY BUTTON
	submitButton(){
		let url = "/survey/export-question/pdf/"+ this.state.project_id+"/";
		return(
			<div className="btn-group">
	    		<a href={ url } className="btn btn-success" target="_blank">
	    			<span className="glyphicon glyphicon-save"></span> Download as PDF
    			</a>
	    		<button className="btn btn-primary" onClick={ this.saveAnswer.bind(this) }>
						<span className="glyphicon glyphicon-plus"></span> Submit Answer
				</button>
			</div>
		)
	}

	render(){
		return(
			<div className="App">
				{ this.displayData() }
				{ this.submitButton() }
			</div>
		)
	}
}

export default PreviewQuestion;

