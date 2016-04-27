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
import Tabs from 'material-ui/lib/tabs/tabs'
import Tab from 'material-ui/lib/tabs/tab'

import MealEditor from './meal-editor'

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
		const app = this.props.parent.props.parent
		app.push(<Padded><MealEditor parent={app} meal={this.state.meal} meals={MEALS} /></Padded>)
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
		this.props.parent.push(<Padded><MealEditor parent={this.props.parent} meals={MEALS} /></Padded>)
	}

	render() {
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

const Main = (props) => <Tabs>
	<Tab label="Meals"><Padded><MealManager parent={props.parent} /></Padded></Tab>
	<Tab label="Planner"><Padded>TODO</Padded></Tab>
</Tabs>

class App extends React.Component {
	constructor(props) {
		super(props)
		this.state = { stack: [ <Main parent={this} /> ] }
	}

	push(screen) {
		const stack = this.state.stack
		stack.push(screen)
		this.setState({ stack })
	}

	pop() {
		const stack = this.state.stack
		stack.splice(stack.length - 1, 1)
		this.setState({ stack })
	}

	render() {
		return <div>
			<AppBar
				title="Meal Planner"
				showMenuIconButton={false} />
			{this.state.stack[this.state.stack.length - 1]}
		</div>
	}
}

window.addEventListener('load', function () {
	injectTapEventPlugin()
	ReactDOM.render(<App />, document.getElementById('react'))
})
