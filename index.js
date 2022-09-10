const puppeteer = require('puppeteer');
const fs = require('fs');

const POS = 1
	, POS_CHANGE = 2
	, NUM = 3
	, NAME = 4
	, COMPETITOR_STATE = 5
	, BEST_LAP_TIME = 6
	, LAST_SECTOR_1 = 7
	, LAST_SECTOR_2 = 8
	, LAST_SECTOR_3 = 9
	, LAST_LAP_TIME_1 = 10
	, LAST_LAP_TIME_2 = 11
	, LAST_LAP_TIME_3 = 12
	, LAPS_COUNT = 13
	, DIFF = 14
	, GAP = 15
	, BEST_SECTOR_1 = 16
	, BEST_SECTOR_2 = 17
	, BEST_SECTOR_3 = 18
	, COMBINED_BEST_LAP = 19
	, TOTAL_BEST_LAP = 20
	, CAR_MODEL = 21
	, COMPETITOR_ID = 22
	, TOTAL_TIME = 23
	, CAR_GUID = 24
	, CAR_ID = 25
	, TEAM_NAME = 26
	, PITS_COUNT = 27
	, PIT_TIME = 28
	, SESSION_TIME = 29
	, PILOT_ID = 30
	, TEAM_ID = 31
	, AVG_LAP_TIME = 32
	, PENDING_PILOT_ID = 33
	, LAST_SECTOR_4 = 34
	, LAST_SECTOR_5 = 35
	, BEST_SECTOR_4 = 36
	, BEST_SECTOR_5 = 37
	, CURRENT_LAP_TIME = 44
	, LAST_FIXED_S1 = 45
	, LAST_FIXED_S2 = 46
	, LAST_FIXED_S3 = 47
	, LAST_FIXED_S4 = 48
	, LAST_FIXED_S5 = 49
	, TRANSPONDER_ID = 50
	, LAST_S1_ACTIVE = 51
	, LAST_S2_ACTIVE = 52
	, LAST_S3_ACTIVE = 53
	, LAST_S4_ACTIVE = 54
	, LAST_S5_ACTIVE = 55
	, RACER_ID = 56
	, RACE_TIME = 100
	, TIME_TO_GO = 101
	, TOTAL_LAPS = 102
	, LAPS_TO_GO = 103
	, RUN_NAME = 104
	, RACE_NAME = 105
	, FLAG_STATUS = 106
	, SORT_MODE = 107
	, FINISH_TYPE = 108
	, COMMENT_TIME = 109
	, COMMENT_TEXT = 110
	, RUN_QUEUE_GUID = 111
	, RUN_BEST_LAP_NAME = 200
	, RUN_BEST_LAP_TIME = 201
	, RUN_BEST_LAP_NUM = 202
	, RUN_BEST_LAP_CID = 203
	, RUN_BEST_SECTOR_1 = 204
	, RUN_BEST_SECTOR_2 = 205
	, RUN_BEST_SECTOR_3 = 206
	, RUN_BEST_SECTOR_4 = 207
	, RUN_BEST_SECTOR_5 = 208
	, RUN_BEST_SECTOR_1_CID = 209
	, RUN_BEST_SECTOR_2_CID = 210
	, RUN_BEST_SECTOR_3_CID = 211
	, RUN_BEST_LAP_PREV_CID = 212
	, RUN_BEST_SECTOR_4_CID = 213
	, RUN_BEST_SECTOR_5_CID = 214
	, PASSING_CID = 300
	, PASSING_LAP_TIME = 301
	, PASSING_PASS_TYPE = 302
	, PASSING_TOTAL_TIME = 303
	, PILOTS_LIST = 400
	, CMD_ACTION = 401
	, PILOTS_CHANGES = 402
	, OLD_PILOT_ID = 403
	, NEW_PILOT_ID = 404
	, CHANGE_TIME = 405
	, START_TIME = CHANGE_TIME
	, CHANGE_NUM = 406
	, TOTAL_SESSION_TIME = 407
	, INTERVAL_TIME = 408
	, SESSIONS_COUNT = 409
	, IS_PENDING_CHANGE = 410
	, START_LAP = 411
	, END_LAP = 412
	, END_TIME = 413
	, PITIN_LAP_ID = 414
	, PITOUT_LAP_ID = 415
	, TRACK_CONFIG = 500
	, TRACK_CONFIG_NAME = 501
	, LAP_FLAG_WARMUP = 1
	, LAP_FLAG_GREEN = 2
	, LAP_FLAG_YELLOW = 4
	, LAP_FLAG_RED = 8
	, LAP_FLAG_FINISH = 16
	, LAP_TYPE_BEST_LAP = 32
	, LAP_TYPE_BEST_S1 = 64
	, LAP_TYPE_BEST_S2 = 128
	, LAP_TYPE_BEST_S3 = 256
	, LAP_TYPE_BEST_S4 = 512
	, LAP_TYPE_TOTAL_BEST = 4096
	, LAP_TYPE_TOTAL_S1 = 8192
	, LAP_TYPE_TOTAL_S2 = 16384
	, LAP_TYPE_TOTAL_S3 = 32768
	, LAP_TYPE_TOTAL_S4 = 65536
	, LAP_TYPE_DELETED = 1048576
	, LAP_TYPE_REJECTED = 2097152
	, LAP_TYPE_PITIN = 4194304
	, LAP_TYPE_PITOUT = 8388608
	, FLAG_STATUS_FINISH = 3
	, FLAG_STATUS_RED = 2
	, FLAG_STATUS_WARMUP = 4;

