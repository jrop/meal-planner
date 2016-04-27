import React from 'react'
import update from 'react-addons-update'

import FlatButton from 'material-ui/lib/flat-button'
import MenuItem from 'material-ui/lib/menus/menu-item'
import RaisedButton from 'material-ui/lib/raised-button'
import SelectField from 'material-ui/lib/select-field'
import TextField from 'material-ui/lib/text-field'

export default class MealEditor extends React.Component {
	constructor(props) {
		super(props)
		this.state = props.meal || {
			name: 'New Meal',
			ingredients: [ ],
			season: 'any',
		}
	}

	updateSeason(e, i, value) {
		const meal = this.state
		meal.season = value
		this.setState({ meal })
	}

	async saveMeal() {
		await this.props.meals.update({ _id: this.state._id || 'no-such-id' }, this.state, { upsert: true })
		this.props.parent.pop()
	}

	render() {
		return <div>
			<h2>Meal Editor</h2>

			<div><TextField ref="name" hintText="Name" floatingLabelText="Name" value={this.state.name} onChange={e => this.setState(update(this.state, {
				name: { $set: e.target.value },
			}))} /></div>

			{this.state.ingredients.map((ingredient, i) => <div key={i} style={{ padding: '15px 0' }}>
					<h3>Ingredient {i + 1}</h3>

					<div><TextField value={ingredient.name} hintText="Name" floatingLabelText="Name" onChange={e => this.setState(update(this.state, {
						ingredients: { $apply: arr => (arr[i].name = e.target.value, arr) },
					}))}/></div>

					<div><TextField value={ingredient.quantity} hintText="Quantity" floatingLabelText="Quantity" onChange={e => this.setState(update(this.state, {
						ingredients: { $apply: arr => (arr[i].quantity = e.target.value, arr) },
					}))} /></div>

					<div><RaisedButton label="Remove" onClick={() => this.setState(update(this.state, {
						ingredients: { $splice: [ [ i, 1 ] ] },
					}))} /></div>
				</div>)}
			{this.state.ingredients.length ? null : <div style={{ padding: '15px 0' }}><i>No ingredients</i></div>}

			<div><RaisedButton label="Add Ingredient" onClick={() => this.setState(update(this.state, {
				ingredients: { $push: [ { name: `Ingredient ${this.state.ingredients.length + 1}`, quantity: '' } ] },
			}))} /></div>

			<h3>Season</h3>
			<SelectField ref="season" value={this.state.season} onChange={(e, i, value) => this.setState(update(this.state, {
				season: { $set: value },
			}))}>
				<MenuItem value="any" primaryText="Any" />
				<MenuItem value="freezing" primaryText="Freezing" />
				<MenuItem value="cold" primaryText="Cold" />
				<MenuItem value="warm" primaryText="Warm" />
			</SelectField>

			<div style={{ textAlign: 'right' }}>
				<FlatButton label="Cancel" secondary={true} onClick={() => this.props.parent.pop()} />&nbsp;
				<FlatButton label="Save" primary={true} onClick={this.saveMeal.bind(this)} />
			</div>
		</div>
	}
}
