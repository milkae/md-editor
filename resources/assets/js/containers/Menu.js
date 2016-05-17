import React from 'react'
import FileDownloader from './FileDownloader'
import FileLoader from './FileLoader'
import TextsList from '../components/TextsList'

const Menu = ({ actual, storeFile, texts, addDoc, onTextClick }) => (
	<div className="menu">
		<FileDownloader actual={actual}/>
		<TextsList texts={texts} addDoc={addDoc} onTextClick={onTextClick}/>
		<FileLoader storeFile={storeFile}/>
	</div>
)

export default Menu