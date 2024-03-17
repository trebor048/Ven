import { makeAutoObservable, action, observable } from 'mobx';

interface TrackInfo {
    id: string;
    title: string;
    artist: string;
    albumCoverUrl: string;
}

class TidalStore {
    currentTrack: TrackInfo | null = null;
    isPlaying: boolean = false;
    volume: number = 1.0; // Range from 0.0 to 1.0

    constructor() {
        makeAutoObservable(this, {
            currentTrack: observable,
            isPlaying: observable,
            volume: observable,
            play: action,
            pause: action,
            nextTrack: action,
            previousTrack: action,
            setVolume: action,
            fetchCurrentTrack: action,
        });

        // Initialize store, e.g., fetch current track
        this.fetchCurrentTrack();
    }

    async fetchCurrentTrack() {
        // Fetch current track info from your local Tidal client/server
        // This is a placeholder, replace with actual code to fetch track data
        const trackData = await fetch('http://localhost:8001/currentTrack').then(res => res.json());
        this.currentTrack = trackData;
    }

    play() {
        // Send a play command to your local Tidal client/server
        fetch('http://localhost:8001/play', { method: 'POST' });
        this.isPlaying = true;
    }

    pause() {
        // Send a pause command to your local Tidal client/server
        fetch('http://localhost:8001/pause', { method: 'POST' });
        this.isPlaying = false;
    }

    nextTrack() {
        // Send a command to play the next track
        fetch('http://localhost:8001/next', { method: 'POST' });
        // Optionally, fetch current track info if it changes
        this.fetchCurrentTrack();
    }

    previousTrack() {
        // Send a command to play the previous track
        fetch('http://localhost:8001/previous', { method: 'POST' });
        // Optionally, fetch current track info if it changes
        this.fetchCurrentTrack();
    }

    setVolume(volume: number) {
        // Set the playback volume
        this.volume = volume;
        // Send the volume level to your local server, which adjusts the Tidal client
        fetch(`http://localhost:8001/volume/${volume}`, { method: 'POST' });
    }
}

export default new TidalStore();
