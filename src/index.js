import audioContext from 'audio-context';
import timestamp from 'unix-timestamp';
import getUserMedia from 'getusermedia';
import EventEmitter from 'wolfy87-eventemitter';

export const PULSE_EVENT = 'pulse';

export default class extends EventEmitter {
	constructor({
		bufferSize = 512,
		numberOfInputChannels = 1,
		numberOfOutputChannels = 1
	} = {}) {
		super();

		this.initAudioScriptProcessor( bufferSize, numberOfInputChannels, numberOfOutputChannels );
	}

	getUserMedia() {
		return new Promise((resolve, reject) => {
			getUserMedia({
				audio: true,
				video: false
			}, (err, stream) => {
				if (err) {
					reject("Can't get user media (getUserMedia)");
				}

				resolve(stream);
			});
		});
	}

	start({
		pulseThresholdRms = 0.1,
		minSecondsBetweenPulses = 0.2
	} = {}) {
		this.pulseThresholdRms = pulseThresholdRms;
		this.minSecondsBetweenPulses = minSecondsBetweenPulses;

		this.isFirstPulse = true;
		this.lastPulseTimestamp = 0;

		return new Promise((resolve, reject) => {
			this.getUserMedia().then((stream) => {
				const microphone = this.audioContext.createMediaStreamSource(stream);

				microphone.connect(this.audioScriptProcessor);

				this.audioScriptProcessor.connect(this.audioContext.destination);

				resolve(() => {
					microphone.disconnect();

					this.audioScriptProcessor.disconnect();
				});

			}).catch((reason) => reject(reason));
		});
	}

	initAudioScriptProcessor(bufferSize, numberOfInputChannels, numberOfOutputChannels) {
		this.audioContext = audioContext;

		this.audioScriptProcessor = this.audioContext.createScriptProcessor(
			bufferSize,
			numberOfInputChannels,
			numberOfOutputChannels
		);

		this.audioScriptProcessor.onaudioprocess = this.handleAudioProcess.bind(this);
	}

	handleAudioProcess(event) {
		let input = event.inputBuffer.getChannelData( 0 );
		
		let rms = this.getRms( input );
		
		if ( ! this.isPulse( rms ) ) {
			return;
		}

		if ( this.isFirstPulse ) {
			this.isFirstPulse = false;

			return;
		}

		let currentPulseTimestamp = timestamp.now();

		let secondsBetweenPulses = currentPulseTimestamp - this.lastPulseTimestamp;
		let rpm = this.calcRPM( secondsBetweenPulses );

		this.lastPulseTimestamp = currentPulseTimestamp;

		this.emit(PULSE_EVENT, {
			'timestamp': currentPulseTimestamp,
			'secondsBetweenPulses': secondsBetweenPulses,
			'rpm': rpm
		});
	}

	calcRPM(secondsBetweenPulses) {
		return Math.floor( 60 / secondsBetweenPulses )
	}

	getRms(inputBuffer) {
		let sum = 0.0;

		inputBuffer.forEach( (data) => {
			sum += data * data;
		} );

		return Math.sqrt( sum / inputBuffer.length );
	}

	isPulse(rms) {
		if ( rms < this.pulseThresholdRms ) {
			return false;
		}

		return timestamp.now() - this.lastPulseTimestamp > this.minSecondsBetweenPulses;
	}
}