// avg_session_lap: "29.734"
// best_lap_time: "29.518"
// current_lap_time: "4.810"
// diff: ""
// gap: ""
// kart_type: "карт"
// laps: "9"
// last_lap_time_1: "29.588"
// last_lap_time_2: "29.651"
// last_lap_time_3: "29.751"
// name: "Земсков Михаил 25.0"
// num: "11"
// pit_time: ""
// pits_count: ""
// pos: "1"
// session_time: "0:04:32"
// total_time: "0:04:28"

// 1: 1
// 2: 0
// 3: "11"
// 4: "Земсков Михаил 25.0"
// 5: 2
// 6: 29518
// 7: 0
// 8: 0
// 9: 0
// 10: 29588
// 11: 29651
// 12: 29751
// 13: 9
// 14: 0
// 15: 0
// 16: 0
// 17: 0
// 18: 0
// 19: 0
// 21: "карт"
// 23: 267613
// 25: 9
// 26: ""
// 27: 0
// 28: 0
// 29: 272423
// 30: 5
// 32: 29734
// 33: -1
// 34: 0
// 36: 0
// 44: 4810
// 50: 2550
// 56: -1

(async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	// await page.goto('http://localhost:3888/static/1.html', { waitUntil: 'load', timeout: 0 });
	// await page.goto('https://f1karting-m.kartchrono.com/online/?variant=iframe', { waitUntil: 'load', timeout: 0 });
	await page.goto('http://localhost:3888/static/1.html', { waitUntil: 'load', timeout: 0 });
	// await page.waitForTimeout(1);

	// console.log(111, datestamp);

	let stream = null;
	let closeTimer = null;
	let datestamp = null;
	let lastline = null;
	let streamName = null;

	// let resolve = null;
	// let exitPromise = new Promise((res, rej) => resolve = res);
	// let counter = 0;
	const promiseArray = [];
	const cancelInt = setInterval(async () => {
		let [data, isFinished, runName, raceName, isLimitedLaps, competitorsByPos] = await page.evaluate(() => {
			const targetArray = [];
			[].forEach.call(document.getElementsByClassName('dataRow'), (dr, i) => {
				targetArray[i] = {};
				[].forEach.call(dr.children, (ch) => targetArray[i][ch.id || 'name'] = ch.textContent.replace(/\n/g, '').trim().replace(/\s+/g, ' '))
			});

			const runNameElem = document.getElementById('run_name');
			const raceNameElem = document.getElementById('race_name');

			return [
				targetArray,
				runState[FLAG_STATUS] === FLAG_STATUS_FINISH,
				runNameElem && runNameElem.textContent,
				raceNameElem && raceNameElem.textContent,
				"finishByLaps" == runState[FINISH_TYPE],
				window.competitorsByPos,
			];
		});

		// if target array has one item with all fields empty => session is in await
		if (data.length === 1 && !Object.values(data[0]).some(Boolean)) {
			if (stream) {
				stream.write(']}');
				stream.close();
				console.log(`close stream ${streamName} (empty field)`);
				streamName = null;
				closeTimer = null;
				stream = null;
				datestamp = null;
			}
			return;
		}

		if (!stream && !isFinished) {
			const recordingDate = new Date();
			datestamp = [recordingDate.toDateString(), recordingDate.getHours(), recordingDate.getMinutes()].join('-');
			streamName = `${datestamp}-[${raceName}-${runName}].json`;
			stream = fs.createWriteStream(streamName);
			console.log(`open stream ${streamName}`);
			stream.write(`{
				"datestamp": "${datestamp}",
				"sessionName": "${runName}",
				"data": [
					`);

			lastline = null;
		}

		if (isFinished && !closeTimer) {
			closeTimer = (new Date()).getTime() + 2 * 60000;
		}

		if (closeTimer && !isFinished) {
			stream.write(']}');
			stream.close();
			console.log(`close stream ${streamName} (is finished become false)`);
			streamName = null;
			closeTimer = null;
			stream = null;
			datestamp = null;

			return;
		}

		data = dataMapper(competitorsByPos);

		const dataToWrite = lastline === null ? JSON.stringify(data) : ',' + JSON.stringify(data);

		if (!stream || lastline === dataToWrite) {
			return;
		}

		lastline = dataToWrite;

		const isLastEntry = isFinished && ((isLimitedLaps ? isLapsNumberEqual(data) : true) && (new Date()).getTime() > closeTimer);

		console.log(`write array to ${streamName}`, runName, raceName, data.length);
		stream.write(isLastEntry ? dataToWrite + ']}' : dataToWrite);

		if (isLastEntry) {
			stream.close();
			console.log(`close stream ${streamName} (last entry)`);
			streamName = null;
			closeTimer = null;
			stream = null;
			datestamp = null;
		}
	}, 2 * 1000)
	// }, 1)

	// await exitPromise;

	// await browser.close();
})();

