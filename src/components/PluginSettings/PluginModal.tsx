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

import { generateId } from "@api/Commands";
import { useSettings } from "@api/Settings";
import ErrorBoundary from "@components/ErrorBoundary";
import { Flex } from "@components/Flex";
import { proxyLazy } from "@utils/lazy";
import { Margins } from "@utils/margins";
import { classes, isObjectEmpty } from "@utils/misc";
import { ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalProps, ModalRoot, ModalSize } from "@utils/modal";
import { OptionType, Plugin } from "@utils/types";
import { findByPropsLazy, findComponentByCodeLazy } from "@webpack";
import { Button, Clickable, FluxDispatcher, Forms, React, Text, Tooltip, UserStore, UserUtils } from "@webpack/common";
import { User } from "discord-types/general";
import { Constructor } from "type-fest";

import {
    ISettingElementProps,
    SettingBooleanComponent,
    SettingCustomComponent,
    SettingNumericComponent,
    SettingSelectComponent,
    SettingSliderComponent,
    SettingTextComponent
} from "./components";
import { openContributorModal } from "./ContributorModal";

const UserSummaryItem = findComponentByCodeLazy("defaultRenderUser", "showDefaultAvatarsForNullUsers");
const AvatarStyles = findByPropsLazy("moreUsers", "emptyUser", "avatarContainer", "clickableAvatar");
const UserRecord: Constructor<Partial<User>> = proxyLazy(() => UserStore.getCurrentUser().constructor) as any;

interface PluginModalProps extends ModalProps {
    plugin: Plugin;
    onRestartNeeded(): void;
}

function makeDummyUser(user: { username: string; id?: string; avatar?: string; }) {
    const newUser = new UserRecord({
        username: user.username,
        id: user.id ?? generateId(),
        avatar: user.avatar,
        /** To stop discord making unwanted requests... */
        bot: true,
    });
    FluxDispatcher.dispatch({
        type: "USER_UPDATE",
        user: newUser,
    });
    return newUser;
}

const Components: Record<OptionType, React.ComponentType<ISettingElementProps<any>>> = {
    [OptionType.STRING]: SettingTextComponent,
    [OptionType.NUMBER]: SettingNumericComponent,
    [OptionType.BIGINT]: SettingNumericComponent,
    [OptionType.BOOLEAN]: SettingBooleanComponent,
    [OptionType.SELECT]: SettingSelectComponent,
    [OptionType.SLIDER]: SettingSliderComponent,
    [OptionType.COMPONENT]: SettingCustomComponent
};

