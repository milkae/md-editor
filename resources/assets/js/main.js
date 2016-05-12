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
		let storedTexts = JSON.parse(localStorage.getItem('storedTexts'));
		if(storedTexts) {
			return({ data : storedTexts, actual: storedTexts[0], fileError: false });	
		}
		return({ data : [], actual: { id: 0, title: 'Document sans titre', content: '...' }, fileError: false });
	},
	_onChange: function(newText){
		let actual = { id: this.state.actual.id, title: this.state.actual.title, content: newText};
		this._storeData(actual);
	},
	_storeData: function(actual){
		let storedTexts = this.state.data;
		storedTexts[this.state.actual.id] = actual;
		localStorage.setItem('storedTexts', JSON.stringify(storedTexts));
		this.setState({ data: storedTexts, actual: actual });
	},
	_changeTitle: function(e){
		let actual = { id: this.state.actual.id, title: e.target.value, content: this.state.actual.content};
		this._storeData(actual);
	},
	rawMarkup: function(){
		return { __html: marked(this.state.actual.content, {sanitize: true}) };
	},
	_handleFile: function(e){
		let file = e.target.files[0];
		let textType = /^text\//;
		if(textType.test(file.type)){
			let reader = new FileReader();
			reader.readAsText(file);
			reader.onload = function(e){
				this.setState({ actual: { content: e.target.result }, fileError: false });
			}.bind(this);
		} else {
			this.setState({ fileError: true });
		}
	},
	_addDoc: function(){
		let id = this.state.data.length;
		this.state.data.push({id: id, title: 'Document sans titre', content: '...'});
		this._changeDoc(id);
	},
	_hideErrorMessage: function(){
		this.setState({ fileError: false });
	},
	_changeDoc: function(id){
		this.setState({actual : this.state.data[id]});
	},
	render: function(){
		return(
			<div>
				<div className="editorHeader">
				{this.state.fileError?<ErrorMessage hide={this._hideErrorMessage} />:''}
				<LoadFileForm handleFile={this._handleFile}/>
				<DownloadFile text={this.state.actual.content} title={this.state.actual.title}/>
				</div>
				<ListeDocuments docs={this.state.data} addDoc={this._addDoc} changeDoc={this._changeDoc} />
				<div className="view">
					<h2>Aperçu</h2>
					<div dangerouslySetInnerHTML={this.rawMarkup()}></div>
				</div>
				<div className="editor">
					<h2>Editeur</h2>
					<input type="text" value={this.state.actual.title} onChange={this._changeTitle} />
					<CMBox onChange={this._onChange}  defaultValue={this.state.actual.content} value={this.state.actual.content} />
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

const DownloadFile = React.createClass({
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

const LoadFileForm = React.createClass({
	render: function(){
		return(
			<form>
				<p>Importer un fichier</p>
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
