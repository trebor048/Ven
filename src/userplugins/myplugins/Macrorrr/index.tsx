/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { cl } from "@components/ExpandableHeader";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";
import { MessageActions, SelectedChannelStore, useState } from "@webpack/common";
import React from "@webpack/types";


let isRecordingGlobal: boolean = false;

function sendCustomMessage(channelId: string, content: string) {
    const messageData = {
        content: content, // Explicitly define content as a string
    };
    MessageActions.sendMessage(channelId, messageData, true);
}
function getCurrentChannelId() {
    return SelectedChannelStore.getChannelId();
}

export const settings = definePluginSettings({
    hotkey: {
        description: "The hotkey to open the command palette.",
        type: OptionType.COMPONENT,
        default: ["Alt", "P"],
        component: () => {
            const [isRecording, setIsRecording] = useState(false);

            const recordKeybind = (setIsRecording: (value: boolean) => void) => {
                const keys: Set<string> = new Set();
                const keyLists: string[][] = [];

                setIsRecording(true);
                isRecordingGlobal = true;

                const updateKeys = () => {
                    if (keys.size === 0 || !document.querySelector(`.${cl("key-recorder-button")}`)) {
                        const longestArray = keyLists.reduce((a, b) => a.length > b.length ? a : b);
                        if (longestArray.length > 0) {
                            settings.store.hotkey = longestArray.map(key => key.toLowerCase());
                        }
                        setIsRecording(false);
                        isRecordingGlobal = false;
                        document.removeEventListener("keydown", keydownListener);
                        document.removeEventListener("keyup", keyupListener);
                    }
                    keyLists.push(Array.from(keys));
                };

                const keydownListener = (e: KeyboardEvent) => {
                    const { key } = e;
                    if (!keys.has(key)) {
                        keys.add(key);
                    }
                    updateKeys();
                };

                const keyupListener = (e: KeyboardEvent) => {
                    keys.delete(e.key);
                    updateKeys();
                };

                document.addEventListener("keydown", keydownListener);
                document.addEventListener("keyup", keyupListener);
            };

            return (
                <>
                    <div className={cl("key-recorder-container")} onClick={() => recordKeybind(setIsRecording)}>
                        <div className={`${cl("key-recorder")} ${isRecording ? cl("recording") : ""}`}>
                            {settings.store.hotkey.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" + ")}
                            <button className={`${cl("key-recorder-button")} ${isRecording ? cl("recording-button") : ""}`} disabled={isRecording}>
                                {isRecording ? "Recording..." : "Record keybind"}
                            </button>
                        </div>
                    </div>
                </>
            );
        }
    },
    customMessage: { // New setting for custom message
        description: "Custom message to send when hotkey(s) are pressed.",
        type: OptionType.STRING,
        default: "", // Default empty string
    }
});

export default definePlugin({
    name: "Macrorrrr",
    description: "Allows you to navigate the UI with a keyboard.",
    authors: [Devs.lucky],
    settings,

    start() {
        document.addEventListener("keydown", this.event);
    },

    stop() {
        document.removeEventListener("keydown", this.event);
    },

    event(e: KeyboardEvent) {
        const { hotkey, customMessage } = settings.store;
        const pressedKey = e.key.toLowerCase();

        if (isRecordingGlobal) return;

        for (let i = 0; i < hotkey.length; i++) {
            const lowercasedRequiredKey = hotkey[i].toLowerCase();

            if (pressedKey === lowercasedRequiredKey) {
                // Send custom message if provided
                if (customMessage.trim() !== "") {
                    const channelId = getCurrentChannelId();
                    sendCustomMessage(channelId, customMessage);
                }
                return;
            }
        }
    }
});
