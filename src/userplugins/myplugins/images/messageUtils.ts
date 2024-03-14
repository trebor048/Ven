/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export const handlePreSendMessage = async (channelId: string, messageObj: any, extra: any): Promise<void> => {
    if (messageObj.content.startsWith("/")) {
        console.log("Intercepted a slash command response, handling accordingly.");
        console.log("Sending message content:", messageObj.content);
    }
};
