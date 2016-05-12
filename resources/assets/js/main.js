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
	_setData: function(data){
		this.setState({data: data});
	},
	render: function(){
		return(
			<div>
				<div className="editorHeader">
					<FileLoader storeFileContent={this._setData} />
					<FileDownloader text={this.state.data} title="Document"/>
				</div>
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

const FileLoader = React.createClass({
	getInitialState: function(){
		return({showError: false});
	},
	_handleFile: function(e){
		let file = e.target.files[0];
		let textType = /^text\//;
		if(textType.test(file.type)){
			let reader = new FileReader();
			reader.readAsText(file);
			reader.onload = function(e){
				this.props.storeFileContent(e.target.result);
			}.bind(this);
			this.setState({showError: false});
		} else {
			this.setState({showError: true});
		}
	},
	_hideError: function(){
		this.setState({showError: false});
	},
	render: function(){
		return(
			<div>
				{this.state.showError?<p className="errorMessage" onClick={this._hideError}>Mauvais format de fichier</p>:''}
				<p>Importer un fichier</p>
				<input type="file" accept="text/*, .md" onChange={this._handleFile} />
			</div>
		);
	}
});

const FileDownloader = React.createClass({
	getInitialState: function(){
		return({href: ''});
	},
	componentWillMount:function(){
  	    this._createUrl(this.props.text);
	},
	componentWillUpdate(nextProps) {
  	    if (nextProps.text !== this.props.text) {
  	    	this._createUrl(nextProps.text);
		}
	},
	_createUrl: function(props){
		let text = new Blob([props], {type: 'text/markdown'});
		this.setState({href: URL.createObjectURL(text)});
	},
	render: function(){
		return(
			<a href={this.state.href} download={this.props.title + '.md'}>Télécharger au format .md</a>
		);
	}
});

ReactDOM.render(
		<Editor />,
		document.getElementById('main')
);
