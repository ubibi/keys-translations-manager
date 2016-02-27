import '../app.less'
import React from 'react'
import Reflux from 'reflux'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Grid from 'react-bootstrap/lib/Grid'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'
import InputPanel from './InputPanel'
import DisplayPanel from './DisplayPanel'
import CountActions from '../actions/CountActions'
import CountStore from '../stores/CountStore'
import ErrorStore from '../stores/ErrorStore'
import RecordStore from '../stores/RecordStore'
import TranslationActions from '../actions/TranslationActions'
import TranslationStore from '../stores/TranslationStore'
import config from '../../config'

const App = React.createClass({
	mixins: [
		PureRenderMixin,
		Reflux.listenTo(CountStore, "onCountChange"),
		Reflux.listenTo(ErrorStore, "onErrorChange"),
		Reflux.listenTo(RecordStore, "onSelectedRecordChange"),
		Reflux.listenTo(TranslationStore, "onTranslationsChange")
	],

	getInitialState() {
		let projectMapping = {};
		config.projects.map(function(e){
			projectMapping[e.id] = e.name;
		});
		return {
			config: config,
			count: {},
			error: null,
			projectMapping: projectMapping,
			selectedRecord: null,
			translations: []
		}
	},

	componentDidMount() {
		TranslationActions.loadTranslations();
	},

	onCountChange(count) {
		this.setState({
			count: count
		});
	},

	onErrorChange(error) {
		this.setState({
			error: error
		});
	},

	onSelectedRecordChange(selectedRecord) {
		this.setState({
			selectedRecord: selectedRecord
		});
	},

	onTranslationsChange(translations) {
		this.setState({
			error: null,
			translations: translations
		}, function() {
			CountActions.countByProject();
		});
	},

	render() {
		return(
			<Grid className="app-grid">
				<Row className="app-row">
					<Col xs={12} md={2} className="app-col-left">
						<InputPanel {...this.state} />
					</Col>
					<Col xs={12} md={10}>
						<DisplayPanel {...this.state} />
					</Col>
				</Row>
			</Grid>
		);
	}
})

module.exports = App