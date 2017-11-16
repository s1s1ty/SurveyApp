import React, { Component } from "react";

class SuccessNotification extends React.Component{
	constructor(props){
		super(props);
	}

	render(){
		return(
			<div className="notification">
				<span className="glyphicon glyphicon-ok"></span> { this.props.type } Sucessfully!!
			</div>
		)
	}
}

export default SuccessNotification;