// Vocal Analysis Service using Web Audio API and AI
class VocalAnalysisService {
  constructor() {
    this.audioContext = null;
    this.analyser = null;
    this.microphone = null;
    this.dataArray = null;
    this.isRecording = false;
    this.recordedData = [];
    this.referenceAudio = null;
  }

  // Initialize audio context and microphone
  async initialize() {
    try {
      // Get user media (microphone access)
      this.microphone = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        } 
      });

      // Create audio context
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create analyser node
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048;
      this.analyser.smoothingTimeConstant = 0.8;

      // Connect microphone to analyser
      const source = this.audioContext.createMediaStreamSource(this.microphone);
      source.connect(this.analyser);

      // Create data array for frequency analysis
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

      console.log('🎤 Vocal analysis service initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize vocal analysis:', error);
      throw new Error('Microphone access denied or not available');
    }
  }

  // Start recording and analyzing
  startRecording() {
    if (!this.audioContext || !this.analyser) {
      throw new Error('Vocal analysis service not initialized');
    }

    this.isRecording = true;
    this.recordedData = [];
    this.analyzeAudio();
    console.log('🔴 Started vocal recording and analysis');
  }

  // Stop recording
  stopRecording() {
    this.isRecording = false;
    console.log('⏹️ Stopped vocal recording');
    return this.recordedData;
  }

  // Real-time audio analysis
  analyzeAudio() {
    if (!this.isRecording) return;

    // Get frequency data
    this.analyser.getByteFrequencyData(this.dataArray);

    // Analyze pitch, volume, and other vocal characteristics
    const analysis = this.performVocalAnalysis(this.dataArray);
    
    // Store analysis data
    this.recordedData.push({
      timestamp: Date.now(),
      ...analysis
    });

    // Continue analysis
    requestAnimationFrame(() => this.analyzeAudio());
  }

  // Core vocal analysis logic
  performVocalAnalysis(frequencyData) {
    // Calculate fundamental frequency (pitch)
    const pitch = this.calculatePitch(frequencyData);
    
    // Calculate volume/amplitude
    const volume = this.calculateVolume(frequencyData);
    
    // Calculate spectral characteristics
    const spectralCentroid = this.calculateSpectralCentroid(frequencyData);
    const spectralRolloff = this.calculateSpectralRolloff(frequencyData);
    
    // Calculate harmonic content
    const harmonics = this.calculateHarmonics(frequencyData, pitch);

    return {
      pitch: pitch,
      volume: volume,
      spectralCentroid: spectralCentroid,
      spectralRolloff: spectralRolloff,
      harmonics: harmonics,
      quality: this.assessVocalQuality(pitch, volume, harmonics)
    };
  }

  // Calculate fundamental frequency (pitch)
  calculatePitch(frequencyData) {
    const sampleRate = this.audioContext.sampleRate;
    const nyquist = sampleRate / 2;
    const binSize = nyquist / frequencyData.length;

    // Find the bin with maximum amplitude
    let maxAmplitude = 0;
    let maxBin = 0;

    // Focus on vocal frequency range (80Hz - 1000Hz)
    const minBin = Math.floor(80 / binSize);
    const maxBinRange = Math.floor(1000 / binSize);

    for (let i = minBin; i < maxBinRange && i < frequencyData.length; i++) {
      if (frequencyData[i] > maxAmplitude) {
        maxAmplitude = frequencyData[i];
        maxBin = i;
      }
    }

    // Convert bin to frequency
    const frequency = maxBin * binSize;
    return frequency;
  }

  // Calculate volume/amplitude
  calculateVolume(frequencyData) {
    let sum = 0;
    for (let i = 0; i < frequencyData.length; i++) {
      sum += frequencyData[i] * frequencyData[i];
    }
    return Math.sqrt(sum / frequencyData.length);
  }

  // Calculate spectral centroid (brightness)
  calculateSpectralCentroid(frequencyData) {
    let weightedSum = 0;
    let magnitudeSum = 0;

    for (let i = 0; i < frequencyData.length; i++) {
      weightedSum += i * frequencyData[i];
      magnitudeSum += frequencyData[i];
    }

    return magnitudeSum > 0 ? weightedSum / magnitudeSum : 0;
  }

  // Calculate spectral rolloff
  calculateSpectralRolloff(frequencyData) {
    let totalEnergy = 0;
    for (let i = 0; i < frequencyData.length; i++) {
      totalEnergy += frequencyData[i];
    }

    const threshold = totalEnergy * 0.85; // 85% of total energy
    let cumulativeEnergy = 0;

    for (let i = 0; i < frequencyData.length; i++) {
      cumulativeEnergy += frequencyData[i];
      if (cumulativeEnergy >= threshold) {
        return i;
      }
    }

    return frequencyData.length - 1;
  }

  // Calculate harmonic content
  calculateHarmonics(frequencyData, fundamentalFreq) {
    if (fundamentalFreq < 50) return []; // Too low to analyze harmonics

    const sampleRate = this.audioContext.sampleRate;
    const binSize = (sampleRate / 2) / frequencyData.length;
    const harmonics = [];

    // Analyze first 5 harmonics
    for (let harmonic = 1; harmonic <= 5; harmonic++) {
      const harmonicFreq = fundamentalFreq * harmonic;
      const bin = Math.round(harmonicFreq / binSize);
      
      if (bin < frequencyData.length) {
        harmonics.push({
          harmonic: harmonic,
          frequency: harmonicFreq,
          amplitude: frequencyData[bin]
        });
      }
    }

    return harmonics;
  }

  // Assess overall vocal quality
  assessVocalQuality(pitch, volume, harmonics) {
    let quality = 0;

    // Pitch stability (penalize if too low or too high)
    if (pitch >= 80 && pitch <= 800) {
      quality += 30;
    } else if (pitch >= 50 && pitch <= 1200) {
      quality += 15;
    }

    // Volume consistency
    if (volume >= 20 && volume <= 150) {
      quality += 25;
    } else if (volume >= 10 && volume <= 200) {
      quality += 10;
    }

    // Harmonic richness
    if (harmonics.length >= 3) {
      const harmonicStrength = harmonics.reduce((sum, h) => sum + h.amplitude, 0) / harmonics.length;
      quality += Math.min(25, harmonicStrength / 5);
    }

    // Spectral balance
    quality += 20; // Base score for having audio

    return Math.min(100, Math.max(0, quality));
  }

  // Compare with reference audio (for pitch accuracy)
  compareWithReference(referenceData) {
    if (!this.recordedData.length || !referenceData) {
      return { accuracy: 0, feedback: 'No data to compare' };
    }

    // Calculate average pitch for both recordings
    const recordedPitches = this.recordedData
      .filter(d => d.pitch > 50)
      .map(d => d.pitch);
    
    const referencePitches = referenceData
      .filter(d => d.pitch > 50)
      .map(d => d.pitch);

    if (recordedPitches.length === 0 || referencePitches.length === 0) {
      return { accuracy: 0, feedback: 'Insufficient vocal data' };
    }

    const avgRecordedPitch = recordedPitches.reduce((a, b) => a + b, 0) / recordedPitches.length;
    const avgReferencePitch = referencePitches.reduce((a, b) => a + b, 0) / referencePitches.length;

    // Calculate pitch accuracy (within semitone tolerance)
    const pitchDifference = Math.abs(avgRecordedPitch - avgReferencePitch);
    const semitoneRatio = Math.pow(2, 1/12); // 12th root of 2
    const semitoneDifference = Math.log(avgRecordedPitch / avgReferencePitch) / Math.log(semitoneRatio);
    
    let pitchAccuracy = Math.max(0, 100 - Math.abs(semitoneDifference) * 10);

    // Calculate rhythm accuracy (timing consistency)
    const rhythmAccuracy = this.calculateRhythmAccuracy();

    // Calculate overall accuracy
    const overallAccuracy = (pitchAccuracy * 0.6 + rhythmAccuracy * 0.4);

    return {
      accuracy: Math.round(overallAccuracy),
      pitchAccuracy: Math.round(pitchAccuracy),
      rhythmAccuracy: Math.round(rhythmAccuracy),
      feedback: this.generateFeedback(pitchAccuracy, rhythmAccuracy),
      avgRecordedPitch: Math.round(avgRecordedPitch),
      avgReferencePitch: Math.round(avgReferencePitch)
    };
  }

  // Calculate rhythm accuracy
  calculateRhythmAccuracy() {
    if (this.recordedData.length < 10) return 50;

    // Analyze volume consistency over time
    const volumes = this.recordedData.map(d => d.volume);
    const avgVolume = volumes.reduce((a, b) => a + b, 0) / volumes.length;
    
    // Calculate volume variance (lower is better for consistency)
    const variance = volumes.reduce((sum, vol) => sum + Math.pow(vol - avgVolume, 2), 0) / volumes.length;
    const standardDeviation = Math.sqrt(variance);
    
    // Convert to accuracy score (lower deviation = higher accuracy)
    const rhythmAccuracy = Math.max(0, 100 - (standardDeviation / avgVolume) * 100);
    
    return rhythmAccuracy;
  }

  // Generate feedback based on analysis
  generateFeedback(pitchAccuracy, rhythmAccuracy) {
    const feedback = [];

    if (pitchAccuracy >= 90) {
      feedback.push("🎯 Excellent pitch accuracy!");
    } else if (pitchAccuracy >= 75) {
      feedback.push("👍 Good pitch control");
    } else if (pitchAccuracy >= 60) {
      feedback.push("📈 Pitch needs some work");
    } else {
      feedback.push("🎵 Focus on matching the reference pitch");
    }

    if (rhythmAccuracy >= 90) {
      feedback.push("⏱️ Perfect timing and consistency!");
    } else if (rhythmAccuracy >= 75) {
      feedback.push("🎼 Good rhythm control");
    } else if (rhythmAccuracy >= 60) {
      feedback.push("⏰ Work on timing consistency");
    } else {
      feedback.push("🥁 Practice with a metronome for better timing");
    }

    return feedback;
  }

  // Clean up resources
  cleanup() {
    if (this.microphone) {
      this.microphone.getTracks().forEach(track => track.stop());
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
    this.isRecording = false;
    console.log('🧹 Vocal analysis service cleaned up');
  }
}

// Export singleton instance
export default new VocalAnalysisService();
