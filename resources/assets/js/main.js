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
			return({ data : storedTexts, actual: storedTexts[0] });	
		}
		return({ data : [], actual: { id: 0, title: 'Document sans titre', content: '...' }, showLoadInput: false });
	},
	_onChange: function(newText){
		let actual = Object.assign({}, this.state.actual, { content: newText });
		this._storeData(actual);
	},
	_addToTextsTab: function(item) {
		return [...this.state.data, item];
	},
	_storeData: function(actual){
		let storedTexts = [
			...this.state.data.slice(0, Number(actual.id)),
			actual,
			...this.state.data.slice(Number(actual.id) + 1)
		];
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
	_addDoc: function(file){
		file.id = this.state.data.length;
		this._storeData(file);
	},
	_changeDoc: function(id){
		this.setState({actual : this.state.data[id]});
	},
	_showLoadInput: function(){
		this.setState({showLoadInput: !this.state.showLoadInput});
	},
	render: function(){
		return(
			<div>
				<div className="editorHeader">
					<ListeDocuments docs={this.state.data} addDoc={this._addDoc} changeDoc={this._changeDoc} />
					<input type="text" value={this.state.actual.title} onChange={this._changeTitle} className="titleInput"/>
				</div>
				<div className="view" dangerouslySetInnerHTML={this.rawMarkup()}></div>
				<div className="editor">
					<CMBox onChange={this._onChange}  defaultValue={this.state.actual.content} value={this.state.actual.content} />
				</div>
				<div className="fileBox">
					<DownloadFile doc={this.state.actual} />
					<button onClick={this._showLoadInput}>Importer un fichier</button>
					{this.state.showLoadInput?<LoadFileForm addFile={this._addDoc}/> : ''}
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
	    	<div className="textList">
	    		{DocsNodes}
	    		<button onClick={() => this.props.addDoc({title: 'Document sans titre', content: '...'})}>+</button>
	    	</div>
	    );
	}
});

const DownloadFile = React.createClass({
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

const LoadFileForm = React.createClass({
	getInitialState: function(){
		return ({ fileError: false });
	},
	_handleFile: function(e){
		let file = e.target.files[0];
		let textType = /^text\//;
		if(textType.test(file.type)){
			let reader = new FileReader();
			reader.readAsText(file);
			reader.onload = function(e){
				this.props.addFile({ content: e.target.result, title: file.name });
				this.setState({ fileError: false });
			}.bind(this);
		} else {
			this.setState({ fileError: true });
		}
	},
	_hideErrorMessage: function(){
		this.setState({ fileError: false });
	},
	render: function(){
		let ErrorMessage ;
		if(this.state.fileError) {
			ErrorMessage = (<p className="error" onClick={this._hideErrorMessage}>Mauvais format de fichier</p>);
		}
		return(
			<form>
				{ErrorMessage}
				<input type="file" accept="text/*, .md" onChange={this._handleFile} />
			</form>
		);
	}
});

ReactDOM.render(
		<Editor />,
		document.getElementById('main')
);
