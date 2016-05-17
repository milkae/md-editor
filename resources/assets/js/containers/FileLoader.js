import React from 'react'
import LoadInput from '../components/LoadInput'

const FileLoader = React.createClass({
	getInitialState: function(){
		return({showError: false, showLoadInput: false});
	},
	_handleFile: function(e){
		let file = e.target.files[0];
		let textType = /^text\//;
		if(textType.test(file.type)){
			let reader = new FileReader();
			reader.readAsText(file);
			reader.onload = function(e){
				this.props.storeFile({ title: file.name, content: e.target.result });
			}.bind(this);
			this.setState({showError: false});
		} else {
			this.setState({showError: true});
		}
	},
	_hideError: function(){
		this.setState({showError: false});
	},
	showLoadInput: function(){
		this.setState({ showLoadInput: !this.state.showLoadInput })
	},
	render: function(){
		return(
		<div>
			{this.state.showError?<p className="errorMessage" onClick={this._hideError}>Mauvais format de fichier</p>:''}
			<button onClick={this.showLoadInput}>Importer un fichier</button>
			{this.state.showLoadInput?<LoadInput onChange={this._handleFile}/> : ''}
		</div>
		)
	}	
})

export default FileLoader