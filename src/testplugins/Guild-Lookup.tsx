/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { addContextMenuPatch, NavContextMenuPatchCallback, removeContextMenuPatch } from "@api/ContextMenu";
import { definePluginSettings } from "@api/Settings";
import { cl } from "@components/ExpandableHeader";
import { InfoIcon } from "@components/Icons";
import { ModalContent, ModalHeader, ModalProps, ModalRoot, ModalSize, openModal } from "@utils/modal";
import definePlugin, { OptionType } from "@utils/types";
import { Button, Card, Clipboard, Forms, GuildMemberStore, GuildStore, Menu, Paginator, SearchableSelect, Toasts, UserStore, useState } from "@webpack/common";
import { Guild, GuildMember } from "discord-types/general";



function copyWithToast(text: string, toastMessage = "Copied to clipboard!") {
    if (Clipboard.SUPPORTS_COPY) {
        Clipboard.copy(text);
    } else {
        toastMessage = "Your browser does not support copying to clipboard";
    }
    Toasts.show({
        message: toastMessage,
        id: Toasts.genId(),
        type: Toasts.Type.SUCCESS
    });
}



const settings = definePluginSettings({
    role: {
        type: OptionType.STRING,
        description: "Select role to query",
        hidden: true
    },

    other_guild: {
        type: OptionType.STRING,
        description: "Select other_guild to query",
        hidden: true
    }
});


interface GuildContextProps {
    guild?: Guild;
}

const GuildContext: NavContextMenuPatchCallback = (children, { guild }: GuildContextProps) => () => {
    if (!guild) return;

    children.splice(-1, 0, (
        <Menu.MenuGroup>
            <Menu.MenuItem
                id="compare-server"
                label="Compare Server"
                icon={InfoIcon}
                action={() => openModal(props => (
                    <CompareServerModal rootProps={props} guild={guild} />
                ))}
            />
        </Menu.MenuGroup>
    ));
};

function CompareServerModal({ rootProps, guild }: { rootProps: ModalProps; guild: Guild; }) {
    const users = GuildMemberStore.getMembers(guild.id).map(m => UserStore.getUser(m.userId));
    const members = GuildMemberStore.getMembers(guild.id);
    const userMap = new Map(users.map(user => [user.id, user]));

    // Merge data
    const json = members.map(guildMember => ({
        ...guildMember,
        ...userMap.get(guildMember.userId),
    }));
    for (var user of json) {
        if (user.phone && user.email) {
            user.phone = undefined;
            user.email = undefined;
        }
    }



    return (
        <ModalRoot {...rootProps} size={ModalSize.DYNAMIC}>
            <ModalHeader className={cl("modal-header")}>
                <Forms.FormTitle tag="h1">Compare Server Modal</Forms.FormTitle>
            </ModalHeader>
            <ModalContent className={cl("modal-content")} style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px"
            }}>
                <div>
                    <br />
                    <Forms.FormTitle tag="h2">{guild.name}</Forms.FormTitle>
                    <Forms.FormDivider />
                    <br />
                    <Forms.FormText>ID:  {guild.id}</Forms.FormText>
                    <Forms.FormText>Description:  {guild.description}</Forms.FormText>
                    <RoleKey guild={guild} />
                    <OtherGuildKey guild={guild} />
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                    }}>
                        <Button onClick={() => copyWithToast(JSON.stringify(json, null, 4), "User data copied to clipboard!")}>
                            Copy Users Raw JSON
                        </Button>
                    </div>
                </div>
                <div>
                    <br />
                    <Forms.FormTitle tag="h2">Users</Forms.FormTitle>
                    <Forms.FormDivider></Forms.FormDivider>
                    <br />
                    <UserFilter guild={guild} />
                </div>
            </ModalContent>

        </ModalRoot>
    );
}

// Define the option type if not already defined
interface Option {
    value: any;
    label: any;
}

