import React, { PropTypes } from 'react'

const View = ({content}) => (
	<div className="view" dangerouslySetInnerHTML={{ __html: marked(content, {sanitize: true}) }}></div>
)
View.PropTypes = {
	content : PropTypes.string
}
export default View