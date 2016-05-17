import React from 'react'

const LoadInput = ({ onChange }) => (
	<input type="file" accept="text/*, .md" onChange={onChange} />
);

export default LoadInput