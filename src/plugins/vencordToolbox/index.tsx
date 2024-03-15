/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./index.css";

import { openNotificationLogModal } from "@api/Notifications/notificationLog";
import { Settings, useSettings } from "@api/Settings";
import ErrorBoundary from "@components/ErrorBoundary";
import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";
import { findExportedComponentLazy } from "@webpack";
import { Menu, Popout, Toasts, useState } from "@webpack/common";
import type { ReactNode } from "react";
import { actions, ButtonAction } from "suncordplugins/commandPalette/commands";



const HeaderBarIcon = findExportedComponentLazy("Icon", "Divider");

function togglePlugin(plugin: ButtonAction, enabled: boolean) {
    Settings.plugins[plugin.id].enabled = enabled;

    Toasts.show({
        message: `Successfully ${enabled ? "enabled" : "disabled"} ${plugin.id}`,
        type: Toasts.Type.SUCCESS,
        id: Toasts.genId(),
        options: {
            position: Toasts.Position.BOTTOM
        }
    });
}

function VencordPopout(onClose: () => void) {
    const { useQuickCss } = useSettings(["useQuickCss"]);

    const pluginEntries = [] as ReactNode[];

    for (const action of actions) {
        pluginEntries.push(
            <Menu.MenuItem
                id={`vc-toolbox-${action.id}`}
                label={action.label}
                action={action.callback}
                key={`vc-toolbox-${action.id}`}
            />
        );
    }

    return (
        <Menu.Menu
            navId="vc-toolbox"
            onClose={onClose}
        >
            <Menu.MenuItem
                id="vc-toolbox-notifications"
                label="Open Notification Log"
                action={openNotificationLogModal}
            />
            <Menu.MenuItem
                id="vc-toolbox-theme"
                label="Toggle Local Themes"
                action={openNotificationLogModal}
            />
            <Menu.MenuCheckboxItem
                id="vc-toolbox-quickcss-toggle"
                checked={useQuickCss}
                label={"Enable QuickCSS"}
                action={() => {
                    Settings.useQuickCss = !useQuickCss;
                }}
            />
            <Menu.MenuItem
                id="vc-toolbox-quickcss"
                label="Open QuickCSS"
                action={() => VencordNative.quickCss.openEditor()}
            />
            {...pluginEntries}
        </Menu.Menu>
    );
}

function VencordPopoutIcon(isShown: boolean) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 27 27" width={24} height={24}>
            <path fill="currentColor" d={isShown ? "M9 0h1v1h1v2h1v2h3V3h1V1h1V0h1v2h1v2h1v7h-1v-1h-3V9h1V6h-1v4h-3v1h1v-1h2v1h3v1h-1v1h-3v2h1v1h1v1h1v3h-1v4h-2v-1h-1v-4h-1v4h-1v1h-2v-4H9v-3h1v-1h1v-1h1v-2H9v-1H8v-1h3V6h-1v3h1v1H8v1H7V4h1V2h1M5 19h2v1h1v1h1v3H4v-1h2v-1H4v-2h1m15-1h2v1h1v2h-2v1h2v1h-5v-3h1v-1h1m4 3h4v1h-4" : "M0 0h7v1H6v1H5v1H4v1H3v1H2v1h5v1H0V6h1V5h1V4h1V3h1V2h1V1H0m13 2h5v1h-1v1h-1v1h-1v1h3v1h-5V7h1V6h1V5h1V4h-3m8 5h1v5h1v-1h1v1h-1v1h1v-1h1v1h-1v3h-1v1h-2v1h-1v1h1v-1h2v-1h1v2h-1v1h-2v1h-1v-1h-1v1h-6v-1h-1v-1h-1v-2h1v1h2v1h3v1h1v-1h-1v-1h-3v-1h-4v-4h1v-2h1v-1h1v-1h1v2h1v1h1v-1h1v1h-1v1h2v-2h1v-2h1v-1h1M8 14h2v1H9v4h1v2h1v1h1v1h1v1h4v1h-6v-1H5v-1H4v-5h1v-1h1v-2h2m17 3h1v3h-1v1h-1v1h-1v2h-2v-2h2v-1h1v-1h1m1 0h1v3h-1v1h-2v-1h1v-1h1"} />
        </svg>
    );
}

function VencordPopoutButton() {
    const [show, setShow] = useState(false);

    return (
        <Popout
            position="bottom"
            align="right"
            animation={Popout.Animation.NONE}
            shouldShow={show}
            onRequestClose={() => setShow(false)}
            renderPopout={() => VencordPopout(() => setShow(false))}
        >
            {(_, { isShown }) => (
                <HeaderBarIcon
                    className="vc-toolbox-btn"
                    onClick={() => setShow(v => !v)}
                    tooltip={isShown ? null : "Suncord Toolbox"}
                    icon={() => VencordPopoutIcon(isShown)}
                    selected={isShown}
                />
            )}
        </Popout>
    );
}

function ToolboxFragmentWrapper({ children }: { children: ReactNode[]; }) {
    children.splice(
        children.length - 1, 0,
        <ErrorBoundary noop={true}>
            <VencordPopoutButton />
        </ErrorBoundary>
    );

    return <>{children}</>;
}

export default definePlugin({
    name: "VencordToolbox",
    description: "Adds a button next to the inbox button in the channel header that houses Vencord quick actions",
    authors: [Devs.Ven, Devs.AutumnVN, Devs.lucky],

    patches: [
        {
            find: "toolbar:function",
            replacement: {
                match: /(?<=toolbar:function.{0,100}\()\i.Fragment,/,
                replace: "$self.ToolboxFragmentWrapper,"
            }
        }
    ],

    ToolboxFragmentWrapper: ErrorBoundary.wrap(ToolboxFragmentWrapper, {
        fallback: () => <p style={{ color: "red" }}>Failed to render :(</p>
    })
});