function isLapsNumberEqual(competitorsArray) {
	let maxLaps = parseInt(competitorsArray[0].laps);

	return competitorsArray.every(c => parseInt(c.laps) === maxLaps || c.laps === '');
}

function dataMapper(dataByPos) {
	const values = Object.values(dataByPos);

	return values.map(val => ({
		avg_session_lap: formatLapTime(val[AVG_LAP_TIME]),
		best_lap_time: formatLapTime(val[BEST_LAP_TIME]),
		current_lap_time: formatLapTime(val[CURRENT_LAP_TIME]),
		diff: formatDiff(val[DIFF]),
		gap: formatDiff(val[GAP]),
		// kart_type: "карт",
		laps: val[LAPS_COUNT],
		last_lap_time_1: val[LAST_LAP_TIME_1],
		last_lap_time_2: val[LAST_LAP_TIME_2],
		last_lap_time_3:  val[LAST_LAP_TIME_3],
		name: val[NAME],
		num: val[NUM],
		pit_time: "",
		pits_count: "",
		pos: val[POS],
		session_time: formatLapTime(val[SESSION_TIME], 0, true),
		total_time: formatLapTime(val[TOTAL_TIME], 0, true),
	}));
}

function formatLapTime(e, t, a) {
    if (isNaN(e))
        return "";
    if (e <= 0)
        return "";
    null == t && (t = 3);
    let r = ""
      , s = ""
      , l = ""
      , i = 0
      , o = 0
      , n = 0;
    return (e = 1e3 * parseFloat(e / 1e3).toFixed(t)) >= 36e5 ? s = (i = Math.floor(e / 36e5)) + ":" : 1 == a && (s = "0:"),
    e >= 6e4 ? (l = (o = Math.floor(e % 36e5 / 6e4)) + ":",
    (i > 0 || a) && o < 10 && (l = "0" + l)) : 1 == a && (l = "00:"),
    n = e % 6e4 / 1e3,
    r = parseFloat(e % 6e4 / 1e3).toFixed(t) + "",
    (o > 0 || a) && n < 10 && (r = "0" + r),
    s + l + r
}
function formatDiff(e, t, a=1) {
    let r = "+";
    return t && (r = "-"),
    0 == e ? "" : e <= -1e5 ? r + -e / 1e5 + " сект." : e < 0 ? e <= -1e4 ? "" : r + -e + " lap" : r + formatLapTime(e, a)
}