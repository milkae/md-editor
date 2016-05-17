import React from 'react'

const TextLink = ({ onClick, id, title }) => (
	<li id={id} onClick={onClick}>{title}</li>
)

export default TextLink