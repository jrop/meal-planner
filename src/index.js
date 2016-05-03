import injectTapEventPlugin from 'react-tap-event-plugin'
import FrameLayout from 'react-frame-layout'
import nedb from 'nedb-promise'
import React from 'react'
import ReactDOM from 'react-dom'

import AppBar from 'material-ui/AppBar'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { Tabs, Tab } from 'material-ui/Tabs'

import MealManager from './meal-manager'
import MealPlanner from './meal-planner'
import Padded from './padded'

const Main = () => <Tabs>
	<Tab label="Meals"><Padded><MealManager /></Padded></Tab>
	<Tab label="Planner"><Padded><MealPlanner /></Padded></Tab>
</Tabs>

class App extends FrameLayout {
	constructor(props) {
		super(props)
		this.state = { stack: [ <Main /> ] }
	}

	getChildContext() {
		const context = { mealStore: nedb({ filename: 'meals', autoload: true }) }
		return Object.assign(context, super.getChildContext())
	}

	render() {
		return <div>
			<AppBar
				title="Meal Planner"
				showMenuIconButton={false} />
			{this.top}
		</div>
	}
}
App.childContextTypes = Object.assign({
	mealStore: React.PropTypes.object,
}, App.childContextTypes)

window.addEventListener('load', function () {
	injectTapEventPlugin()
	ReactDOM.render(<MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
		<App />
	</MuiThemeProvider>, document.getElementById('react'))
})
