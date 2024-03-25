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

interface Option {
    value: string;
    label: string;
}

function RoleKey({ guild }: { guild: Guild; }) {
    const selectedRoleValue = settings.use(["role"]).role;
    const roles: Option[] = Object.values(guild.roles).map(r => ({
        value: r.id,
        label: r.name
    }));

    // Adjust here: Use `undefined` instead of `null`
    const selectedRoleOption = roles.find(role => role.value === selectedRoleValue) || undefined;

    return (
        <section className="role-section">
            <Forms.FormTitle tag="h3">Roles</Forms.FormTitle>
            <br />
            <SearchableSelect
                options={roles}
                placeholder="Select a role to filter"
                value={selectedRoleOption} // Now properly undefined if not found
                maxVisibleItems={5}
                closeOnSelect={true}
                onChange={(option: Option | null) => settings.store.role = option?.value}
            />
            <br />
        </section>
    );
}


function OtherGuildKey({ guild }: { guild: Guild; }) {
    const selectedOtherGuildValue = settings.use(["other_guild"]).other_guild;
    const other_guilds: Option[] = Object.values(GuildStore.getGuilds()).map(g => ({
        value: g.id,
        label: g.name
    })).concat({ value: "0", label: "None" });

    // Adjust here: Use `undefined` instead of `null`
    const selectedOtherGuildOption = other_guilds.find(guild => guild.value === selectedOtherGuildValue) || undefined;

    return (
        <section className="other-guild-section">
            <Forms.FormTitle tag="h3">Other Guilds</Forms.FormTitle>
            <br />
            <SearchableSelect
                options={other_guilds}
                placeholder="Select a guild to compare/filter"
                value={selectedOtherGuildOption} // Now properly undefined if not found
                maxVisibleItems={5}
                closeOnSelect={true}
                onChange={(option: Option | null) => settings.store.other_guild = option?.value}
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
        // Initialize an empty array for filtered members.
        const filteredMembers: GuildMember[] = [];

        // Exit early if guild.id is not available, returning an empty array.
        if (!guild.id) return filteredMembers;

        // Retrieve settings values.
        const targetRole = settings.use(["role"]).role;
        const targetGuild = settings.use(["other_guild"]).other_guild;

        // Iterate through all members of the guild.
        for (const member of GuildMemberStore.getMembers(guild.id)) {
            // Assume the member should be added initially.
            let shouldAddMember = true;

            // Check if the member exists in the target guild (if specified).
            if (targetGuild && targetGuild !== "0") {
                const existsInTargetGuild = GuildMemberStore.getMembers(targetGuild)
                    .some(other_mem => other_mem.userId === member.userId);
                shouldAddMember = existsInTargetGuild;
            }

            // Further filter members based on the target role (if specified).
            if (shouldAddMember && targetRole !== "0") {
                const hasTargetRole = member.roles.includes(targetRole || "");

                shouldAddMember = hasTargetRole;
            }

            // If the member passes all checks, add them to the filtered list.
            if (shouldAddMember) {
                filteredMembers.push(member);
            }
        }

        // Return the filtered list of members.
        return filteredMembers;
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






}
