/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";

let pluginSettings: any; // Define a global variable to store plugin settings

const settings = definePluginSettings({
    videoBgURL: {
        type: OptionType.STRING,
        description: "Video URL for the Background of the client.",
        default: "https://i.imgur.com/xqBBP1U.mp4",
    },
});

export default definePlugin({
    name: "videoBackground",
    description: "Injects a video background into the Discord client.",
    authors: [Devs.lucky],
    settings,

    start() {
        // Assign plugin settings to the global variable
        pluginSettings = settings.store;

        // Create video element and set attributes
        const video = document.createElement("video");
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.style.cssText = "width: 100vw; height: 100vh; position: fixed; top: 0; left: 0; z-index: -1; object-fit: cover;";

        // Set the video source using pluginSettings
        video.src = pluginSettings.videoBgURL;

        // Use a class or id to uniquely identify the video element for easy removal
        video.id = "videoBackground";

        // Append video to the body as the background
        document.body.appendChild(video);
    },

    stop() {
        // Remove the video background when the plugin is disabled
        const videoBackground = document.getElementById("videoBackground");
        if (videoBackground) {
            videoBackground.remove();
        }
    },
});
