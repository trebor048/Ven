/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings, Settings } from "@api/Settings";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType, StartAt } from "@utils/types";
import { findComponentByCodeLazy } from "@webpack";
import { Button, Clipboard, Forms, Toasts } from "@webpack/common";
import React from "react";

const ColorPicker = findComponentByCodeLazy(
    ".Messages.USER_SETTINGS_PROFILE_COLOR_SELECT_COLOR",
    ".BACKGROUND_PRIMARY)"
);

const settings = definePluginSettings({
    themeEnabled: {
        type: OptionType.BOOLEAN,
        description: "Enable or disable the theme.",
        default: false,
        onChange: (newValue: boolean) => injectCSS(CSS) // Corrected function reference
    },
    primaryColor: {
        type: OptionType.COMPONENT,
        description: "Primary theme color for highlights and buttons",
        default: "#007bff",
        component: () => <ColorPicker propertyname="Primary" />
    },
    backgroundImage1: {
        type: OptionType.STRING,
        description: "Image or GIF for background #1 of the Client",
        default: "https://i.imgur.com/xqBBP1U.gif",
        onChange: (newValue: boolean) => injectCSS(CSS) // Corrected function reference
    },
    backgroundBrightness1: {
        type: OptionType.SLIDER,
        description: "Background brightness level, from 0 to 1 for background #1.",
        markers: [0, 0.25, 0.5, 0.75, 1],
        default: 0.5,
        stickToMarkers: true,
        onChange: (newValue: boolean) => injectCSS(CSS) // Corrected function reference
    },
    animationSpeedBG1: {
        type: OptionType.SLIDER,
        description: "Animation speed for background #1, in seconds.",
        markers: [10, 20, 30, 40, 50],
        default: 30,
        stickToMarkers: true,
        onChange: (newValue: boolean) => injectCSS(CSS) // Corrected function reference
    },
    backgroundImage2: {
        type: OptionType.STRING,
        description: "Image or GIF for background #2 of the Client",
        default: "https://i.imgur.com/EUqq0lH.gif",
        onChange: (newValue: boolean) => injectCSS(CSS) // Corrected function reference
    },
    animationSpeedBG2: {
        type: OptionType.SLIDER,
        description: "Animation speed for background #2, in seconds.",
        markers: [20, 40, 60, 80, 100],
        default: 50,
        stickToMarkers: true,
        onChange: (newValue: boolean) => injectCSS(CSS) // Corrected function reference
    },
    customFontURL: {
        type: OptionType.STRING,
        description: "URL for a custom font (leave blank to use default).",
        default: "https://fonts.googleapis.com/css2?family=Comfortaa:wght@300&display=swap",
        onChange: (newValue: boolean) => injectCSS(CSS) // Corrected function reference
    },
    exportTheme: {
        type: OptionType.COMPONENT,
        description: "Export the current theme settings as CSS.",
        default: "",
        component: ExportThemeButton
    }
});

// Function to handle the export theme button click
function ExportThemeButton() {
    return (
        <Button onClick={handleExportTheme}>
            Copy The CSS for your current configuration.
        </Button>
    );
}

// Function to copy the generated CSS to the clipboard
function handleExportTheme() {
    try {
        const CSS = generateCSS(settings.store, Boolean);
        Clipboard.copy(CSS);
        Toasts.show({ message: "Theme CSS copied to clipboard!", id: "themeCopied", type: 1 });
    } catch (error) {
        Toasts.show({ message: "Failed to copy theme CSS.", id: "themeCopyFailed", type: 0 });
    }
}


