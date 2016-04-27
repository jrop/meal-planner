import React from 'react'
import ReactDOM from 'react-dom'

import Dialog from 'material-ui/lib/dialog'
import FlatButton from 'material-ui/lib/flat-button'

class PromisifiedDialog extends React.Component {
	cleanup() {
		ReactDOM.unmountComponentAtNode(this.props.htmlNode)
		document.body.removeChild(this.props.htmlNode)
	}

	onCancelClick() {
		this.props.deferred.reject()
		this.cleanup()
	}

	onDoneClick() {
		this.props.deferred.resolve(this.refs.contents)
		this.cleanup()
	}

	render() {
		return <Dialog
			bodyStyle={{ overflowY: 'auto' }}
			title={this.props.title}
			open={true}
			modal={true}
			actions={[
				<FlatButton label="Cancel" secondary={true} onClick={this.onCancelClick.bind(this)}/>,
				<FlatButton label="Done" primary={true} onClick={this.onDoneClick.bind(this)} />,
			]}>
			{React.cloneElement(this.props.contents, { ref: 'contents' })}
		</Dialog>
	}
}

export default function showDialogForResult(title, contents) {
	const div = document.createElement('div')
	document.body.appendChild(div)

	//
	// Now asynchronously show the dialog and wait for it to close:
	//
	const defer = { }
	defer.promise = new Promise((yes, no) => (defer.resolve = yes, defer.reject = no))
	ReactDOM.render(<PromisifiedDialog title={title} deferred={defer} htmlNode={div} contents={contents} />, div)
	return defer.promise.catch(() => undefined)
}
