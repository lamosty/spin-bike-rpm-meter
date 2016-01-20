import * as audioContext from 'audio-context';
import * as timestamp from 'unix-timestamp';
import * as getUserMedia from 'getusermedia';


export default class {
	construct({
		bufferSize = 512,
		numberOfInputChannels = 1,
		numberOfOutputChannels = 1
	}) {
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
		})
	}

	start({
		pulseThresholdRms = 0.1,
		minSecondsBetweenPulses = 0.2
	}) {
		this.pulseThresholdRms = pulseThresholdRms;
		this.minSecondsBetweenPulses = minSecondsBetweenPulses;

		this.isFirstPulse = true;
		this.lastPulseTimestamp = 0;

		return new Promise((resolve, reject) => {
			getUserMedia().then((stream) => {
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

		this.audioScriptProcessor.onaudioprocess = this.handleAudioProcess;
	}

	handleAudioProcess(event) {
		const input = event.inputBuffer.getChannelData( 0 );

		let rms = this.getRms( input );


		if ( ! this.isPulse( rms ) ) {
			return;
		}

		if ( this.isFirstPulse ) {
			this.isFirstPulse = false;

			return;
		}

		let secondsBetweenPulses = timestamp.now() - this.lastPulseTimestamp;
		let rpm = this.calcRPM( secondsBetweenPulses );
		// emit onPulse event

		this.lastPulseTimestamp = timestamp.now();
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

		return timestamp.now() - this.lastPulseTimestamp < this.minSecondsBetweenPulses;
	}

}
