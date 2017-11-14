import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import ProjectCreate from './ProjectCreate';
import ProjectList from './ProjectList';
import QuestionCreate from './QuestionCreate';
import PreviewQuestion from './PreviewQuestion';
import NotFound from './NotFound';
import ShareLinkPopup from './ShareLinkPopup';


class App extends React.Component{

	render(){
		return(
			<Router>
				<Switch>
					<Route exact path="/survey/home/" component={ProjectCreate} />
					<Route path="/survey/home/question/:projectId" component={QuestionCreate} />
					<Route path="/survey/home/preview-question/:projectId" component={PreviewQuestion} />
					<Route path="/survey/home/share-link/" component={ShareLinkPopup} />
					<Route path="/survey/home/*" component={NotFound} />
				</Switch>
			</Router>
		)
	}
}

export default App;