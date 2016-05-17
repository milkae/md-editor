import React, { PropTypes } from 'react'

const View = ({content}) => (
	<div>
	<h2>Aperçu</h2>
	<div dangerouslySetInnerHTML={{ __html: marked(content, {sanitize: true}) }}></div>
	</div>
)
View.PropTypes = {
	content : PropTypes.string
}
export default View