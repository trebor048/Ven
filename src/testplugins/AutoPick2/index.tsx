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
        description: "The hotkey to send a custom message.",
        type: OptionType.COMPONENT,
        default: ["Alt", "P"],
        component: () => {
            const [isRecording, setIsRecording] = useState(false);

            const recordKeybind = (setIsRecording: (value: boolean) => void) => {
                setIsRecording(true);
                isRecordingGlobal = true;

                // Your logic for recording the hotkey
            };

            return (
                <>
                    <div className={cl("key-recorder-container")} onClick={() => recordKeybind(setIsRecording)}>
                        {/* Your UI for displaying the hotkey */}
                    </div>
                </>
            );
        }
    },
    customMessage: {
        description: "The custom message to send.",
        type: OptionType.STRING,
        default: "Hello, world!"
    }
});

export default definePlugin({
    name: "AutoPick3",
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
        const { hotkey, customMessage } = settings.store;
        const pressedKey = e.key.toLowerCase();
        const modifiersPressed = {
            control: e.ctrlKey,
            shift: e.shiftKey,
            alt: e.altKey,
            meta: e.metaKey
        };

        if (isRecordingGlobal) return;

        const hotkeyMatches = hotkey.every(key => {
            const lowercasedRequiredKey = key.toLowerCase();

            if (lowercasedRequiredKey in modifiersPressed) {
                return modifiersPressed[lowercasedRequiredKey];
            }

            return pressedKey === lowercasedRequiredKey;
        });

        if (hotkeyMatches) {
            const channelId = getCurrentChannelId();
            sendCustomMessage(channelId, customMessage);
        }
    }
});
