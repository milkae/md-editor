import React from 'react'
import SaveLink from '../components/SaveLink'

const createUrl = (content) => {
	let file = new Blob([content], {type: 'text/markdown'});
	return URL.createObjectURL(file);
}

const FileDownloader = ({ actual }) => (
	<SaveLink url={createUrl(actual.content)} title ={actual.title + '.md'}>Télécharger le document</SaveLink>
)

export default FileDownloader
