# Spin bike RPM meter

What is this? Well, it's a simple browser library that listens to your spin bike (exercise/stationary bike) cadence meter
for those "pulses" and emits data such as RPM, seconds between pulses and last pulse timestamp. Combined with the wheel diameter,
you can compute speed, distance, average speed, etc. of your spin bike, right in the browser!

## Really, what?

I have an old spin bike with broken monitoring display. After buying a standing desk, I thought about putting the spin bike
under the desk and work/read/watch videos during exercising. But with broken monitoring display, I have no data about my
cycling!

I discovered that the cable going from the bike to the monitoring device ends in 3.5mm jack. Turns out it's a standard for
the cadence/RPM sensors. Why not put it into the microphone slot of my PC? Turns out the sensor is making a "pulsing" sound
every time I make a full revolution on the bike pedals.

Long story short, this RPM meter library basically accesses your microphone through browser (Chrome, Firefox, etc.), listens
for the "pulses" from the stationary bike and emits an event each time it detects one. As stationary bikes have no gears
(on my bike, you can change only the load, not gear), you can measure the wheel size (the distance the bike "travels" during
one revolution of the pedals) and calculate many interesting things from it.

This library does not come with the speed/distance/etc computation because I wanted it as small as possible. I'm doing another
project for that.

## Installation

To install a stable version:

```
npm install spin-bike-rpm-meter --save
```

This assumes that you are using npm package manager with Webpack or any other CommonJS modern module bundler. If not,
download this repository and use the `spin-bike-rpm-meter.min.js` from the dist/ folder. It exports a global object 
`SpinBikeRpmMeter` which can be used similarly to how the library is used in the example below.

## Example usage

See [examples/bike-super-racer/index.js](examples/bike-super-racer/index.js). We initialize the `RpmMeter` object. To start
listening to the microphone ("pulses"), we call the `start()` method, which returns a Promise with the first argument
being the function to stop listening to "pulses". `RpmMeter` emits a `PULSE_EVENT` on each bike pedals revolution with the
first argument being some useful data about the revolution.

```js
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
```

## Change Log

See GitHub [Releases](https://github.com/lamosty/spin-bike-rpm-meter/releases) page for documentation of each change.

## Big picture

RPM meter is not very useful on its own. My plan is to create an open source UI for spin bikes (in React, Redux and other
front-end goodiess) with a simple API. This library is only the "driver" for the bigger project, delivering the information
about pedalling.
