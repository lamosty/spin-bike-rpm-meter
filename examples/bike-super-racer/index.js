import RpmMeter, { PULSE_EVENT } from "spin-bike-rpm-meter";

let rpmMeter = new RpmMeter();

rpmMeter.start().then((stop) => {
	console.log(stop);

	rpmMeter.on(PULSE_EVENT, (params) => {
		console.log(params);

	});
});