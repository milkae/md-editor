import React from 'react'
import TextLink from './TextLink'

const TextsList = ({ onTextClick, addDoc, texts }) => (
	<ul className="textsList">
		<button onClick={() => addDoc({ title: 'Document sans titre', content: '...'})}>Nouveau fichier</button>
		{texts.map(text =>
			<TextLink
			key={text.id}
			{...text}
			onClick={() => onTextClick(text.id)}
			/>	
		)}
	</ul>
)


export default TextsList