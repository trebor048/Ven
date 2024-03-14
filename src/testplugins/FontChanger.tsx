/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import definePlugin, { OptionType } from "@utils/types";
import { findComponentByCodeLazy } from "@webpack";
import { Forms } from "@webpack/common";

const ColorPicker = findComponentByCodeLazy(".Messages.USER_SETTINGS_PROFILE_COLOR_SELECT_COLOR", ".BACKGROUND_PRIMARY");

const settings = definePluginSettings({
    gradientType: {
        type: OptionType.SELECT,
        description: "Choose between 'linear' or 'radial' gradient",
        options: [
            { label: "Linear", value: "linear", default: true },
            { label: "Circular", value: "radial", default: false }
        ],
        onChange: injectCSS
    },
    gradientDegree: {
        type: OptionType.NUMBER,
        description: "Gradient degree (only for linear gradient)",
        default: 120,
        onChange: injectCSS
    },
    bgGradient1: {
        type: OptionType.COMPONENT,
        description: "First background gradient color",
        default: "#283c7980",
        component: () => <ColorPick propertyName="bgGradient1" title="Background Gradient 1" />
    },
    bgGradient2: {
        type: OptionType.COMPONENT,
        description: "Second background gradient color",
        default: "#0e3e6e80",
        component: () => <ColorPick propertyName="bgGradient2" title="Background Gradient 2" />
    },
    bgGradient3: {
        type: OptionType.COMPONENT,
        description: "Third background gradient color",
        default: "#1d4e6f80",
        component: () => <ColorPick propertyName="bgGradient3" title="Background Gradient 3" />
    },
    customFont: {
        type: OptionType.STRING,
        description: "The @import for a custom font (blank to disable)",
        default: "",
        onChange: injectCSS
    },
    customHomeIconURL: {
        type: OptionType.STRING,
        description: "Custom home icon URL",
        default: "https://media.discordapp.net/stickers/1092742917535318016.webp?size=96",
        onChange: injectCSS
    }
});

function ColorPick({ propertyName, title }) {
    const currentColor = settings.store[propertyName];
    return (
        <div className="color-options-container">
            <Forms.FormTitle tag="h3">{title}</Forms.FormTitle>
            <ColorPicker
                color={parseInt(currentColor, 16)}
                onChange={color => {
                    settings.store[propertyName] = color.toString(16).padStart(6, "0");
                    injectCSS();
                }}
                showEyeDropper={false}
            />
        </div>
    );
}

function injectCSS() {
    const { customFont, gradientType, gradientDegree, bgGradient1, bgGradient2, bgGradient3, customHomeIconURL } = settings.store;
    const fontRegex = /family=([^&;,:]+)/;
    const fontNameMatch = fontRegex.exec(customFont);
    const fontName = fontNameMatch ? fontNameMatch[1].replace(/[^a-zA-Z0-9]+/g, " ") : "Quicksand";
    const gradientDegrees = gradientType === "linear" ? `${gradientDegree}deg, ` : "";

    const theCSS = `
        :root {
            ${customFont ? `@import url('${customFont}');` : ""}
            --font-primary: ${fontName};
            --font-code: "Quicksand";
        }
        ${customHomeIconURL ? `
            [aria-label="Direct Messages"] .childWrapper__01b9c [data-list-item-id="guildsnav___home"] > div {
                background-image: url('${customHomeIconURL}') !important;
                background-size: contain;
                background-repeat: no-repeat;
            }
            [aria-label="Direct Messages"] .childWrapper__01b9c [data-list-item-id="guildsnav___home"] > div > svg {
                display: none !important;
            }
            .theme-dark #app-mount{

            background: ${gradientType}-gradient(${gradientDegrees}${bgGradient1}, ${bgGradient2}, ${bgGradient3});
            }
        ` : ""}
    `;

    const styleElement = document.getElementById("VencordStyleInjection") || document.createElement("style");
    styleElement.id = "VencordStyleInjection";
    styleElement.textContent = theCSS;
    document.head.appendChild(styleElement);

    console.log("Vencord CSS injected successfully.");
}

export default definePlugin({
    name: "VencordClientTheme",
    description: "Customize Discord theme with gradients and custom fonts.",
    authors: [{ id: 0n, name: "LuckyCanucky" }],
    settings,
    start() { injectCSS(); },
    stop() { document.getElementById("VencordStyleInjection")?.remove(); }
});