function generateCSS(vars, themeEnabled) {
    return `
        /* Luckys Theme */
        ${Settings.plugins.Glide.themeEnabled ? `
            ${Settings.plugins.Glide.customFontURL}
            @import url(https://raw.githubusercontent.com/trebor048/discordddd/main/main2.css);
            :root {
                /*CHANGE THESE COLORS FOR THE BACKGROUND*/
                  --TEXTURE: url(${Settings.plugins.Glide.backgroundImage1});
                  --bgspeed1: ${Settings.plugins.Glide.animationspeed1}s;
                  --textureBrightness: ${Settings.plugins.Glide.backgroundBrightness1};
                  --appBG: url(${Settings.plugins.Glide.backgroundImage2});
                  --bgspeed2: ${Settings.plugins.Glide.animationspeed2}s;
                  --brand-experiment: ${Settings.plugins.Glide.primaryColor};
                /*CHANGE THESE COLORS FOR THE BACKGROUND*/
            }
            :root{
                --whiteg: rgba(255, 255, 255, 0);
                --blueg: rgba(0, 90, 180, 0.255);
                --greeng: rgba(204, 48, 48, 0.275);
                --yellogw: rgba(255, 226, 68, 0.3);
                --pinkg: rgba(153, 45, 104, 0.675);
                --colorBG: radial-gradient(circle at bottom, var(--blueg), transparent 80%), linear-gradient(to top, var(--greeng), transparent 70%), linear-gradient(to bottom, transparent, var(--whiteg), var(--blueg));
            }
            #app-mount {
                 background-image: var(--appBG);
                 backdrop-filter: brightness(5);
                 border-radius:18px;
                 background-size:105% 105%;
                 animation: bgg var(--bgspeed2) ease-in-out infinite;
            }
            .platform-win .bg__12180 {
                  background-image: var(--TEXTURE);
                  opacity: var(--textureBrightness);
                  background-size: cover;
                  background-repeat: round;
                  animation: bg var(--bgspeed1) ease-in-out infinite;
            }
            ` : ""}
:root
{

    /*VARIABLES*/


            /*the side profile thingy*/
            --profile-body-background-color: var(--blacktrans);

            /*call thingy*/
            --bg-overlay-app-frame: var(--blacktrans);

}


        /*EXTRA COLORS*/
                /*recolor embeds*/
                [class^="embedWrap"]
                {
                    border-color: var(--blacktrans) !important;
                    background: var(--blacktrans);
                }
                /*emoji menu recolor*/
                .contentWrapper__321ed, .header_c3c744
                {
                background-color: var(--blacktrans);
                }
                /*vc background recolor*/
                .root__3eef0
                {
                    background-color: var(--blacktrans);
                }
                /*Recolor the emoji, gif, and sticker picker selected button*/
                .navButtonActive__735cb, .stickerCategoryGenericSelected__44ec4, .categoryItemDefaultCategorySelected__8245a
                {
                    background-color: var(--brand-experiment) !important;
                }
        /*ROUNDING (rounding)*/
                /*round emojis seperately (and spotify activity icons)*/
                [data-type="emoji"], [class*="Spotify"]
                {
                    border-radius: 4px;
                }
                /*round gifs and stickers (and maybe images idk lmao), and embeds*/
                [class^="imageWr"], [data-type="sticker"], [class^="embed"]
                {
                    border-radius: 14px;
                }
                .item__183e8
                {
                  border-radius: 14px;
                }



        /*CONTENT (Typically changing values or hiding elements)*/
                /*hide the public servers button on member list*/
                [aria-label="Explore Discoverable Servers"]
                {
                    display: none;
                }
                /*fix context menu being not symmetrical*/
                .scroller__750f5
                {
                    padding: 6px 8px !important;
                }
                /*space the connections a bit better*/
                .userInfoSection__1daf8
                {
                    margin-bottom: 0px;
                    padding-bottom: 0px;
                }
                /*round banners in profile popout*/
                .banner__6d414:not(.panelBanner__90b8a)
                {
                  border-radius: 20px;
                }
                /*round the user popout*/
                .userPopoutOuter_d739b2
                {
                  border-radius: 25px;
                }
                /*round the inner profile popout*/
                [class="userPopoutInner_f545a3 userProfileInner__8065b userProfileInnerThemedWithBanner_d5f991"]::before
                {
                border-radius: 20px;
                }

        /*STYLING (Modification of content to fit the theme)*/

                /*Round and scale down the users banner*/
                .panelBanner__90b8a
                {
                border-radius: 20px;
                transform: scale(0.95);
                }
                /*add a soft glow to message bar contents, user panel, dms, channel names (in that order)*/
                .inner__9fd0b .layout__59abc, .name__8d1ec
                {
                filter: drop-shadow(0px 0px 3px var(--brand-experiment));
                }
                [type="button"]
                {
                        transition: all 0.1s ease-in-out;
                }
                [type="button"]:hover
                {
                        filter: drop-shadow(0px 0px 3px var(--brand-experiment));
                }

`;



    // Component for picking colors
    function ColorPick({ propertyname }) {
        return (
            <div className="color-options-container">
                <Forms.FormTitle tag="h3">{propertyname}</Forms.FormTitle>
                <ColorPicker
                    color={parseInt(settings.store[propertyname], 16)}
                    onChange={color => {
                        const hexColor = color.toString(16).padStart(6, "0");
                        settings.store[propertyname] = hexColor;
                        injectCSS(CSS);
                    }}
                    showEyeDropper={false}
                />
            </div>
        );
    }

}

// Function to inject CSS into the document
function injectCSS(CSS) {
    let styleElement = document.getElementById("GlideStyleInjection");
    if (!styleElement) {
        styleElement = document.createElement("style");
        styleElement.id = "GlideStyleInjection";
        document.head.appendChild(styleElement);
    }
    styleElement.textContent = CSS;
}
export default definePlugin({
    name: "Glide",
    description: "A sleek, rounded theme for Discord.",
    authors: [Devs.lucky],
    start() {
        injectCSS(CSS);
    },
    settings,
    stop() {
        const injectedStyle = document.getElementById("GlideStyleInjection");
        if (injectedStyle) {
            injectedStyle.remove();
        }
    },
    startAt: StartAt.DOMContentLoaded

});
