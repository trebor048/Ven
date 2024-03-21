// HotKeyRecorder.tsx
import React, { useState, useEffect } from 'react';

interface HotKeyRecorderProps {
    value: string[]; // The current value of the hotkey
    onChange: (newValue: string[]) => void; // Function to update the hotkey
}

const HotKeyRecorder: React.FC<HotKeyRecorderProps> = ({ value, onChange }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [displayedKeys, setDisplayedKeys] = useState<string[]>(value);

    useEffect(() => {
        if (!isRecording) return;

        const keydownListener = (e: KeyboardEvent) => {
            // Avoid recording common keys and modifiers alone
            if (["Shift", "Control", "Alt", "Meta"].includes(e.key)) return;

            const newKey = e.key;
            const newDisplayedKeys = Array.from(new Set([...displayedKeys, newKey])); // Ensure unique keys
            setDisplayedKeys(newDisplayedKeys);
            onChange(newDisplayedKeys); // Notify about the change
            e.preventDefault(); // Prevent default actions
        };

        document.addEventListener('keydown', keydownListener);
        return () => document.removeEventListener('keydown', keydownListener);
    }, [isRecording, displayedKeys, onChange]);

    const toggleRecording = () => {
        setIsRecording(!isRecording);
        if (isRecording) {
            // Optionally reset displayedKeys if you want to start fresh each time
            // setDisplayedKeys([]);
        }
    };

    return (
        <div onClick={toggleRecording} style={{ cursor: 'pointer' }}>
            <div>
                {isRecording ? "Press any keys..." : displayedKeys.join(" + ") || "Click here to set hotkey"}
                <button onClick={toggleRecording} disabled={isRecording}>
                    {isRecording ? "Recording..." : "Record keybind"}
                </button>
            </div>
        </div>
    );
};

export default HotKeyRecorder;
