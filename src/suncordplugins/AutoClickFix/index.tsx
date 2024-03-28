/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { cl } from "@components/ExpandableHeader";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";
import { useState } from "@webpack/common";


let isRecordingGlobal = false;



function isVisible(element) {
    return element.offsetWidth > 0 && element.offsetHeight > 0;
}

function isDisabled(element) {
    return element.disabled;
}


export const settings = definePluginSettings({
    hotkeyClick: {
        description: "The hotkey to send a custom message.",
        type: OptionType.COMPONENT,
        default: ["F22"],
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
                            settings.store.hotkeyClick = longestArray.map(key => key.toLowerCase());
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
                            {settings.store.hotkeyClick.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" + ")}
                            <button className={`${cl("key-recorder-button")} ${isRecording ? cl("recording-button") : ""}`} disabled={isRecording}>
                                {isRecording ? "Recording..." : "Record keybind"}
                            </button>
                        </div>
                    </div>
                </>
            );
        },
    },
});

export default definePlugin({
    name: "AutoClickFix",
    description: "Sends a custom message when a hotkey is pressed.",
    authors: [Devs.lucky],
    settings,

    start() {
        document.addEventListener("keydown", this.event);
    },

    stop() {
        document.removeEventListener("keydown", this.event);
    },

    event(e: KeyboardEvent) {
        const { hotkeyClick } = settings.store;
        const pressedKey = e.key.toLowerCase();
        const modifiersPressed = {
            control: e.ctrlKey,
            shift: e.shiftKey,
            alt: e.altKey,
            meta: e.metaKey
        };

        function clickNextPullAgainButton() {
            // Select all buttons with the specified label and contained within the specific list element
            const pullAgainButtons = document.querySelectorAll('li[data-author-id="845022164134789191"] div.label_d7587c');

            // Iterate over each button
            pullAgainButtons.forEach((button, index) => {
                // Check if the button contains text content and matches the specific text "Pull Again"
                if (button.textContent && button.textContent.trim() === "Pull Again" && isVisible(button) && !isDisabled(button)) {
                    // Cast the element to HTMLButtonElement and then click it
                    (button as HTMLButtonElement).click();
                    // Break the loop after clicking the first visible and enabled button
                    return;
                }
            });
        }




        if (isRecordingGlobal) return;

        const hotkeyMatches = hotkeyClick.every(key => {
            const lowercasedRequiredKey = key.toLowerCase();

            if (lowercasedRequiredKey in modifiersPressed) {
                return modifiersPressed[lowercasedRequiredKey];
            }

            return pressedKey === lowercasedRequiredKey;
        });

        if (hotkeyMatches) {
            clickNextPullAgainButton(); // Trigger the click when hotkey matches
        }
    }
});
