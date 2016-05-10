'use strict'

const React = require('react');
const ReactDOM = require('react-dom');
const CodeMirror = require('codemirror');
require('codemirror/mode/markdown/markdown');

const CMBox = React.createClass({
	componentDidMount() {
	    this.cm = CodeMirror(this.refs.editor, {
	      value: this.props.defaultValue,
	      mode: 'markdown',
	      theme: 'monokai',
	      lineNumbers: true,
	      autoCloseBrackets: true,
	      matchBrackets: true,
	      styleActiveLine: true
	    });
	    this.cm.on('change', (cm) => {
	      this.props.onChange(cm.getValue());
	    });
	  },
	  render() {
	    return <div ref='editor'/>
	  }
});

const Editor = React.createClass({
	getInitialState: function(){
		let storedText = localStorage.getItem('storedText');
		if(storedText) {
			return({ data : storedText});	
		}
		return({ data : '...'});
	},
	onChange: function(newText){
		
		localStorage.setItem('storedText', newText)
		this.setState({data: newText});
	},
	rawMarkup: function(){
		return { __html: marked(this.state.data, {sanitize: true}) };
	},
	render: function(){
		return(
			<div>
				<div className="view">
					<h2>Aperçu</h2>
					<div dangerouslySetInnerHTML={this.rawMarkup()}></div>
				</div>
				<div className="editor">
					<h2>Editeur</h2>
					<CMBox onChange={this.onChange}  defaultValue={this.state.data} />
				</div>
			</div>
		);
	}
});

ReactDOM.render(
		<Editor />,
		document.getElementById('main')
);
