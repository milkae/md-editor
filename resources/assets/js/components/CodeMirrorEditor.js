const React = require('react');
const CodeMirror = require('codemirror');
require('codemirror/mode/markdown/markdown');

const CodeMirrorEditor = React.createClass({
	componentDidMount() {
	    this.cm = CodeMirror(this._myAwesomeInput, {
	      value: this.props.value,
	      mode: 'markdown',
	      theme: 'monokai',
	      lineNumbers: true,
	      styleActiveLine: true
	    });
	    
	    this.cm.on('change', (cm) => {
	      this.props.onChange(cm.getValue());
	    });
	  },
	  componentWillReceiveProps(nextProps) {
	    if (nextProps.value !== this.cm.getValue()) {
			this.cm.setValue(nextProps.value);
	    }
	  },
	  render() {
	    return <div ref={(ref)=>{this._myAwesomeInput = ref}}/>
	  }
});

export default CodeMirrorEditor