export default function PluginModal({ plugin, onRestartNeeded, onClose, transitionState }: PluginModalProps) {
    const [authors, setAuthors] = React.useState<Partial<User>[]>([]);

    const pluginSettings = useSettings().plugins[plugin.name];

    const [tempSettings, setTempSettings] = React.useState<Record<string, any>>({});

    const [errors, setErrors] = React.useState<Record<string, boolean>>({});
    const [saveError, setSaveError] = React.useState<string | null>(null);

    const canSubmit = () => Object.values(errors).every(e => !e);

    const hasSettings = Boolean(pluginSettings && plugin.options && !isObjectEmpty(plugin.options));

    React.useEffect(() => {
        (async () => {
            if (plugin && plugin.authors && plugin.authors.length > 0) {
                for (const user of plugin.authors.slice(0, 6)) {
                    if (user && user.id) {
                        const author = await UserUtils.getUser(`${user.id}`)
                            .catch(() => makeDummyUser({ username: user.name }));
                        setAuthors(a => [...a, author]);
                    } else if (user) {
                        const author = makeDummyUser({ username: user.name });
                        setAuthors(a => [...a, author]);
                    }
                }
            }
        })();
    }, []);


    async function saveAndClose() {
        if (!plugin.options) {
            onClose();
            return;
        }

        if (plugin.beforeSave) {
            const result = await Promise.resolve(plugin.beforeSave(tempSettings));
            if (result !== true) {
                setSaveError(result);
                return;
            }
        }

        let restartNeeded = false;
        for (const [key, value] of Object.entries(tempSettings)) {
            const option = plugin.options[key];
            pluginSettings[key] = value;
            option?.onChange?.(value);
            if (option?.restartNeeded) restartNeeded = true;
        }
        if (restartNeeded) onRestartNeeded();
        onClose();
    }

    function renderSettings() {
        if (!hasSettings || !plugin.options) {
            return <Forms.FormText>There are no settings for this plugin.</Forms.FormText>;
        } else {
            const options = Object.entries(plugin.options).map(([key, setting]) => {
                if (setting.hidden) return null;

                function onChange(newValue: any) {
                    setTempSettings(s => ({ ...s, [key]: newValue }));
                }

                function onError(hasError: boolean) {
                    setErrors(e => ({ ...e, [key]: hasError }));
                }

                const Component = Components[setting.type];
                return (
                    <Component
                        id={key}
                        key={key}
                        option={setting}
                        onChange={onChange}
                        onError={onError}
                        pluginSettings={pluginSettings}
                        definedSettings={plugin.settings}
                    />
                );
            });

            return <Flex flexDirection="column" style={{ gap: 12, marginBottom: 16 }}>{options}</Flex>;
        }
    }

    function renderMoreUsers(_label: string, count: number) {
        const sliceCount = plugin.authors.length - count;
        const sliceStart = plugin.authors.length - sliceCount;
        const sliceEnd = sliceStart + plugin.authors.length - count;

        return (
            <Tooltip text={plugin.authors.slice(sliceStart, sliceEnd).map(u => u.name).join(", ")}>
                {({ onMouseEnter, onMouseLeave }) => (
                    <div
                        className={AvatarStyles.moreUsers}
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                    >
                        +{sliceCount}
                    </div>
                )}
            </Tooltip>
        );
    }

    return (
        <ModalRoot transitionState={transitionState} size={ModalSize.MEDIUM} className="vc-text-selectable">
            <ModalHeader separator={false}>
                <Text variant="heading-lg/semibold" style={{ flexGrow: 1 }}>{plugin.name}</Text>
                <ModalCloseButton onClick={onClose} />
            </ModalHeader>
            <ModalContent>
                <Forms.FormSection>
                    <Forms.FormTitle tag="h3">About {plugin.name}</Forms.FormTitle>
                    <Forms.FormText>{plugin.description}</Forms.FormText>
                    <Forms.FormTitle tag="h3" style={{ marginTop: 8, marginBottom: 0 }}>Authors</Forms.FormTitle>
                    <div style={{ width: "fit-content", marginBottom: 8 }}>
                        <UserSummaryItem
                            users={authors}
                            count={plugin.authors.length}
                            guildId={undefined}
                            renderIcon={false}
                            max={6}
                            showDefaultAvatarsForNullUsers
                            showUserPopout
                            renderMoreUsers={renderMoreUsers}
                            renderUser={(user: User) => (
                                <Clickable
                                    className={AvatarStyles.clickableAvatar}
                                    onClick={() => openContributorModal(user)}
                                >
                                    <img
                                        className={AvatarStyles.avatar}
                                        src={user.getAvatarURL(void 0, 80, true)}
                                        alt={user.username}
                                        title={user.username}
                                    />
                                </Clickable>
                            )}
                        />
                    </div>
                </Forms.FormSection>
                {!!plugin.settingsAboutComponent && (
                    <div className={classes(Margins.bottom8, "vc-text-selectable")}>
                        <Forms.FormSection>
                            <ErrorBoundary message="An error occurred while rendering this plugin's custom InfoComponent">
                                <plugin.settingsAboutComponent tempSettings={tempSettings} />
                            </ErrorBoundary>
                        </Forms.FormSection>
                    </div>
                )}
                <Forms.FormSection className={Margins.bottom16}>
                    <Forms.FormTitle tag="h3">Settings</Forms.FormTitle>
                    {renderSettings()}
                </Forms.FormSection>
            </ModalContent>
            {hasSettings && <ModalFooter>
                <Flex flexDirection="column" style={{ width: "100%" }}>
                    <Flex style={{ marginLeft: "auto" }}>
                        <Button
                            onClick={onClose}
                            size={Button.Sizes.SMALL}
                            color={Button.Colors.PRIMARY}
                            look={Button.Looks.LINK}
                        >
                            Cancel
                        </Button>
                        <Tooltip text="You must fix all errors before saving" shouldShow={!canSubmit()}>
                            {({ onMouseEnter, onMouseLeave }) => (
                                <Button
                                    size={Button.Sizes.SMALL}
                                    color={Button.Colors.BRAND}
                                    onClick={saveAndClose}
                                    onMouseEnter={onMouseEnter}
                                    onMouseLeave={onMouseLeave}
                                    disabled={!canSubmit()}
                                >
                                    Save & Close
                                </Button>
                            )}
                        </Tooltip>
                    </Flex>
                    {saveError && <Text variant="text-md/semibold" style={{ color: "var(--text-danger)" }}>Error while saving: {saveError}</Text>}
                </Flex>
            </ModalFooter>}
        </ModalRoot>
    );
}
