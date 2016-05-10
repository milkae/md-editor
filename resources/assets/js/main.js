'use strict'

const React = require('react');
const ReactDOM = require('react-dom');


const Editor = React.createClass({
	getInitialState: function(){
		let storedText = localStorage.getItem('storedText');
		if(storedText) {
			return({ data : storedText});	
		}
		return({ data : '...'});
	},
	onChange: function(){
		let text = this.refs.textarea.value;
		localStorage.setItem('storedText', text)
		this.setState({data: text});
	},
	rawMarkup: function(){
		return { __html: marked(this.state.data, {sanitize: true}) };
	},
	render: function(){
		return(
			<div>
				<div className="view" dangerouslySetInnerHTML={this.rawMarkup()}></div>
				<textarea onChange={this.onChange} ref="textarea" defaultValue={this.state.data}></textarea>
			</div>
		);
	}
});

ReactDOM.render(
		<Editor />,
		document.getElementById('main')
);
