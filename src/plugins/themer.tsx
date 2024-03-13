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


const ColorPicker = findComponentByCodeLazy(".Messages.USER_SETTINGS_PROFILE_COLOR_SELECT_COLOR", ".BACKGROUND_PRIMARY)");

const settings = definePluginSettings({
    primaryColor: {
        type: OptionType.COMPONENT,
        description: "Primary Accent Coloring",
        default: "007bff",
        component: () => <ColorPick propertyname="primaryColor" />
    },
    backgroundImage1: {
        type: OptionType.STRING,
        description: "Image or GIF for the background #1 of the Client",
        default: "https://i.imgur.com/xqBBP1U.gif",
        onChange: () => injectCSS()
    },
    backgroundBrightness1: {
        type: OptionType.SLIDER,
        description: "Level of the background #1 BRIGHTNESS, 0-1",
        markers: [0, 0.25, 0.5, 0.75, 1],
        default: 0.5,
        stickToMarkers: false,
        onChange: () => injectCSS()
    },
    animationSpeed1: {
        type: OptionType.SLIDER,
        description: "Level of the speed for background #1 ANIMATION, 0-100 seconds",
        markers: [0, 40, 80, 100, 140, 180],
        default: 100,
        stickToMarkers: false,
        onChange: () => injectCSS()
    },
    backgroundImage2: {
        type: OptionType.STRING,
        description: "Image or GIF for the background #2 of the Client",
        default: "https://i.imgur.com/EUqq0lH.gif",
        onChange: () => injectCSS()
    },
    animationSpeed2: {
        type: OptionType.SLIDER,
        description: "Level of the speed for background #2 ANIMATION, 0-100 seconds",
        markers: [0, 20, 40, 60, 80, 100],
        default: 60,
        stickToMarkers: false,
        onChange: () => injectCSS()
    },
    customFonURLt: {
        type: OptionType.STRING,
        description: "The google fonts @import for a custom font (blank to disable)",
        default: "@import url('https://fonts.googleapis.com/css2?family=Comfortaa&wght@300&display=swap');",
        onChange: () => injectCSS()
    },
    ExportTheme:
    {
        type: OptionType.COMPONENT,
        description: "",
        default: "",
        component: () => <Button onClick={() => {
            copyCSS();
            Toasts.show({
                id: Toasts.genId(),
                message: "Successfully copied theme!",
                type: Toasts.Type.SUCCESS
            });
        }} >Copy The CSS for your current configuration.</Button>
    },

});

export function ColorPick({ propertyname }: { propertyname: string; }) {
    return (

        <div className="color-options-container">
            <Forms.FormTitle tag="h3">{propertyname}</Forms.FormTitle>

            <ColorPicker
                color={parseInt(settings.store[propertyname], 16)}
                onChange={color => {
                    const hexColor = color.toString(16).padStart(6, "0");
                    settings.store[propertyname] = hexColor;
                    injectCSS();
                }
                }
                showEyeDropper={false}
            />
        </div>
    );
}


function copyCSS() {
    if (Clipboard.SUPPORTS_COPY) {
        Clipboard.copy(getCSS(parseFontContent()));
    }
}

function parseFontContent() {
    const fontRegex = /family=([^&;,:]+)/;
    const customFontString: string = Settings.plugins.Glide.customFont;
    if (customFontString == null) { return; }
    const fontNameMatch: RegExpExecArray | null = fontRegex.exec(customFontString);
    const fontName = fontNameMatch ? fontNameMatch[1].replace(/[^a-zA-Z0-9]+/g, " ") : "";
    return fontName;
}
function injectCSS() {

    const fontName = parseFontContent();
    const theCSS = getCSS(fontName);

    var elementToRemove = document.getElementById("GlideStyleInjection");
    if (elementToRemove) {
        elementToRemove.remove();
    }
    const styleElement = document.createElement("style");
    styleElement.id = "GlideStyleInjection";
    styleElement.textContent = theCSS;
    document.documentElement.appendChild(styleElement);
}

function getCSS(fontName) {
    return `
            /* Luckys Theme */
            ${Settings.plugins.Glide ? `
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
    :root {
        /*VARIABLES*/
                /*the side profile thingy*/
                --profile-body-background-color: var(--blacktrans);
                /*call thingy*/
                --bg-overlay-app-frame: var(--blacktrans);}
            /*EXTRA COLORS*/
                    /*recolor embeds*/
                    [class^="embedWrap"] { border-color: var(--blacktrans) !important; background: var(--blacktrans); }
                    /*emoji menu recolor*/
                    .contentWrapper__321ed, .header_c3c744{ background-color: var(--blacktrans);}
                    /*vc background recolor*/
                    .root__3eef0{ background-color: var(--blacktrans); }
                    /*Recolor the emoji, gif, and sticker picker selected button*/
                    .navButtonActive__735cb, .stickerCategoryGenericSelected__44ec4, .categoryItemDefaultCategorySelected__8245a{background-color: var(--brand-experiment) !important;}
            /*ROUNDING (rounding)*/
                    /*round emojis seperately (and spotify activity icons)*/
                    [data-type="emoji"], [class*="Spotify"] { border-radius: 4px;}
                    /*round gifs and stickers (and maybe images idk lmao), and embeds*/
                    [class^="imageWr"], [data-type="sticker"], [class^="embed"]{ border-radius: 14px; }
                    .item__183e8 { border-radius: 14px; }
            /*CONTENT (Typically changing values or hiding elements)*/
                    /*hide the public servers button on member list*/
                    [aria-label="Explore Discoverable Servers"] { display: none; }
                    /*fix context menu being not symmetrical*/
                    .scroller__750f5{  padding: 6px 8px !important; }
                    /*space the connections a bit better*/
                    .userInfoSection__1daf8{ margin-bottom: 0px; padding-bottom: 0px;}
                    /*round banners in profile popout*/
                    .banner__6d414:not(.panelBanner__90b8a){ border-radius: 20px; }
                    /*round the user popout*/.userPopoutOuter_d739b2 { border-radius: 25px;  }
                    /*round the inner profile popout*/
                    [class="userPopoutInner_f545a3 userProfileInner__8065b userProfileInnerThemedWithBanner_d5f991"]::before { border-radius: 20px; }
            /*STYLING (Modification of content to fit the theme)*/
                    /*Round and scale down the users banner*/
                    .panelBanner__90b8a{ border-radius: 20px;transform: scale(0.95); }
                    /*add a soft glow to message bar contents, user panel, dms, channel names (in that order)*/
                    .inner__9fd0b .layout__59abc, .name__8d1ec{filter: drop-shadow(0px 0px 3px var(--brand-experiment));}
                    [type="button"]{ transition: all 0.1s ease-in-out; }
                    [type="button"]:hover{ filter: drop-shadow(0px 0px 3px var(--brand-experiment));}

    };

`;
}
export default definePlugin({
    name: "Glide",
    description: "A sleek, rounded theme for discord.",
    authors:
        [
            Devs.lucky
        ],
    settings,
    start() {
        injectCSS();
    },
    stop() {
        const injectedStyle = document.getElementById("GlideStyleInjection");
        if (injectedStyle) {
            injectedStyle.remove();
        }
    },
    startAt: StartAt.DOMContentLoaded

});


