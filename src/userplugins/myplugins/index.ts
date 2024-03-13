/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export const VERSION = "1.0.1";


import Plugins from "~plugins";

const PLUGINS = [
    require("./keypressClick").default,
    require("./SlotsClicker").default,
    require("./annoiler").default,
    require("./AutoIdle").default,
    require("./FindVC").default,
    require("./images").default,
    require("./SlotsClicker").default,
    require("./betterDiscordThemeLoader").default,
    require("./betterPinDMs").default,
    require("./TidalRPCFixer").default,
];

for (const plugin of PLUGINS) {
    (plugin.tags ??= []).push("LuckyCanucky");
}

const name = Symbol("myplugins");
export default { name };

// This is called from api/Badges.ts, which is the first place that imports ~plugins
Set = new Proxy(Set, {
    construct(target, args) {
        if (Plugins && Plugins[name as any]) {
            Set = target;
            delete Plugins[name as any];
            for (const plugin of PLUGINS)
                Plugins[plugin.name] = plugin;
        }
        return Reflect.construct(target, args);
    }
});
