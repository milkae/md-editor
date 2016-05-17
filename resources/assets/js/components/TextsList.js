import React from 'react'
import TextButton from './TextButton'

const TextsList = ({ onTextBtnClick, addDoc, texts }) => (
	<div>
		{texts.map(text =>
			<TextButton
			key={text.id}
			{...text}
			onClick={() => onTextBtnClick(text.id)}
			/>	
		)}
		<button onClick={() => addDoc({ title: 'Document sans titre', content: '...'})}>+</button>
	</div>
)


export default TextsList