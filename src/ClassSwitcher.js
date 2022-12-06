//import './App.css';
import React from 'react';
//import ReactDOM from 'react-dom';
//import jsondata from './sm_damage.json';

class App extends React.Component {
	render(){
		let html=(<p>Inserted p</p>);
		let className="funtimes";
		return (
			<ClassSwitcher html={html} className={className} />
		);
	}
}

class ClassSwitcher extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			html: (<p className="initclass">init text</p>),
			className: ""
		}
		this.removeClass = this.removeClass.bind(this);
		this.addClass = this.addClass.bind(this);
		this.toggleClass = this.toggleClass.bind(this);
	}
	
	removeClass(html, className){
		this.setState({
			html: html,
		    className: className
		});
	}
	
	addClass(html, className){
		this.setState({
			html: html,
		    className: className
		});
	}
	
	toggleClass(html, className){
		this.setState({
			html: html,
		    className: className
		});
	}
	
	render(){
		return (
			<div>
			{this.state.html}
			</div>
		);
	}
}

export default App;
