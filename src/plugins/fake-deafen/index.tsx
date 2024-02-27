/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { classNameFactory } from "@api/Styles";
import { DeafenIcon } from "@components/Icons";
import definePlugin, { OptionType } from "@utils/types";
import { useState } from "@webpack/common";

import { addSettingsPanelButton, removeSettingsPanelButton } from "../../plugins/philsPluginLibrary";

const cl: (suffix: string) => string = classNameFactory("vc-command-palette-");

let isRecordingGlobal: boolean = false;
export let fakeD: boolean = false;

function mute(): void {
    const moot: HTMLElement | null = document.querySelector('[aria-label="Mute"]');
    if (moot) moot.click();
}

function deafen(): void {
    const def: HTMLElement | null = document.querySelector('[aria-label="Deafen"]');
    if (def) def.click();
}

const settings = definePluginSettings({
    muteUponFakeDeafen: {
        type: OptionType.BOOLEAN,
        description: "Mute microphone when fake deafen is toggled.",
        default: false
    },
    mute: {
        type: OptionType.BOOLEAN,
        description: "",
        default: true
    },
    deafen: {
        type: OptionType.BOOLEAN,
        description: "",
        default: true
    },
    cam: {
        type: OptionType.BOOLEAN,
        description: "",
        default: false
    },
    hotkey: {
        description: "The hotkey to toggle fake deafen.",
        type: OptionType.COMPONENT,
        default: ["Control", "Shift", "D"],
        component: () => {
            const [isRecording, setIsRecording] = useState(false);

            const recordKeybind = (setIsRecording: (value: boolean) => void): void => {
                const keys: Set<string> = new Set();
                const keyLists: string[][] = [];

                setIsRecording(true);
                isRecordingGlobal = true;

                const updateKeys = (): void => {
                    if (keys.size === 0 || !document.querySelector(`.${cl("key-recorder-button")}`)) {
                        const longestArray: string[] = keyLists.reduce((a, b) => a.length > b.length ? a : b, []);
                        if (longestArray.length > 0) {
                            settings.store.hotkey = longestArray.map(key => key.toLowerCase());
                        }
                        setIsRecording(false);
                        isRecordingGlobal = false;
                        document.removeEventListener("keydown", keydownListener);
                        document.removeEventListener("keyup", keyupListener);
                    }
                    keyLists.push(Array.from(keys));
                };

                const keydownListener = (e: KeyboardEvent): void => {
                    const { key } = e;
                    if (!keys.has(key)) {
                        keys.add(key);
                    }
                    updateKeys();
                };

                const keyupListener = (e: KeyboardEvent): void => {
                    keys.delete(e.key);
                    updateKeys();
                };

                document.addEventListener("keydown", keydownListener);
                document.addEventListener("keyup", keyupListener);
            };

            return (
                <div className={cl("key-recorder-container")} onClick={() => recordKeybind(setIsRecording)}>
                    <div className={`${cl("key-recorder")} ${isRecording ? cl("recording") : ""}`}>
                        {settings.store.hotkey.map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(" + ")}
                        <button className={`${cl("key-recorder-button")} ${isRecording ? cl("recording-button") : ""}`} disabled={isRecording}>
                            {isRecording ? "Recording..." : "Record keybind"}
                        </button>
                    </div>
                </div>
            );
        }
    }
});

export default definePlugin({
    name: "fake deafen",
    description: "You're deafened but you're not.",
    dependencies: ["PhilsPluginLibrary"],
    authors: [
        {
            id: 526331463709360141n,
            name: "desu"
        },
        {
            id:995923917594173440n,
            name:"Lucky"
        }
    ],
    settings,
    patches: [
        {
            find: "}voiceStateUpdate(",
            replacement: {
                match: /self_mute:([^,]+),self_deaf:([^,]+),self_video:([^,]+)/,
                replace: "self_mute:$self.toggle($1, 'mute'),self_deaf:$self.toggle($2, 'deaf'),self_video:$self.toggle($3, 'video')"
            }
        }
    ],
    toggle: (au: any, what: string) => {
        if (fakeD === false)
            return au;
        else
            switch (what) {
                case "mute": return settings.store.mute;
                case "deaf": return settings.store.deafen;
                case "video": return settings.store.cam;
            }
    },

    start() {
        addSettingsPanelButton({
            name: "faked",
            icon: DeafenIcon,
            tooltipText: "Fake Deafen",
            onClick: () => {
                fakeD = !fakeD;
                deafen();
                setTimeout(deafen, 250);
                if (settings.store.muteUponFakeDeafen) setTimeout(mute, 300);
            }
        });
        document.addEventListener("keydown", handleHotkeyPress);
    },
    stop() {
        removeSettingsPanelButton("faked");
        document.removeEventListener("keydown", handleHotkeyPress);
    }
});

function handleHotkeyPress(e: KeyboardEvent): void {
    if (isRecordingGlobal) return;
    const hotkeys: string[] = settings.store.hotkey.map((key: string) => key.toLowerCase());
    const pressedKey: string = e.key.toLowerCase();
    const isHotkeyPressed: boolean = hotkeys.every((key: string, index: number) => {
        if (index === hotkeys.length - 1) return key === pressedKey;
        if (key === "control") return e.ctrlKey;
        if (key === "shift") return e.shiftKey;
        if (key === "alt") return e.altKey;
        if (key === "meta") return e.metaKey;
        return false;
    });
    if (isHotkeyPressed) {
        fakeD = !fakeD;
        deafen();
        setTimeout(deafen, 250);
        if (settings.store.muteUponFakeDeafen) setTimeout(mute, 300);
    }
}
