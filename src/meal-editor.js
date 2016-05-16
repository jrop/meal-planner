import { Frame } from 'react-frame-layout'
import React from 'react'
import update from 'react-addons-update'

import Checkbox from 'material-ui/Checkbox'
import FlatButton from 'material-ui/FlatButton'
import MenuItem from 'material-ui/MenuItem'
import SelectField from 'material-ui/SelectField'
import TextField from 'material-ui/TextField'

export default class MealEditor extends Frame {
	constructor(props) {
		super(props)
		this.state = props.meal || {
			name: 'New Meal',
			season: {
				freezing: true,
				cold: true,
				warm: true,
			},
		}
	}

	updateSeason(e, i, value) {
		const meal = this.state
		meal.season = value
		this.setState({ meal })
	}

	async saveMeal() {
		await this.context.mealStore.update({ _id: this.state._id || 'no-such-id' }, this.state, { upsert: true })
		this.pop()
	}

	render() {
		return <div>
			<h2>{this.state.name || '(untitled)'}</h2>

			<div><TextField ref="name" hintText="Name" floatingLabelText="Name" value={this.state.name} onChange={e => this.setState(update(this.state, {
				name: { $set: e.target.value },
			}))} /></div>

			<h3>Season</h3>
			<div><Checkbox label="Freezing" checked={this.state.season.freezing} onCheck={(e, checked) => this.setState(update(this.state, {
				season: { freezing: { $set: checked } },
			}))} /></div>
			<div><Checkbox label="Cold" checked={this.state.season.cold} onCheck={(e, checked) => this.setState(update(this.state, {
				season: { cold: { $set: checked } },
			}))} /></div>
			<div><Checkbox label="Warm" checked={this.state.season.warm} onCheck={(e, checked) => this.setState(update(this.state, {
				season: { warm: { $set: checked } },
			}))} /></div>

			<div style={{ textAlign: 'right' }}>
				<FlatButton label="Cancel" secondary={true} onClick={() => this.pop()} />&nbsp;
				<FlatButton label="Save" primary={true} onClick={this.saveMeal.bind(this)} />
			</div>
		</div>
	}
}
MealEditor.contextTypes = Object.assign({
	mealStore: React.PropTypes.object,
}, MealEditor.contextTypes)
