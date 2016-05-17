import React from 'react'

const TextButton = ({ onClick, id, title }) => (
	<button id={id} onClick={onClick}>{title}</button>
)

export default TextButton