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
	  componentWillReceiveProps(nextProps) {
  	    if (nextProps.value !== this.cm.getValue()) {
  			this.cm.setValue(nextProps.value);
  	    }
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
		return({ data : '...', fileError: false});
	},
	onChange: function(newText){	
		localStorage.setItem('storedText', newText)
		this.setState({data: newText});
	},
	rawMarkup: function(){
		return { __html: marked(this.state.data, {sanitize: false}) };
	},
	_handleFile: function(e){
		let textType = /^text\//;
		if(textType.test(e.target.files[0].type)){
			let reader = new FileReader();
			reader.readAsText(e.target.files[0]);
			reader.onload = function(e){
				this.setState({data : e.target.result, fileError: false});
			}.bind(this);
		} else {
			this.setState({fileError: true});
		}
	},
	_hideErrorMessage: function(){
		this.setState({fileError: false});
	},
	render: function(){
		return(
			<div>
				{this.state.fileError?<ErrorMessage hide={this._hideErrorMessage} />:''}
				<LoadFileForm handleFile={this._handleFile}/>
				<div className="view">
					<h2>Aperçu</h2>
					<div dangerouslySetInnerHTML={this.rawMarkup()}></div>
				</div>
				<div className="editor">
					<h2>Editeur</h2>
					<CMBox onChange={this.onChange}  defaultValue={this.state.data} value={this.state.data} />
				</div>
			</div>
		);
	}
});

const LoadFileForm = React.createClass({
	render: function(){
		return(
			<form>
				<input type="file" accept="text/*, .md" onChange={this.props.handleFile} />
			</form>
		);
	}
});

const ErrorMessage = React.createClass({
	render: function(){
		return(
			<p className="error" onClick={this.props.hide}>Mauvais format de fichier</p>
		);
	}
})

ReactDOM.render(
		<Editor />,
		document.getElementById('main')
);
