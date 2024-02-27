/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { MessageObject } from "@api/MessageEvents";
import { definePluginSettings } from "@api/Settings";
import definePlugin, { OptionType } from "@utils/types";
import { MessageActions, SelectedChannelStore } from "@webpack/common";


function sendMessage(channelId: string, content: string) {
    const messageData: Partial<MessageObject> = {
        content,
    };

    MessageActions.sendMessage(channelId, messageData, true);
}

function getCurrentChannelId() {
    return SelectedChannelStore.getChannelId();
}

function handler(event: KeyboardEvent) {
    const hotkey = settings.store.pickHotkey.toLowerCase();

    if (hotkey && event.key.toLowerCase() === hotkey) {
        const channelId = getCurrentChannelId();
        if (channelId) {
            sendMessage(channelId, ".pick");
        }
    }
}

const settings = definePluginSettings({
    pickHotkey: {
        type: OptionType.STRING,
        description: "Hotkey for sending '.pick' into the current channel",
        default: "F23",
    },
});

export default definePlugin({
    name: "AutoPick",
    description: "Sends '.pick' into the current channel when the specified hotkey is pressed.",
    authors: [
        {
            id: 995923917594173440n,
            name: "LuckyCanucky",
        },
    ],
    settings,

    start() {
        window.addEventListener("keydown", handler);
    },

    stop() {
        window.removeEventListener("keydown", handler);
    },
});
