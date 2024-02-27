/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { disableStyle, enableStyle } from "@api/Styles";
import ErrorBoundary from "@components/ErrorBoundary";
import { Devs } from "@utils/constants";
import { LazyComponent } from "@utils/react";
import definePlugin from "@utils/types";
import { filters, find } from "@webpack";

import { settings } from "./settings";
import style from "./style.css?managed";

const HeaderBarIcon = LazyComponent(() => {
    const filter = filters.byCode(".HEADER_BAR_BADGE");
    return find(m => m.Icon && filter(m.Icon)).Icon;
});

function makeIcon(enabled?: boolean) {
    return function () {
        return (
            <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 3a9 9 0 0 0-8.95 10h1.87a5 5 0 0 1 4.1 2.13l1.37 1.97a3.1 3.1 0 0 1-.17 3.78 2.85 2.85 0 0 1-3.55.74 11 11 0 1 1 10.66 0c-1.27.71-2.73.23-3.55-.74a3.1 3.1 0 0 1-.17-3.78l1.38-1.97a5 5 0 0 1 4.1-2.13h1.86A9 9 0 0 0 12 3Z" ></path>
                {!enabled &&
                    <line x1="495" y1="10" x2="10" y2="464" stroke="var(--status-danger)" strokeWidth="40" />
                }
            </svg>
        );
    };
}

function FakeVoiceOptionToggleButton() {
    const FakeMuteEnabled = settings.use(["fakeMute"]).fakeMute;
    const FakeDeafenEnabled = settings.use(["fakeDeafen"]).fakeDeafen;
    const Enabled = FakeDeafenEnabled && FakeMuteEnabled;

    return (
        <HeaderBarIcon
            className="vc-fake-voice-options"
            onClick={() => { settings.store.fakeDeafen = !Enabled; settings.store.fakeMute = !Enabled; }}
            tooltip={Enabled ? "Disable Fake/Deafen Mute" : "Enable Fake/Deafen Mute"}
            icon={makeIcon(Enabled)}
        />
    );
}


export default definePlugin({
    name: "Fake Voice Options",
    description: "fake mute & deafen",
    authors: [Devs.SaucyDuck, Devs.GeorgeV22, Devs.thororen],
    patches: [
        {
            find: "e.setSelfMute(n),",
            replacement: [{
                // prevent client-side mute
                match: /e\.setSelfMute\(n\),/g,
                replace: 'e.setSelfMute(Vencord.Settings.plugins["Fake Voice Options"].fakeMute?false:n);'
            },
            {
                // prevent client-side deafen
                match: /e\.setSelfDeaf\(t\.deaf\)/g,
                replace: 'e.setSelfDeaf(Vencord.Settings.plugins["Fake Voice Options"].fakeDeafen?false:t.deaf);'
            }]
        },
        {
            find: "toolbar:function",
            replacement: {
                match: /(function \i\(\i\){)(.{1,200}toolbar.{1,100}mobileToolbar)/,
                replace: "$1$self.addIconToToolBar(arguments[0]);$2"
            }
        },

    ],
    settings,

    addIconToToolBar(e: { toolbar: React.ReactNode[] | React.ReactNode; }) {
        if (Array.isArray(e.toolbar))
            return e.toolbar.push(
                <ErrorBoundary noop={true}>
                    <FakeVoiceOptionToggleButton />
                </ErrorBoundary>
            );

        e.toolbar = [
            <ErrorBoundary noop={true}>
                <FakeVoiceOptionToggleButton />
            </ErrorBoundary>,
            e.toolbar,
        ];
    },

    start() {
        enableStyle(style);
    },

    stop() {
        disableStyle(style);
    }
});
