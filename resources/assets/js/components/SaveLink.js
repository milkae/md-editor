import React, { PropTypes } from 'react'

const SaveLink = ({ url, title, children }) => (
	<a href={url} download={title}>{ children }</a>
)
SaveLink.propTypes = {
	url: PropTypes.string,
	title: PropTypes.string,
	children: PropTypes.node
}
export default SaveLink