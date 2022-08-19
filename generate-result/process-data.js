function ProcessQualificationData(session) {
	const qualNum = session.Q;
	const res = {
		qualNum
	};

	session.data.forEach((d) => {
		if (d.length) {
			d.forEach((competitor) => {
				if (!competitor.laps) {
					return;
				}

				if (!res[competitor.num]) {
					res[competitor.num] = {
						position:  parseInt(competitor.pos),
						number: competitor.num,
						name: competitor.name,
						laps: [],
						bestLap: 0,
						diff: competitor.gap,
						avrg: competitor.avg_session_lap,
						positionSequence: [parseInt(competitor.pos)]
					};
				}

				const lapNum = parseInt(competitor.laps);
				res[competitor.num].position = parseInt(competitor.pos);
				res[competitor.num].laps[lapNum] = parseFloat(competitor.last_lap_time_1);
				res[competitor.num].best = parseFloat(competitor.best_lap_time);
				res[competitor.num].diff = competitor.gap;
				res[competitor.num].avrg = competitor.avg_session_lap;

				res[competitor.num].positionSequence[lapNum] = (parseInt(competitor.pos));

				if (res[competitor.num].best === res[competitor.num].laps[lapNum]
					&& res[competitor.num].best !== res[competitor.num].laps[res[competitor.num].bestLap]) {
					res[competitor.num].bestLap = lapNum;
				}
			});
		}
	});

	return res;
}

function prepareQualificationViewData(...sessionSets) {
	const result = [];
	sessionSets.forEach((sessionSet, index) => {
		const competitors = Object.values(sessionSet);

		competitors.forEach((competitor) => {
			if (!competitor.name) return;
			let finalResult = result.find((r) => r.name === competitor.name);

			if (finalResult) {
				finalResult.Q2 = competitor.best;
				finalResult.Q2L = competitor.bestLap;
				finalResult.Q2N = competitor.number;
				finalResult.sessions.push(index + 1);
				finalResult.sessions.join(', ');
				finalResult.total += competitor.best;

				return;
			}

			finalResult = {};

			finalResult.name = competitor.name;
			finalResult.Q1 = competitor.best;
			finalResult.Q1L = competitor.bestLap;
			finalResult.Q1N = competitor.number;
			finalResult.sessions = [index + 1];
			finalResult.total = competitor.best;

			result.push(finalResult);
		});

		result.sort((a, b) => {
			const res = a.total - b.total;

			if (res === 0) {
				const q1Diff = a.Q1 - b.Q1;

				if (q1Diff === 0) {
					return a.Q2 - b.Q2
				}

				return q1Diff;
			}

			return res;
		});
	});

	let bestQ1Index = null;
	let bestQ1Value = null;

	let bestQ2Index = null;
	let bestQ2Value = null;

	result.forEach((res, index) => {
		res.position = index + 1;

		if (!bestQ1Value || res.Q1 < bestQ1Value) {
			bestQ1Index = index;
			bestQ1Value = res.Q1;
		}

		if (!bestQ2Value || res.Q2 < bestQ2Value) {
			bestQ2Index = index;
			bestQ2Value = res.Q2;
		}

		res.gap = ['+', (res.total - result[0].total).toFixed(3)].join('');
		res.Q1 = res.Q1.toFixed(3);
		res.Q2 = res.Q2.toFixed(3);
		res.total = res.total.toFixed(3);
	});

	result[bestQ1Index].hasQ1Best = true;
	result[bestQ2Index].hasQ2Best = true;

	return result;
}


function prepareRaceData(date, final) {
	let competitors = {};
	const res = [];

	if (final === 'c') {
		competitors = ProcessQualificationData(require('./data/20220818/finalC.json'));
	} else if (final === 'b') {
		competitors = ProcessQualificationData(require('./data/20220818/finalB.json'));
	} else if (final === 'a') {
		competitors = ProcessQualificationData(require('./data/20220818/finalA.json'));
	}

	Object.values(competitors).forEach((competitor) => {
		if (!competitor) return;
		res.push({
			position: competitor.position,
			name: competitor.name,
			number: competitor.number,
			best: parseFloat(competitor.best),
			bestLap: competitor.bestLap,
			gap: competitor.diff,
			avrg: competitor.avrg,
		});
	});

	res.sort((a, b) => a.position - b.position);

	let bestLapValue = null;
	let bestLapIndex = null;

	res.forEach((r, i) => {
		if (!bestLapValue || bestLapValue > r.best) {
			bestLapValue = r.best;
			bestLapIndex = i;
		}
	});

	res[bestLapIndex].hasBest = true;

	return res;
}

