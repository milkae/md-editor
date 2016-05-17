import React from 'react'
import LoadInput from '../components/LoadInput'

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
	render: function(){
		return(
		<div>
			{this.state.showError?<p className="errorMessage" onClick={this._hideError}>Mauvais format de fichier</p>:''}
			<LoadInput onChange={this._handleFile}>Importer un fichier</LoadInput>
		</div>
		)
	}	
})

export default FileLoader