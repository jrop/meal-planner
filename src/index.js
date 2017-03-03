import injectTapEventPlugin from 'react-tap-event-plugin'
import nedb from 'nedb-promise'
import React from 'react'
import ReactDOM from 'react-dom'
import {Stack} from 'react-activity-stack'

import AppBar from 'material-ui/AppBar'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import {Tabs, Tab} from 'material-ui/Tabs'

import MealManager from './meal-manager'
import MealPlanner from './meal-planner'
import Padded from './padded'

class Main extends React.Component {
	onTabChange(value) {
		this.refs.mealManager.setSelected(value == 'manager')
		this.refs.mealPlanner.setSelected(value == 'planner')
	}

	render() {
		return <div>
			<AppBar
				title="Meal Planner"
				showMenuIconButton={false} />
			<Tabs ref="tabs" onChange={this.onTabChange.bind(this)}>
				<Tab label="Meals" value="manager"><Padded><MealManager ref="mealManager"/></Padded></Tab>
				<Tab label="Planner" value="planner"><Padded><MealPlanner ref="mealPlanner" /></Padded></Tab>
			</Tabs>
		</div>
	}
}

class App extends React.Component {
	getChildContext() {
		return {mealStore: nedb({filename: 'meals', autoload: true})}
	}

	render() {
		return <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
			<Stack>
				<Main />
			</Stack>
		</MuiThemeProvider>
	}
}
App.childContextTypes = {mealStore: React.PropTypes.object}

window.addEventListener('load', function () {
	injectTapEventPlugin()
	ReactDOM.render(<App />, document.getElementById('react'))
})
