'use strict'

const React = require('react');
const ReactDOM = require('react-dom');
const CodeMirror = require('codemirror');
const $ = require('jquery');
require('codemirror/mode/markdown/markdown');

const CMBox = React.createClass({
	componentDidMount() {
	    this.cm = CodeMirror(this.refs.editor, {
	      value: this.props.value,
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
		return {data : ''};
	},
	componentDidMount: function(){
		this._loadStoredText();
	},
	_loadStoredText : function(){
		$.ajax({
			url: 'app.php',
			type: 'GET',
			dataType: 'json',
			cache: false,
			success: function(data){
				this.setState({ data: data });
			}.bind(this)
		});
	},
	_storeText: function(){
		$.ajax({
			url: 'app.php',
			type: 'POST',
			dataType: 'json',
			data : { data: this.state.data }
		});
	},
	_onChange: function(newText){
		this._storeText();
		this.setState({data: newText});
	},
	_rawMarkup: function(){
		return { __html: marked(this.state.data, {sanitize: true}) };
	},
	render: function(){
		return(
			<div>
				<div className="view">
					<h2>Aperçu</h2>
					<div dangerouslySetInnerHTML={this._rawMarkup()}></div>
				</div>
				<div className="editor">
					<h2>Editeur</h2>
					<CMBox onChange={this._onChange} value={this.state.data} />
				</div>
			</div>
		);
	}
});

ReactDOM.render(
		<Editor />,
		document.getElementById('main')
);
