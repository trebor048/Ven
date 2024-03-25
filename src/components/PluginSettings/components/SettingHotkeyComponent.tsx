/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2022 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { useState } from "@webpack/common";

interface HotkeyRecorderProps {
    defaultHotkey: string[];
    onHotkeyChange: (newHotkey: string[]) => void;
}

export function HotkeyRecorder({ defaultHotkey, onHotkeyChange }: HotkeyRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [currentHotkey, setCurrentHotkey] = useState(defaultHotkey);

    const startRecording = () => {
        setIsRecording(true);
        // Add event listeners to record the hotkey
        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("keyup", handleKeyUp);
    };

    const stopRecording = () => {
        setIsRecording(false);
        // Remove event listeners after recording
        document.removeEventListener("keydown", handleKeyDown);
        document.removeEventListener("keyup", handleKeyUp);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        // Handle keydown event to record the hotkey
        e.preventDefault();
        // Logic to record the key press
        // Update currentHotkey state
    };

    const handleKeyUp = (e: KeyboardEvent) => {
        // Handle keyup event to record the hotkey
        e.preventDefault();
        // Logic to record the key release
        // Update currentHotkey state
    };

    const saveHotkey = () => {
        // Save the recorded hotkey and call the callback function
        onHotkeyChange(currentHotkey);
        stopRecording();
    };

    return (
        <div>
            <div>{currentHotkey.join(" + ")}</div>
            <button onClick={isRecording ? stopRecording : startRecording}>
                {isRecording ? "Stop Recording" : "Start Recording"}
            </button>
            <button onClick={saveHotkey} disabled={isRecording}>
                Save Hotkey
            </button>
        </div>
    );
}
