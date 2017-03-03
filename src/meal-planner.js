import moment from 'moment'
import random from 'random-js'
import React from 'react'

import _ from 'lodash'

export default class MealPlanner extends React.Component {
	componentDidMount() {
		this.loadData()
	}

	async getForecasts() {
		const url = `https://query.yahooapis.com/v1/public/yql?q=${encodeURIComponent('select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="fort collins, co")')}&format=json`
		const result = await fetch(url).then(r => r.json())
		return result.query.results.channel.item.forecast
	}

	async loadData() {
		const [meals, forecasts] = await Promise.all([this.context.mealStore.find({}), this.getForecasts()])
		this.setState({meals, forecasts})
	}

	setSelected(selected) {
		if (selected)
			this.loadData()
	}

	classifyTempurature(high) {
		const freezing = high < 45
		const cold = high >= 45 && high < 50
		const warm = high >= 50
		return {
			freezing,
			cold,
			warm,

			toString() {
				return _.chain(this)
					.pickBy(value => value === true)
					.keys()
					.first()
					.value()
			},
		}
	}

	pickMeal(high, rand) {
		if (!this.state.meals || !this.state.meals.length)
			return '(none)'

		const classification = this.classifyTempurature(high).toString()
		const eligibleMeals = _.chain(this.state.meals)
			.filter(meal => meal.season[classification] === true)
			.value()
		if (eligibleMeals.length)
			return random.pick(rand, eligibleMeals).name
		else
			return '(none)'
	}

	render() {
		const randomGenerator = random.engines.mt19937()
		const weekOfYear = moment().format('W')
		randomGenerator.seed(weekOfYear)
		if (!this.state || !this.state.forecasts || !this.state.meals)
			return <div><i>Loading...</i></div>
		return <div>
			{this.state.forecasts.map((forecast, i) => <div key={i}>
				<h3 style={{fontWeight: '400'}}>{forecast.day} - {forecast.high}&deg;<sup><small><small>F</small></small></sup></h3>
				<p>Weather: {forecast.text} ({this.classifyTempurature(forecast.high).toString()})</p>
				<p>Meal: {this.pickMeal(forecast.high, randomGenerator)}</p>
			</div>)}
		</div>
	}
}
MealPlanner.contextTypes = Object.assign({
	mealStore: React.PropTypes.object,
}, MealPlanner.contextTypes)