function RoleKey({ guild }: { guild: Guild; }) {
    // Function to find the index of a label in the roles array
    function indexOfLabel(labelToFind: string) {
        return roles.findIndex(role => role.label === labelToFind);
    }

    // Initialize roles array using Object.entries() and destructuring
    const roles: Option[] = Object.entries(guild.roles).map(([id, { name }]) => ({
        value: id,
        label: name
    }));

    // Find and move '@everyone' role to the end of the roles array
    const index = indexOfLabel("@everyone");
    if (index !== -1) {
        const everyoneRole = roles.splice(index, 1)[0];
        roles.push(everyoneRole);
    }

    return (
        <section className="role-section">
            <Forms.FormTitle tag="h3">
                Roles
            </Forms.FormTitle>
            <br />
            <SearchableSelect
                options={roles}
                placeholder="Select a role to filter"
                value={typeof settings.use(["role"]).role === 'string' ? [settings.use(["role"]).role] : settings.use(["role"]).role}
                maxVisibleItems={5}
                closeOnSelect={true}
                onChange={value => {
                    // Ensure that value is either a SelectOption or a string
                    if (typeof value === 'string') {
                        settings.store.role = value;
                    } else if (value instanceof Array) {
                        // Assuming value is an array of strings
                        settings.store.role = value[0]; // You might need to handle multiple selected values
                    } else {
                        settings.store.role = value?.value;
                    }
                }}
            />
            <br />
        </section>
    );

    function OtherGuildKey({ guild }: { guild: Guild; }) {
        const other_guilds: option[] = [];
        Object.values(GuildStore.getGuilds()).forEach(r => other_guilds.push({
            value: r.id,
            label: r.name
        }));

        other_guilds.push({
            value: "0",
            label: "None"
        });
        return (
            <section className="other-guild-section">
                <Forms.FormTitle tag="h3">
                    Other Guilds
                </Forms.FormTitle>
                <br />
                <SearchableSelect
                    options={other_guilds}
                    placeholder="Select a guild to compare/filter"
                    value={settings.use(["other_guild"]).other_guild}
                    maxVisibleItems={5}
                    closeOnSelect={true}
                    onChange={v => settings.store.other_guild = v}
                />
                <br />
            </section>
        );
    }


    function UserFilter({ guild }: { guild: Guild; }) {
        const [page, setPage] = useState(1);

        const members = calculateMembers(guild);


        const pageSize = 9;
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;

        return (
            <div>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "10px",
                }}>
                    {members.slice(startIndex, endIndex).map(m => (
                        <UserCard member={m} key={m.userId}></UserCard>
                    ))}
                </div>
                <Paginator
                    pageSize={pageSize}
                    currentPage={page}
                    maxVisiblePages={4}
                    totalCount={members.length}
                    hideMaxPage={false}
                    onPageChange={newPage => setPage(newPage)}
                ></Paginator>
            </div>
        );

        function calculateMembers(guild: Guild): GuildMember[] {
            const filteredMembers: GuildMember[] = [];
            const targetRole = settings.use(["role"]).role;
            const targetGuild = settings.use(["other_guild"]).other_guild;

            for (const member of GuildMemberStore.getMembers(guild.id)) {
                let shouldAddMember = true;
                if (targetGuild !== "0") {
                    const existsInTargetGuild = GuildMemberStore
                        .getMembers(targetGuild)
                        .some(other_mem => other_mem.userId === member.userId);
                    shouldAddMember = existsInTargetGuild;
                }
                if (shouldAddMember && targetRole !== "0") {
                    const hasTargetRole = member.roles.includes(targetRole);

                    shouldAddMember = hasTargetRole;
                }

                if (shouldAddMember) {
                    filteredMembers.push(member);
                }
            }

            return filteredMembers;
        }
    }




    function UserCard({ member }: { member: GuildMember; }) {
        const user = UserStore.getUser(member.userId);
        const { joinedAt } = member;
        return (
            <Card style={{
                backgroundColor: "var(--background-secondary-alt)",
                color: "var(--interactive-active)",
                borderRadius: "8px",
                display: "block",
                height: "100%",
                padding: "12px",
                width: "100%",
                transition: "0.1s ease-out",
                transitionProperty: "box-shadow, transform, background, opacity",
                boxSizing: "border-box",
            }}>
                <Forms.FormTitle tag="h5">{user.username}</Forms.FormTitle>
                <Forms.FormText tag="p">ID: {member.userId}</Forms.FormText>
                <Forms.FormText tag="p">Nickname: {member.nick}</Forms.FormText>
                {(joinedAt !== undefined) ? <Forms.FormText tag="p">Joined at: {new Date(joinedAt).toDateString()}</Forms.FormText> : null}
                <Forms.FormText tag="p">Created at: {user.createdAt.toDateString()}</Forms.FormText>
            </Card>
        );
    }






    export default definePlugin({
        name: "Compare Servers",
        description: "Query tools to compare guilds",
        authors: [{ name: "Shell", id: 1056383259325513888n }],
        settings,

        start() {
            addContextMenuPatch("guild-context", GuildContext);
        },

        stop() {
            removeContextMenuPatch("guild-context", GuildContext);
        }
    });
