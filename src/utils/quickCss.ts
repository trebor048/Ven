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

import { addSettingsListener, Settings } from "@api/Settings";
import { Toasts } from "@webpack/common";

import { compileUsercss } from "./themes/usercss/compiler";

let style;
let themesStyle;

function createStyle(id) {
    const style = document.createElement("style");
    style.id = id;
    document.documentElement.append(style);
    return style;
}

async function initSystemValues() {
    const values = await VencordNative.themes.getSystemValues();
    const variables = Object.entries(values)
        .filter(([, v]) => v !== "#")
        .map(([k, v]) => `--${k}: ${v};`)
        .join("");

    createStyle("vencord-os-theme-values").textContent = `:root{${variables}}`;
}

export async function toggle(isEnabled) {
    if (!style) {
        style = createStyle("vencord-custom-css");
        VencordNative.quickCss.addChangeListener(css => {
            style.textContent = css;
            style.disabled = !Settings.useQuickCss;
        });
        style.textContent = await VencordNative.quickCss.get();
    }
    style.disabled = !isEnabled;
}

async function initThemes() {
    themesStyle = themesStyle || createStyle("vencord-themes");
    const { themeLinks, disabledThemeLinks, enabledThemes } = Settings;

    const links = [...themeLinks.filter(link => !disabledThemeLinks.includes(link))];

    if (IS_WEB) {
        for (const theme of enabledThemes) {
            const themeData = await VencordNative.themes.getThemeData(theme);
            if (!themeData) continue;

            const blob = new Blob([themeData], { type: "text/css" });
            links.push(URL.createObjectURL(blob));
        }
    } else {
        const localThemes = enabledThemes.map(theme => `vencord:///themes/${theme}?v=${Date.now()}`);
        links.push(...localThemes);
    }

    for (const theme of enabledThemes.filter(theme => theme.endsWith(".user.css"))) {
        const css = await compileUsercss(theme);
        if (!css) {
            Toasts.show({
                message: `Failed to compile ${theme}, check the console for more info.`,
                type: Toasts.Type.FAILURE,
                id: Toasts.genId(),
                options: {
                    position: Toasts.Position.BOTTOM
                }
            });
            continue;
        }

        const blob = new Blob([css], { type: "text/css" });
        links.push(URL.createObjectURL(blob));
    }

    themesStyle.textContent = links.map(link => `@import url("${link.trim()}");`).join("\n");
}

document.addEventListener("DOMContentLoaded", () => {
    initSystemValues();
    initThemes();

    toggle(Settings.useQuickCss);
    addSettingsListener("useQuickCss", toggle);

    addSettingsListener("themeLinks", initThemes);
    addSettingsListener("enabledThemes", initThemes);
    addSettingsListener("userCssVars", initThemes);

    if (!IS_WEB)
        VencordNative.quickCss.addThemeChangeListener(initThemes);
});
