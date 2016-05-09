'use strict'

const React = require('react');
const ReactDOM = require('react-dom');
const $ = require('jquery');

const Editor = React.createClass({
	getInitialState: function(){
		return({ data : 'Ecrivez ici...'});
	},
	onChange: function(e){
		this.setState({data: this.refs.textarea.value});
	},
	rawMarkup: function(){
		return { __html: marked(this.state.data, {sanitize: true}) };
	},
	render: function(){
		return(
			<div>
				<div dangerouslySetInnerHTML={this.rawMarkup()}></div>
				<textarea onChange={this.onChange} ref="textarea" defaultValue={this.state.data}></textarea>
			</div>
		);
	}
});

ReactDOM.render(
		<Editor />,
		document.getElementById('main')
);

$(function(){
var myCodeMirror = CodeMirror.fromTextArea($('textarea')[0]);
});