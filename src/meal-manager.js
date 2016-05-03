import { Frame } from 'react-frame-layout'
import React from 'react'

import { Card, CardActions, CardHeader } from 'material-ui/Card'
import ContentAdd from 'material-ui/svg-icons/content/add'
import FlatButton from 'material-ui/FlatButton'
import FloatingActionButton from 'material-ui/FloatingActionButton'

import MealEditor from './meal-editor'
import Padded from './padded'

import _ from 'lodash'

class Meal extends Frame {
	constructor(props) {
		super(props)
		this.state = { meal: props.meal }
	}

	async onRemoveClick() {
		if (!confirm('Are you sure?')) { return }
		await this.context.mealStore.remove({ _id: this.state.meal._id }, { })
		this.props.onReload()
	}

	async onEditClick() {
		this.push(<Padded><MealEditor meal={this.state.meal} /></Padded>)
	}

	render() {
		const meal = this.state.meal
		return <div style={{ margin: '15px 0' }}>
			<Card>
				<CardHeader title={meal.name} subtitle={`Season: ${_.capitalize(meal.season)}`} actAsExpander={true} />
				<CardActions expandable={true}>
					<FlatButton label="Remove" secondary={true} onClick={this.onRemoveClick.bind(this)} />
					<FlatButton label="Edit" primary={true} onClick={this.onEditClick.bind(this)} />
				</CardActions>
			</Card>
		</div>
	}
}
Meal.contextTypes = Object.assign({
	mealStore: React.PropTypes.object,
}, Meal.contextTypes)

export default class MealManager extends Frame {
	constructor(props) {
		super(props)
		this.state = { meals: [ ] }
	}

	componentDidMount() {
		this.loadData()
	}

	async loadData() {
		const meals = _.sortBy(await this.context.mealStore.find({}), 'name')
		this.setState({ meals })
	}

	async addNewMeal() {
		this.push(<Padded><MealEditor onReload={() => this.loadData()} /></Padded>)
	}

	render() {
		return <div>
			{this.state.meals ?
				this.state.meals.length > 0 ?
				this.state.meals.map(meal => <Meal onReload={() => this.loadData()} meal={meal} key={meal.name} parent={this} />) :
				<i>No meals</i>
			: <i>Loading...</i>}
			<div style={{ textAlign: 'right' }}>
				<FloatingActionButton
					style={{ /* position: 'fixed', bottom: 15, right: 15 */ }}
					onClick={this.addNewMeal.bind(this)}>
					<ContentAdd />
				</FloatingActionButton>
			</div>
		</div>
	}
}
MealManager.contextTypes = Object.assign({
	mealStore: React.PropTypes.object,
}, MealManager.contextTypes)
