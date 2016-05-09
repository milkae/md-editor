'use strict'

const React = require('react');
const ReactDOM = require('react-dom');
const Codemirror = require('react-codemirror');

const Editor = React.createClass({
	getInitialState: function(){
		return({ data : 'Ecrivez ici...'});
	},
	onChange: function(newText){
		this.setState({data: newText});
	},
	rawMarkup: function(){
		return { __html: marked(this.state.data, {sanitize: true}) };
	},
	render: function(){
		return(
			<div>
				<div dangerouslySetInnerHTML={this.rawMarkup()}></div>
				<Codemirror onChange={this.onChange} ref="textarea" defaultValue={this.state.data} />
			</div>
		);
	}
});

ReactDOM.render(
		<Editor />,
		document.getElementById('main')
);
