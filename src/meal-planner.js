import { Frame } from 'react-frame-layout'
import React from 'react'

import _ from 'lodash'

export default class MealPlanner extends Frame {
	componentDidMount() {
		this.loadData()
	}

	async getForecasts() {
		const url = `https://query.yahooapis.com/v1/public/yql?q=${encodeURIComponent('select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="fort collins, co")')}&format=json`
		const result = await fetch(url).then(r => r.json())
		return result.query.results.channel.item.forecast
		// .map(forecast => {
		// 	const high = forecast.high
		// 	if (high < 45)
		// 		return 'freezing'
		// 	else if (high < 50)
		// 		return 'cold'
		// 	else
		// 		return 'warm'
		// })
	}

	async loadData() {
		console.log('loading data...')
		const [ meals, forecasts ] = await Promise.all([ this.context.mealStore.find({}), this.getForecasts() ])
		this.setState({ meals, forecasts })
		console.log(meals)
		console.log(forecasts)
	}

	pickMeal(/* high */) {
		return _.sample(this.state.meals).name
		// return `TODO: pickMeal(${high})`
	}

	render() {
		if (!this.state || !this.state.forecasts || !this.state.meals)
			return <div><i>Loading...</i></div>
		return <div>
			{this.state.forecasts.map((forecast, i) => <div key={i}>
				<h3 style={{ fontWeight: '400' }}>{forecast.day} - {forecast.high}&deg;<sup><small><small>F</small></small></sup></h3>
				<p>Weather: {forecast.text}</p>
				<p>Meal: {this.pickMeal(forecast.high)}</p>
			</div>)}
		</div>
	}
}
MealPlanner.contextTypes = Object.assign({
	mealStore: React.PropTypes.object,
}, MealPlanner.contextTypes)