const colors = [
	'rgb(255,0,0)',
	'rgb(0,255,0)',
	'rgb(0,0,255)',
	'rgb(0,0,255)',
	'rgb(255,255,0)',
	'rgb(0,255,255)',
	'rgb(255,0,255)',
	'rgb(128,0,0)',
	'rgb(128,128,0)',
	'rgb(0,128,0)',
	'rgb(128,0,128)',
	'rgb(0,128,128)',
];

function getGraphData(date, final) {
	let competitors = {};
	const res = [];

	if (final === 'c') {
		competitors = ProcessQualificationData(require('./data/20220818/finalC.json'));
	} else if (final === 'b') {
		competitors = ProcessQualificationData(require('./data/20220818/finalB.json'));
	} else if (final === 'a') {
		competitors = ProcessQualificationData(require('./data/20220818/finalA.json'));
	}

	// Red	#FF0000	(255,0,0)
 	// Lime	#00FF00	(0,255,0)
 	// Blue	#0000FF	(0,0,255)
 	// Yellow	#FFFF00	(255,255,0)
 	// Cyan / Aqua	#00FFFF	(0,255,255)
 	// Magenta / Fuchsia	#FF00FF	(255,0,255)
 	// Silver	#C0C0C0	(192,192,192)
 	// Gray	#808080	(128,128,128)
 	// Maroon	#800000	(128,0,0)
 	// Olive	#808000	(128,128,0)
 	// Green	#008000	(0,128,0)
 	// Purple	#800080	(128,0,128)

	Object.values(competitors).forEach((competitor, index) => {
		if (!competitor) return;
		const avgLap = parseFloat(competitor.avrg);
		const pitLapsIndexes = competitor.laps.filter((l) => parseFloat(l) / avgLap > 1.05);

		console.log(competitor.positionSequence.join());
		res.push({
			position: competitor.position,
			label: competitor.name,
			data: competitor.positionSequence,
			backgroundColor: colors[index],
			borderColor: colors[index],
			pointBackgroundColor: competitor.positionSequence.map((d, i) => ~pitLapsIndexes.indexOf(i) ? 'rgb(0,0,0)' :  colors[index])
		});
	});

	// {
	// 	label: 'My First dataset',
	// 	backgroundColor: 'rgb(255, 99, 132)',
	// 	borderColor: 'rgb(255, 99, 132)',
	// 	data: [0, 10, 5, 2, 20, 30, 45],
	// }

	return res;
}

module.exports = {
	getQualificationViewData(date) {
		const res1 = ProcessQualificationData(require('./data/20220818/Q1.json'));
		const res2 = ProcessQualificationData(require('./data/20220818/Q2.json'));
		const res3 = ProcessQualificationData(require('./data/20220818/Q3.json'));
		const res4 = ProcessQualificationData(require('./data/20220818/Q4.json'));
		const res5 = ProcessQualificationData(require('./data/20220818/Q5.json'));
		const res6 = ProcessQualificationData(require('./data/20220818/Q6.json'));

		return prepareQualificationViewData(res1, res2, res3, res4, res5, res6);
	},
	getRaceViewData(date, final) {
		return prepareRaceData(date, final);
	},
	getGraphData
}

// {
// 	"pos": "4",
// 	"num": "12",
// 	"kart_type": "карт",
// 	"name": "Гуринович Василий 7.5",
// 	"best_lap_time": "29.236",
// 	"session_time": "0:02:16",
// 	"laps": "4",
// 	"last_lap_time_1": "30.753",
// 	"last_lap_time_2": "29.236",
// 	"last_lap_time_3": "30.927",
// 	"current_lap_time": "3.079",
// 	"avg_session_lap": "30.134",
// 	"diff": "+0.5",
// 	"total_time": "0:02:13",
// 	"gap": "+0.1",
// 	"pits_count": "",
// 	"pit_time": ""
// },

// {
// 	"pos": "1",
// 	"num": "11",
// 	"kart_type": "карт",
// 	"name": "Земсков Михаил 25.0",
// 	"best_lap_time": "",
// 	"session_time": "",
// 	"laps": "",
// 	"last_lap_time_1": "",
// 	"last_lap_time_2": "",
// 	"last_lap_time_3": "",
// 	"current_lap_time": "",
// 	"avg_session_lap": "",
// 	"diff": "",
// 	"total_time": "",
// 	"gap": "",
// 	"pits_count": "",
// 	"pit_time": ""
// },