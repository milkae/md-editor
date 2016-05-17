import React from 'react'

const LoadInput = ({ children, onChange }) => (
	<div>	
		<p>{children}</p>
		<input type="file" accept="text/*, .md" onChange={onChange} />
	</div>
);

export default LoadInput