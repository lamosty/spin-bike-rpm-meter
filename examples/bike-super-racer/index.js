import RpmMeter, { PULSE_EVENT } from "spin-bike-rpm-meter";

const rpmMeter = new RpmMeter();

// Start listening to the "pulses". Asks for permission to the microphone. Run start() before
// starting to cycle on the spin bike.
rpmMeter.start().then((stop) => {
	console.log('Starting listening to pulses...');

	// After each revolution on the bike, a PULSE_EVENT is emitted containing some useful data about it.
	rpmMeter.on(PULSE_EVENT, (pulseData) => {
		console.log(pulseData);

		// This is how the pulseData might look
		//pulseData = {
		//	'timestamp': 1454060831,
		//	'secondsBetweenPulses': 0.8,
		//	'rpm': 75
		//};

	});

	// Stop listening to the "pulses" after 10 seconds.
	setTimeout(() => {
		stop();
		
		console.log('Stopped listening to pulses...');
	}, 10000);
});