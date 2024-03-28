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

let isRecordingGlobal = false;

function sendCustomMessage(channelId: string, content: string) {
    const messageData = {
        content: content.trim(), // Trim content before sending
    };
    MessageActions.sendMessage(channelId, messageData, true);
}

function getCurrentChannelId(): string {
    return SelectedChannelStore.getChannelId();
}

export const settings = definePluginSettings({
    hotkey: {
        description: "The hotkey to click the button in the message div.",
        type: OptionType.COMPONENT,
        default: ["Control", "Shift", "P"],
        component: () => {
            const [isRecording, setIsRecording] = useState(false);
            const [recordedKeys, setRecordedKeys] = useState<string[]>([]);

            const recordKeybind = () => {
                setIsRecording(true);
                isRecordingGlobal = true;
                setRecordedKeys([]);

                const keydownListener = (e: KeyboardEvent) => {
                    const { key } = e;
                    if (!recordedKeys.includes(key)) {
                        setRecordedKeys(prevKeys => [...prevKeys, key]);
                    }
                };

                const keyupListener = (e: KeyboardEvent) => {
                    setIsRecording(false);
                    isRecordingGlobal = false;
                    document.removeEventListener("keydown", keydownListener);
                    document.removeEventListener("keyup", keyupListener);
                };

                document.addEventListener("keydown", keydownListener);
                document.addEventListener("keyup", keyupListener);
            };

            return (
                <>
                    <div className={cl("key-recorder-container")} onClick={recordKeybind}>
                        <div className={cl("key-recorder")}>
                            {recordedKeys.map((key, index) => (
                                <span key={index}>{key}</span>
                            ))}
                        </div>
                    </div>
                </>
            );
        }
    }
});

export default definePlugin({
    name: "AutoPickNEW",
    description: "Clicks the button in the message div when a hotkey is pressed and the author is the same.",
    authors: [Devs.lucky],
    settings,

    start() {
        document.addEventListener("keydown", this.event);
    },

    stop() {
        document.removeEventListener("keydown", this.event);
    },

    event(e: KeyboardEvent) {
        const { hotkey } = settings.store;
        const pressedKey = e.key.toLowerCase();

        if (isRecordingGlobal) return;

        const isHotkeyPressed = hotkey.every(key => {
            if (key === "Control") return e.ctrlKey;
            if (key === "Shift") return e.shiftKey;
            if (key === "Alt") return e.altKey;
            if (key === "Meta") return e.metaKey;
            return e.key.toLowerCase() === key.toLowerCase();
        });

        if (isHotkeyPressed) {
            const messages = document.querySelectorAll(".cozyMessage__64ce7");
            messages.forEach(message => {
                const authorName = message.querySelector(".username_d30d99")?.textContent;
                const messageContent = message.querySelector(".messageContent__21e69")?.textContent;

                if (authorName === "Satan" && messageContent?.includes("Pull Again")) {
                    const button = message.querySelector("button");
                    if (button) button.click();
                }
            });
        }
    }
});
