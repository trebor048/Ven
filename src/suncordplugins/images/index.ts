/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ApplicationCommandOptionType } from "@api/Commands";
import definePlugin from "@utils/types";

import { subredditChoices } from "./subredditchoices";

function rand(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function fetchReddit(sub: string, sort: string = "top") {
    let imageUrl: string | null = null;

    do {
        const url = `https://www.reddit.com/r/${sub}/${sort}.json?limit=200`;
        const res = await fetch(url);
        const resp = await res.json();
        try {
            const { children } = resp.data;
            const r = rand(0, children.length - 1);
            const candidateUrl = children[r].data.url;

            // Check if the URL ends with a common image file extension
            if (/\.(jpg|jpeg|png|gif)$/i.test(candidateUrl)) {
                imageUrl = candidateUrl;
            } else {
                // Skip this URL and continue fetching
                console.log("Skipping non-image URL:", candidateUrl);
            }
        } catch (err) {
            console.error(resp);
            console.error(err);
            imageUrl = "Error fetching image.";
        }
    } while (!imageUrl); // Repeat until a valid image URL is found

    return imageUrl!;
}

export default definePlugin({
    name: "Reddit-Images",
    authors: [{
        id: 995923917594173440n,
        name: "LuckyCanucky"
    }],
    description: "Add a command to send femboy images from Reddit",
    dependencies: ["CommandsAPI"],
    commands: [{
        name: "Reddit-Image",
        description: "Send images from Reddit",
        options: [
            {
                name: "subreddit",
                description: "Specify the subreddit",
                type: ApplicationCommandOptionType.STRING,
                required: true,
                choices: subredditChoices,
            },
            {
                name: "sort",
                description: "Sort posts by (hot, new, top, etc.)",
                type: ApplicationCommandOptionType.STRING,
                required: false,
                choices: [
                    {
                        label: "Hot", value: "hot",
                        name: "hot"
                    },
                    {
                        label: "New", value: "new",
                        name: "new"
                    },
                    {
                        label: "Top", value: "top",
                        name: "top"
                    },
                    {
                        label: "Rising", value: "rising",
                        name: "rising"
                    },
                    {
                        label: "Controversial", value: "controversial",
                        name: "controversial"
                    },
                    {
                        label: "Best", value: "best",
                        name: "best"
                    }

                ],
            },
            {
                name: "count",
                description: "Number of images to send (1-5)",
                type: ApplicationCommandOptionType.INTEGER,
                required: false,
                choices: [
                    {
                        label: "1", value: "1",
                        name: "1"
                    },
                    {
                        label: "2", value: "2",
                        name: "2"
                    },
                    {
                        label: "3", value: "3",
                        name: "3"
                    },
                    {
                        label: "4", value: "4",
                        name: "4"
                    },
                    {
                        label: "5", value: "5",
                        name: "5"
                    }
                ],
            },
        ],
        async execute(args) {
            const sort = args.find(arg => arg.name === "sort")?.value ?? "hot";
            const subreddit = args.find(arg => arg.name === "subreddit")?.value ?? "furrymemes";
            const count = parseInt(args.find(arg => arg.name === "count")?.value ?? "1");
            const imageUrls: string[] = []; // Correct syntax for initializing an array of strings
            for (let i = 0; i < count; i++) {
                const imageUrl = await fetchReddit(subreddit, sort);
                if (imageUrl !== "Error fetching image.") {
                    imageUrls.push(imageUrl);
                }
            }

            return {
                content: imageUrls.length > 0 ? imageUrls.join("\n") : "No images found."
            };
        }
    }]
});
