'use strict'

const React = require('react');
const ReactDOM = require('react-dom');
const CodeMirror = require('codemirror');
const $ = require('jquery');
require('codemirror/mode/markdown/markdown');

/* Composant CodeMirror */
const CMBox = React.createClass({
	componentDidMount() {
	    this.cm = CodeMirror(this.refs.editor, {
	      value: this.props.value,
	      mode: 'markdown',
	      theme: 'monokai',
	      lineNumbers: true,
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
		return {data : '...', online: false};
	},
	componentDidMount: function(){
		/* Chargement des events IO */
		window.addEventListener('load', this._onLoad);
		window.addEventListener('online', this._switchOnline);
		window.addEventListener('offline', this._switchOffline);
	},
	_onLoad: function() {
			if (navigator.onLine) {
		   		this._onlineLoadText();
			} else {
				this._offlineLoadText();
			}
	},
	/* Gestion du status de connexion */
	_switchOnline: function() {
		let storedText = localStorage.getItem('storedText');
		this._onlineStoreText(storedText);
		this.setState({online: true});	    
	},
	_switchOffline: function() {
		this.setState({online: false});
	},
	/* Chargement texte sauvegardé */
	_onlineLoadText : function(){
		$.ajax({
			url: 'app.php',
			type: 'GET',
			dataType: 'json',
			cache: false,
			success: function(data){
				this.setState({ data: data, online: true });
			}.bind(this)
		});
	},
	_offlineLoadText: function(){
		let storedText = localStorage.getItem('storedText');
		if(storedText) {
			this.setState({ data : storedText, online: false});	
		}
	},
	/* Sauvegarde texte */
	_onlineStoreText: function(text) {
		if(!text) {
			let text = this.state.data;
		}
		if(this.xhr !== undefined){
			this.xhr.abort();
		}
		this.xhr = $.ajax({
			url: 'app.php',
			type: 'POST',
			dataType: 'json',
			data : { data: text }
		});
	},
	/* Ecouteurs onChange */
	_onChange: function(newText) {
		if(this.state.online){
			this._onlineHandleChange(newText);
		} else {
			this._offlineHandleChange(newText);
		}
	},
	_onlineHandleChange: function(newText) {
		this._onlineStoreText(newText);
		this.setState({data: newText});
	},
	_offlineHandleChange: function(newText) {
		localStorage.setItem('storedText', newText)
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
