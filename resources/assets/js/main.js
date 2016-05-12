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
		return { data : [], actual: { id: 0, title: 'Document sans titre', content: '...' }, online: false };
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
		let storedTexts = JSON.parse(localStorage.getItem('storedTexts'));
		this._onlineStoreText(storedTexts);
		this.setState({online: true});	    
	},
	_switchOffline: function() {
		localStorage.setItem('storedTexts', JSON.stringify(this.state.data));
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
				this.setState({ data: data, actual: data[0] });
			}.bind(this)
		});
		this.setState({online: true});	    
	},
	_offlineLoadText: function(){
		let storedTexts = JSON.parse(localStorage.getItem('storedTexts'));
		if(storedTexts) {
			this.setState({ data : storedTexts, actual: storedTexts[0], online: false});	
		}
	},
	/* Sauvegarde texte */
	_onlineStoreText: function(texts) {
		if(this.xhr !== undefined){
			this.xhr.abort();
		}
		this.xhr = $.ajax({
			url: 'app.php',
			type: 'POST',
			dataType: 'json',
			data : { data: texts }
		});
	},
	_offlineStoreData: function(actual){
		let storedTexts = this.state.data;
		console.log(storedTexts);
		storedTexts[actual.id] = actual;
		localStorage.setItem('storedTexts', JSON.stringify(storedTexts));
		this.setState({ data: storedTexts, actual: actual });
	},
	/* Ecouteurs onChange */
	_onChange: function(newText) {
		let actual = { id: this.state.actual.id, title: this.state.actual.title, content: newText};
		if(this.state.online){
			this._onlineHandleChange(actual);
		} else {
			this._offlineStoreData(actual);
		}
	},
	_onlineHandleChange: function(actual) {
		let storedTexts = this.state.data;
		storedTexts[actual.id] = actual;
		this._onlineStoreText(storedTexts);
		this.setState({ data: storedTexts, actual: actual });
	},
	_changeTitle: function(e){
		let actual = { id: this.state.actual.id, title: e.target.value, content: this.state.actual.content};
		if(this.state.online){
			this._onlineHandleChange(actual);
		} else {
			this._offlineStoreData(actual);
		}
	},
	_rawMarkup: function(){
		return { __html: marked(this.state.actual.content, {sanitize: true}) };
	},
	_addDoc: function(doc){
		let texts = this.state.data;
		texts.push(doc);
		this.setState({ data: texts, actual: doc});
	},
	_newDoc: function(){
		let id = this.state.data.length;
		let doc = {id: id, title: 'Document sans titre', content: '...'};
		this._addDoc(doc);
	},
	_loadDoc: function(doc){
		let id = this.state.data.length;
		doc.id = id;
		this._addDoc(doc);
	},
	_changeDoc: function(id){
		this.setState({actual : this.state.data[id]});
	},
	render: function(){
		return(
			<div>
				<div className="editorHeader">
					<FileLoader storeFileContent={this._loadDoc} />
					<FileDownloader doc={this.state.actual}/>
				</div>
				<ListeDocuments docs={this.state.data} addDoc={this._newDoc} changeDoc={this._changeDoc} />
				<div className="view">
				<input type="text" value={this.state.actual.title} onChange={this._changeTitle} />
					<h2>Aperçu</h2>
					<div dangerouslySetInnerHTML={this._rawMarkup()}></div>
				</div>
				<div className="editor">
					<h2>Editeur</h2>
					<CMBox onChange={this._onChange} value={this.state.actual.content} />
				</div>
			</div>
		);
	}
});

const ListeDocuments = React.createClass({
	_changeDoc: function(e){
		this.props.changeDoc(e.target.id);
	},
	render: function(){
		var DocsNodes = this.props.docs.map((doc) => {
	      return (
	        <button onClick={this._changeDoc} key={doc.id} id={doc.id}>{doc.title}</button>
	      );
	    });
	    return(
	    	<div>
	    		{DocsNodes}
	    		<button onClick={this.props.addDoc} >+</button>
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
				this.props.storeFileContent({ title: file.name, content: e.target.result });
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
  	    this._createUrl(this.props.doc.content);
	},
	componentWillUpdate(nextProps) {
  	    if (nextProps.doc.content !== this.props.doc.content) {
  	    	this._createUrl(nextProps.doc.content);
		}
	},
	_createUrl: function(props){
		let text = new Blob([props], {type: 'text/markdown'});
		this.setState({href: URL.createObjectURL(text)});
	},
	render: function(){
		return(
			<a href={this.state.href} download={this.props.doc.title + '.md'}>Télécharger au format .md</a>
		);
	}
});

ReactDOM.render(
		<Editor />,
		document.getElementById('main')
);
