import injectTapEventPlugin from 'react-tap-event-plugin'
import nedb from 'nedb-promise'
import React from 'react'
import ReactDOM from 'react-dom'

import AppBar from 'material-ui/lib/app-bar'

import Card from 'material-ui/lib/card/card'
import CardActions from 'material-ui/lib/card/card-actions'
import CardHeader from 'material-ui/lib/card/card-header'
import CardText from 'material-ui/lib/card/card-text'
import ContentAdd from 'material-ui/lib/svg-icons/content/add'
import FlatButton from 'material-ui/lib/flat-button'
import FloatingActionButton from 'material-ui/lib/floating-action-button'
import MenuItem from 'material-ui/lib/menus/menu-item'
import RaisedButton from 'material-ui/lib/raised-button'
import SelectField from 'material-ui/lib/select-field'
import Tabs from 'material-ui/lib/tabs/tabs'
import Tab from 'material-ui/lib/tabs/tab'
import TextField from 'material-ui/lib/text-field'

import showDialogForResult from './dialog'

import _ from 'lodash'

const MEALS = nedb({ filename: 'meals', autoload: true })
const Padded = (props) => <div style={{ margin: '15px' }}>{props.children}</div>

class Meal extends React.Component {
	constructor(props) {
		super(props)
		this.state = { meal: props.meal }
	}

	async onRemoveClick() {
		if (!confirm('Are you sure?')) { return }
		await MEALS.remove({ _id: this.state.meal._id }, { })
		this.props.parent.loadData()
	}

	async onEditClick() {
		const component = await showDialogForResult('Edit Meal', <MealEditor meal={this.state.meal} />)
		if (!component) return
		
		const meal = component.state.meal
		await MEALS.update({ _id: meal._id }, meal, { })
		this.setState({ meal })
		this.props.parent.loadData()
	}

	render() {
		const meal = this.state.meal
		return <div style={{ margin: '15px 0' }}>
			<Card>
				<CardHeader title={meal.name} subtitle={meal.name} actAsExpander={true} />
				<CardText expandable={true}>
					{meal.ingredients.length ? <ul>
						{meal.ingredients.map((ingredient, i) => <li key={i}>{ingredient.quantity ? `${ingredient.quantity} - `: null}{ingredient.name}</li>)}
					</ul> : <i>No ingredients</i>}

					<div>Season: {_.capitalize(meal.season)}</div>
				</CardText>
				<CardActions expandable={true}>
					<FlatButton label="Remove" secondary={true} onClick={this.onRemoveClick.bind(this)} />
					<FlatButton label="Edit" primary={true} onClick={this.onEditClick.bind(this)} />
				</CardActions>
			</Card>
		</div>
	}
}

class MealEditor extends React.Component {
	constructor(props) {
		super(props)
		this.state = { meal: props.meal || {
			name: 'New Meal',
			ingredients: [ ],
			season: 'any',
		} }
	}

	addIngredient() {
		const meal = this.state.meal
		meal.ingredients.push({ name: `Ingredient ${meal.ingredients.length + 1}`, quantity: '' })
		this.setState({ meal })
	}

	removeIngredient(i) {
		const meal = this.state.meal
		meal.ingredients.splice(i, 1)
		this.setState({ meal })
	}

	updateName() {
		const meal = this.state.meal
		meal.name = this.refs.name.getValue()
		this.setState({ meal })
	}

	updateIngredientName(i) {
		const meal = this.state.meal
		meal.ingredients[i].name = this.refs[`ingredientName${i}`].getValue()
		this.setState({ meal })
	}

	updateIngredientQuantity(i) {
		const meal = this.state.meal
		meal.ingredients[i].quantity = this.refs[`ingredientQuantity${i}`].getValue()
		this.setState({ meal })
	}

	updateSeason(e, i, value) {
		const meal = this.state.meal
		meal.season = value
		this.setState({ meal })
	}

	render() {
		return <div>
			<div><TextField ref="name" hintText="Name" floatingLabelText="Name" value={this.state.meal.name} onChange={this.updateName.bind(this)} /></div>
			
			<ul>
				{this.state.meal.ingredients.map((ingredient, i) => <li key={i}>
					<TextField ref={`ingredientName${i}`} value={ingredient.name} hintText="Name" floatingLabelText="Name" onChange={this.updateIngredientName.bind(this, i)}/>
					<TextField ref={`ingredientQuantity${i}`} value={ingredient.quantity} hintText="Quantity" floatingLabelText="Quantity" onChange={this.updateIngredientQuantity.bind(this, i)} />
					<FlatButton label="Remove" onClick={this.removeIngredient.bind(this, i)} />
				</li>)}
				{this.state.meal.ingredients.length ? null : <li><i>No ingredients</i></li>}
			</ul>

			<div><RaisedButton label="Add Ingredient" onClick={this.addIngredient.bind(this)} /></div>

			<h3>Season</h3>
			<SelectField ref="season" value={this.state.meal.season} onChange={this.updateSeason.bind(this)}>
				<MenuItem value="any" primaryText="Any" />
				<MenuItem value="freezing" primaryText="Freezing" />
				<MenuItem value="cold" primaryText="Cold" />
				<MenuItem value="warm" primaryText="Warm" />
			</SelectField>
		</div>
	}
}

class MealManager extends React.Component {
	constructor(props) {
		super(props)
		this.state = { meals: [ ] }
		this.loadData()
	}

	async loadData() {
		const meals = _.sortBy(await MEALS.find({}), 'name')
		this.setState({ meals })
	}

	async addNewMeal() {
		const component = await showDialogForResult('New Meal', <MealEditor />)
		if (!component) return
		
		const meal = component.state.meal
		await MEALS.update({ _id: meal._id }, meal, { upsert: true })
		let meals = this.state.meals
		meals.push(meal)
		meals = _.sortBy(meals, 'name')
		this.setState({ meals })
	}

	render() {
		console.log(this.state.meals)
		return <div>
			{this.state.meals ?
				this.state.meals.length > 0 ?
				this.state.meals.map(meal => <Meal meal={meal} key={meal.name} parent={this} />) :
				<i>No meals</i>
			: <i>Loading...</i>}
			<FloatingActionButton
				style={{ position: 'fixed', bottom: 15, right: 15 }}
				onClick={this.addNewMeal.bind(this)}>
				<ContentAdd />
			</FloatingActionButton>
		</div>
	}
}

class App extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return <div>
			<AppBar
				title="Meal Planner"
				showMenuIconButton={false} />

			<Tabs>
				<Tab label="Meals"><Padded><MealManager /></Padded></Tab>
				<Tab label="Planner"><Padded>TODO</Padded></Tab>
			</Tabs>
		</div>
	}
}

window.addEventListener('load', function () {
	injectTapEventPlugin()
	const store = nedb({ filename: 'meals', autoload: true })
	window.store = store
	ReactDOM.render(<App />, document.getElementById('react'))
})
