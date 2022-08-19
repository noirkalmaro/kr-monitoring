const express = require('express');
const { engine } = require('express-handlebars');

const app = express();

app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', './views');

app.use(express.static('./assets'));

app.get('/', (req, res) => {
	res.render('main', { raceName: 'Hello mfc' });
});

app.get('/qualification', (req, res) => {
	const {getQualificationViewData} = require('./process-data');
	res.render('main', {
		layout: 'qualification',
		raceName: 'SWS SPRINT RACE 137',
		sessionName: 'Qualification',
		data: getQualificationViewData(1)
	});
});

app.get('/raceA', (req, res) => {
	const {getRaceViewData, getGraphData } = require('./process-data');
	res.render('main', {
		layout: 'race',
		raceName: 'SWS SPRINT RACE 137',
		sessionName: 'Race Final A',
		data: getRaceViewData(1, 'a'),
		dataset: JSON.stringify(getGraphData(1, 'a'))
	});
});

app.get('/raceB', (req, res) => {
	const {getRaceViewData, getGraphData } = require('./process-data');
	res.render('main', {
		layout: 'race',
		raceName: 'SWS SPRINT RACE 137',
		sessionName: 'Race Final B',
		data: getRaceViewData(1, 'b'),
		dataset: JSON.stringify(getGraphData(1, 'b'))
	});
});

app.get('/raceC', (req, res) => {
	const {getRaceViewData, getGraphData } = require('./process-data');
	res.render('main', {
		layout: 'race',
		raceName: 'SWS SPRINT RACE 137',
		sessionName: 'Race Final C',
		data: getRaceViewData(1, 'c'),
		dataset: JSON.stringify(getGraphData(1, 'c'))
	});
});

app.listen(3000);