'use strict'

const React = require('react');
const ReactDOM = require('react-dom');
const $ = require('jquery');

import CodeMirrorEditor from './components/CodeMirrorEditor'
import View from './components/View'
import Menu from './containers/Menu'

/* Composant CodeMirror */


const Editor = React.createClass({
	getInitialState: function(){
		return { data : [{ id: 0, title: 'Document sans titre', content: '...' }], actual: { id: 0, title: 'Document sans titre', content: '...' }, online: false, showMenu: false };
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
	_onlineStoreTexts: function(texts) {
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
	_offlineStoreData: function(storedTexts){
		localStorage.setItem('storedTexts', JSON.stringify(storedTexts));
	},
	/* Ecouteurs onChange */
	_onChange: function(newText) {
		this._handleChange({ content: newText })
	},
	_changeTitle: function(e){
		this._handleChange({ title: e.target.value });
	},
	_handleChange: function(newProp) {
		let actual = Object.assign({}, this.state.actual, newProp);
		let storedTexts = [
			...this.state.data.slice(0, Number(actual.id)),
			actual,
			...this.state.data.slice(Number(actual.id) + 1)
			];
		if(this.state.online){
			this._onlineStoreTexts(storedTexts);
		} else {
			this._offlineStoreData(storedTexts);
		}
		this.setState({ data: storedTexts, actual: actual });
	},
	_addDoc: function(doc){
		doc.id = this.state.data.length;
		let texts = [...this.state.data, doc];
		this.setState({ data: texts, actual: doc});
	},
	_changeDoc: function(id){
		this.setState({actual : this.state.data[id]});
	},
	_toggleMenu: function(){
		this.setState({ showMenu: !this.state.showMenu })
	},
	render: function(){
		return(
			<div>
				<div className="editorHeader">
					<button onClick={this._toggleMenu} className="menuBtn">Menu</button>
					{this.state.showMenu?
						<Menu 
						storeFile={this._addDoc} 
						actual={this.state.actual} 
						texts={this.state.data} 
						addDoc={this._addDoc} 
						onTextClick={this._changeDoc} 
						/> : ''}
					
					<input type="text" value={this.state.actual.title} onChange={this._changeTitle} className="titleInput"/>
				</div>
				<View className="view" content={this.state.actual.content} />
				<div className="editor">
					<CodeMirrorEditor onChange={this._onChange} value={this.state.actual.content} />
				</div>
			</div>
		);
	}
});

ReactDOM.render(
		<Editor />,
		document.getElementById('main')
);
