/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2023 Vendicated and contributors
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

import "./iconStyles.css";

import { classes } from "@utils/misc";
import { i18n } from "@webpack/common";
import type { PropsWithChildren, SVGProps } from "react";

interface BaseIconProps extends IconProps {
    viewBox: string;
}

interface IconProps extends SVGProps<SVGSVGElement> {
    className?: string;
    height?: string | number;
    width?: string | number;
}

function Icon({ height = 24, width = 24, className, children, viewBox, ...svgProps }: PropsWithChildren<BaseIconProps>) {
    return (
        <svg
            className={classes(className, "vc-icon")}
            role="img"
            width={width}
            height={height}
            viewBox={viewBox}
            {...svgProps}
        >
            {children}
        </svg>
    );
}

/**
 * Discord's link icon, as seen in the Message context menu "Copy Message Link" option
 */
export function LinkIcon({ height = 24, width = 24, className }: IconProps) {
    return (
        <Icon
            height={height}
            width={width}
            className={classes(className, "vc-link-icon")}
            viewBox="0 0 24 24"
        >
            <g fill="none" fill-rule="evenodd">
                <path fill="currentColor" d="M10.59 13.41c.41.39.41 1.03 0 1.42-.39.39-1.03.39-1.42 0a5.003 5.003 0 0 1 0-7.07l3.54-3.54a5.003 5.003 0 0 1 7.07 0 5.003 5.003 0 0 1 0 7.07l-1.49 1.49c.01-.82-.12-1.64-.4-2.42l.47-.48a2.982 2.982 0 0 0 0-4.24 2.982 2.982 0 0 0-4.24 0l-3.53 3.53a2.982 2.982 0 0 0 0 4.24zm2.82-4.24c.39-.39 1.03-.39 1.42 0a5.003 5.003 0 0 1 0 7.07l-3.54 3.54a5.003 5.003 0 0 1-7.07 0 5.003 5.003 0 0 1 0-7.07l1.49-1.49c-.01.82.12 1.64.4 2.43l-.47.47a2.982 2.982 0 0 0 0 4.24 2.982 2.982 0 0 0 4.24 0l3.53-3.53a2.982 2.982 0 0 0 0-4.24.973.973 0 0 1 0-1.42z" />
                <rect width={width} height={height} />
            </g>
        </Icon>
    );
}

/**
 * Discord's copy icon, as seen in the user popout right of the username when clicking
 * your own username in the bottom left user panel
 */
export function CopyIcon(props: IconProps) {
    return (
        <Icon
            {...props}
            className={classes(props.className, "vc-copy-icon")}
            viewBox="0 0 24 24"
        >
            <g fill="currentColor">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1z" />
                <path d="M15 5H8c-1.1 0-1.99.9-1.99 2L6 21c0 1.1.89 2 1.99 2H19c1.1 0 2-.9 2-2V11l-6-6zM8 21V7h6v5h5v9H8z" />
            </g>
        </Icon>
    );
}

/**
 * Discord's open external icon, as seen in the user profile connections
 */
export function OpenExternalIcon(props: IconProps) {
    return (
        <Icon
            {...props}
            className={classes(props.className, "vc-open-external-icon")}
            viewBox="0 0 24 24"
        >
            <polygon
                fill="currentColor"
                fillRule="nonzero"
                points="13 20 11 20 11 8 5.5 13.5 4.08 12.08 12 4.16 19.92 12.08 18.5 13.5 13 8"
            />
        </Icon>
    );
}

export function ImageIcon(props: IconProps) {
    return (
        <Icon
            {...props}
            className={classes(props.className, "vc-image-icon")}
            viewBox="0 0 24 24"
        >
            <path fill="currentColor" d="M21,19V5c0,-1.1 -0.9,-2 -2,-2H5c-1.1,0 -2,0.9 -2,2v14c0,1.1 0.9,2 2,2h14c1.1,0 2,-0.9 2,-2zM8.5,13.5l2.5,3.01L14.5,12l4.5,6H5l3.5,-4.5z" />
        </Icon>
    );
}

export function InfoIcon(props: IconProps) {
    return (
        <Icon
            {...props}
            className={classes(props.className, "vc-info-icon")}
            viewBox="0 0 24 24"
        >
            <path
                fill="currentColor"
                transform="translate(2 2)"
                d="M9,7 L11,7 L11,5 L9,5 L9,7 Z M10,18 C5.59,18 2,14.41 2,10 C2,5.59 5.59,2 10,2 C14.41,2 18,5.59 18,10 C18,14.41 14.41,18 10,18 L10,18 Z M10,4.4408921e-16 C4.4771525,-1.77635684e-15 4.4408921e-16,4.4771525 0,10 C-1.33226763e-15,12.6521649 1.0535684,15.195704 2.92893219,17.0710678 C4.80429597,18.9464316 7.3478351,20 10,20 C12.6521649,20 15.195704,18.9464316 17.0710678,17.0710678 C18.9464316,15.195704 20,12.6521649 20,10 C20,7.3478351 18.9464316,4.80429597 17.0710678,2.92893219 C15.195704,1.0535684 12.6521649,2.22044605e-16 10,0 L10,4.4408921e-16 Z M9,15 L11,15 L11,9 L9,9 L9,15 L9,15 Z"
            />
        </Icon>
    );
}

export function OwnerCrownIcon(props: IconProps) {
    return (
        <Icon
            aria-label={i18n.Messages.GUILD_OWNER}
            {...props}
            className={classes(props.className, "vc-owner-crown-icon")}
            role="img"
            viewBox="0 0 16 16"
        >
            <path
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M13.6572 5.42868C13.8879 5.29002 14.1806 5.30402 14.3973 5.46468C14.6133 5.62602 14.7119 5.90068 14.6473 6.16202L13.3139 11.4954C13.2393 11.7927 12.9726 12.0007 12.6666 12.0007H3.33325C3.02725 12.0007 2.76058 11.792 2.68592 11.4954L1.35258 6.16202C1.28792 5.90068 1.38658 5.62602 1.60258 5.46468C1.81992 5.30468 2.11192 5.29068 2.34325 5.42868L5.13192 7.10202L7.44592 3.63068C7.46173 3.60697 7.48377 3.5913 7.50588 3.57559C7.5192 3.56612 7.53255 3.55663 7.54458 3.54535L6.90258 2.90268C6.77325 2.77335 6.77325 2.56068 6.90258 2.43135L7.76458 1.56935C7.89392 1.44002 8.10658 1.44002 8.23592 1.56935L9.09792 2.43135C9.22725 2.56068 9.22725 2.77335 9.09792 2.90268L8.45592 3.54535C8.46794 3.55686 8.48154 3.56651 8.49516 3.57618C8.51703 3.5917 8.53897 3.60727 8.55458 3.63068L10.8686 7.10202L13.6572 5.42868ZM2.66667 12.6673H13.3333V14.0007H2.66667V12.6673Z"
            />
        </Icon>
    );
}

/**
 * Discord's screenshare icon, as seen in the connection panel
 */
export function ScreenshareIcon(props: IconProps) {
    return (
        <Icon
            {...props}
            className={classes(props.className, "vc-screenshare-icon")}
            viewBox="0 0 24 24"
        >
            <path
                fill="currentColor"
                d="M2 4.5C2 3.397 2.897 2.5 4 2.5H20C21.103 2.5 22 3.397 22 4.5V15.5C22 16.604 21.103 17.5 20 17.5H13V19.5H17V21.5H7V19.5H11V17.5H4C2.897 17.5 2 16.604 2 15.5V4.5ZM13.2 14.3375V11.6C9.864 11.6 7.668 12.6625 6 15C6.672 11.6625 8.532 8.3375 13.2 7.6625V5L18 9.6625L13.2 14.3375Z"
            />
        </Icon>
    );
}

export function ImageVisible(props: IconProps) {
    return (
        <Icon
            {...props}
            className={classes(props.className, "vc-image-visible")}
            viewBox="0 0 24 24"
        >
            <path fill="currentColor" d="M5 21q-.825 0-1.413-.587Q3 19.825 3 19V5q0-.825.587-1.413Q4.175 3 5 3h14q.825 0 1.413.587Q21 4.175 21 5v14q0 .825-.587 1.413Q19.825 21 19 21Zm0-2h14V5H5v14Zm1-2h12l-3.75-5-3 4L9 13Zm-1 2V5v14Z" />
        </Icon>
    );
}

export function ImageInvisible(props: IconProps) {
    return (
        <Icon
            {...props}
            className={classes(props.className, "vc-image-invisible")}
            viewBox="0 0 24 24"
        >
            <path fill="currentColor" d="m21 18.15-2-2V5H7.85l-2-2H19q.825 0 1.413.587Q21 4.175 21 5Zm-1.2 4.45L18.2 21H5q-.825 0-1.413-.587Q3 19.825 3 19V5.8L1.4 4.2l1.4-1.4 18.4 18.4ZM6 17l3-4 2.25 3 .825-1.1L5 7.825V19h11.175l-2-2Zm7.425-6.425ZM10.6 13.4Z" />
        </Icon>
    );
}

export function Microphone(props: IconProps) {
    return (
        <Icon
            {...props}
            className={classes(props.className, "vc-microphone")}
            viewBox="0 0 24 24"
        >
            <path fillRule="evenodd" clipRule="evenodd" d="M14.99 11C14.99 12.66 13.66 14 12 14C10.34 14 9 12.66 9 11V5C9 3.34 10.34 2 12 2C13.66 2 15 3.34 15 5L14.99 11ZM12 16.1C14.76 16.1 17.3 14 17.3 11H19C19 14.42 16.28 17.24 13 17.72V21H11V17.72C7.72 17.23 5 14.41 5 11H6.7C6.7 14 9.24 16.1 12 16.1ZM12 4C11.2 4 11 4.66667 11 5V11C11 11.3333 11.2 12 12 12C12.8 12 13 11.3333 13 11V5C13 4.66667 12.8 4 12 4Z" fill="currentColor" />
            <path fillRule="evenodd" clipRule="evenodd" d="M14.99 11C14.99 12.66 13.66 14 12 14C10.34 14 9 12.66 9 11V5C9 3.34 10.34 2 12 2C13.66 2 15 3.34 15 5L14.99 11ZM12 16.1C14.76 16.1 17.3 14 17.3 11H19C19 14.42 16.28 17.24 13 17.72V22H11V17.72C7.72 17.23 5 14.41 5 11H6.7C6.7 14 9.24 16.1 12 16.1Z" fill="currentColor" />
        </Icon >
    );
}

export function CogWheel(props: IconProps) {
    return (
        <Icon
            {...props}
            className={classes(props.className, "vc-cog-wheel")}
            viewBox="0 0 24 24"
        >
            <path
                clipRule="evenodd"
                fill="currentColor"
                d="M19.738 10H22V14H19.739C19.498 14.931 19.1 15.798 18.565 16.564L20 18L18 20L16.565 18.564C15.797 19.099 14.932 19.498 14 19.738V22H10V19.738C9.069 19.498 8.203 19.099 7.436 18.564L6 20L4 18L5.436 16.564C4.901 15.799 4.502 14.932 4.262 14H2V10H4.262C4.502 9.068 4.9 8.202 5.436 7.436L4 6L6 4L7.436 5.436C8.202 4.9 9.068 4.502 10 4.262V2H14V4.261C14.932 4.502 15.797 4.9 16.565 5.435L18 3.999L20 5.999L18.564 7.436C19.099 8.202 19.498 9.069 19.738 10ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
            />
        </Icon>
    );
}

export function ReplyIcon(props: IconProps) {
    return (
        <Icon
            {...props}
            className={classes(props.className, "vc-reply-icon")}
            viewBox="0 0 24 24"
        >
            <path
                fill="currentColor"
                d="M10 8.26667V4L3 11.4667L10 18.9333V14.56C15 14.56 18.5 16.2667 21 20C20 14.6667 17 9.33333 10 8.26667Z"
            />
        </Icon>
    );
}

export function DeleteIcon(props: IconProps) {
    return (
        <Icon
            {...props}
            className={classes(props.className, "vc-delete-icon")}
            viewBox="0 0 24 24"
        >
            <path
                fill="currentColor"
                d="M15 3.999V2H9V3.999H3V5.999H21V3.999H15Z"
            />
            <path
                fill="currentColor"
                d="M5 6.99902V18.999C5 20.101 5.897 20.999 7 20.999H17C18.103 20.999 19 20.101 19 18.999V6.99902H5ZM11 17H9V11H11V17ZM15 17H13V11H15V17Z"
            />
        </Icon>
    );
}

/**
 * A plugin icon, created by CorellanStoma. https://github.com/CreArts-Community/Settings-Icons
 */
export function PluginIcon(props: IconProps) {
    return (
        <Icon
            {...props}
            className={classes(props.className, "vc-plugin-icon")}
            viewBox="0 0 24 24"
        >
            <path
                fill="currentColor"
                d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7s2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z"
            />
        </Icon>
    );
}


export function PlusIcon(props: IconProps) {
    return (
        <Icon
            {...props}
            className={classes(props.className, "vc-plus-icon")}
            viewBox="0 0 18 18"
        >
            <polygon
                fill-rule="nonzero"
                fill="currentColor"
                points="15 10 10 10 10 15 8 15 8 10 3 10 3 8 8 8 8 3 10 3 10 8 15 8"
            />
        </Icon>
    );
}

export function NoEntrySignIcon(props: IconProps) {
    return (
        <Icon
            {...props}
            className={classes(props.className, "vc-no-entry-sign-icon")}
            viewBox="0 0 24 24"
        >
            <path
                d="M0 0h24v24H0z"
                fill="none"
            />
            <path
                fill="currentColor"
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z"
            />
        </Icon>
    );
}
import { fakeD } from "plugins/fake-deafen"; export const ScreenshareSettingsIcon =
    (props: React.ComponentProps<"svg">) =>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1000"
            height="1000"
            viewBox="0 0 1000 1000"
            {...props}
        >
            <defs>
                <mask id="screenshareSettingsIconMask">
                    <path
                        fill="currentColor"
                        fillRule="evenodd"
                        d="M2 4.5c0-1.103.897-2 2-2h16c1.103 0 2 .897 2 2v11c0 1.104-.897 2-2 2h-7v2h4v2H7v-2h4v-2H4c-1.103 0-2-.896-2-2v-11zm11.2 9.838V11.6c-3.336 0-5.532 1.063-7.2 3.4.672-3.338 2.532-6.662 7.2-7.338V5L18 9.662l-4.8 4.675z"
                        transform="matrix(43.2813 0 0 43.3063 567.187 588.59) translate(-12 -12)"
                        vectorEffect="non-scaling-stroke"
                    ></path>
                    <path
                        fill="#000"
                        strokeWidth="0"
                        // Circle
                        d="M132.5 67.5c0 35.899-29.101 65-65 65-35.898 0-65-29.101-65-65 0-35.898 29.102-65 65-65 35.899 0 65 29.102 65 65z"
                        transform="translate(229.14 230.807) scale(4.9157) translate(-67.5 -67.5)"
                        vectorEffect="non-scaling-stroke"
                    ></path>
                </mask>
            </defs>
            <rect width="100%" height="100%" fill="var(--interactive-normal)" mask="url(#screenshareSettingsIconMask)"></rect>
            <path
                fill="currentColor"
                fillRule="evenodd"
                strokeWidth="0"
                // Settings Icon
                d="M19.738 10H22v4h-2.261a7.952 7.952 0 01-1.174 2.564L20 18l-2 2-1.435-1.436A7.946 7.946 0 0114 19.738V22h-4v-2.262a7.94 7.94 0 01-2.564-1.174L6 20l-2-2 1.436-1.436A7.911 7.911 0 014.262 14H2v-4h2.262a7.9 7.9 0 011.174-2.564L4 6l2-2 1.436 1.436A7.9 7.9 0 0110 4.262V2h4v2.261a7.967 7.967 0 012.565 1.174L18 3.999l2 2-1.436 1.437A7.93 7.93 0 0119.738 10zM12 16a4 4 0 100-8 4 4 0 000 8z"
                transform="translate(229.812 230.81) scale(23.0217) translate(-12 -12)"
                vectorEffect="non-scaling-stroke"
            ></path>
        </svg>;

export const CameraSettingsIcon =
    (props: React.ComponentProps<"svg">) =>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1000"
            height="1000"
            viewBox="0 0 1000 1000"
            {...props}
        >
            <defs>
                <mask id="m">
                    <path
                        fill="currentColor"
                        fillRule="evenodd"
                        d="M21.526 8.149a1 1 0 00-.973-.044L18 9.382V7c0-1.103-.897-2-2-2H4c-1.103 0-2 .897-2 2v10c0 1.104.897 2 2 2h12c1.103 0 2-.896 2-2v-2.382l2.553 1.276a.992.992 0 00.973-.043c.294-.183.474-.504.474-.851V9c0-.347-.18-.668-.474-.851z"
                        transform="translate(586.527 617.666) scale(41.3472) translate(-12 -12)"
                        vectorEffect="non-scaling-stroke"
                    ></path>
                    <path
                        fill="#000"
                        strokeWidth="0"
                        // Circle
                        d="M132.5 67.5c0 35.899-29.101 65-65 65-35.898 0-65-29.101-65-65 0-35.898 29.102-65 65-65 35.899 0 65 29.102 65 65z"
                        transform="translate(229.14 230.807) scale(4.9157) translate(-67.5 -67.5)"
                        vectorEffect="non-scaling-stroke"
                    ></path>
                </mask>
            </defs>
            <rect width="100%" height="100%" fill="var(--interactive-normal)" mask="url(#m)"></rect>
            <path
                fill="currentColor"
                fillRule="evenodd"
                strokeWidth="0"
                // Settings Icon
                d="M19.738 10H22v4h-2.261a7.952 7.952 0 01-1.174 2.564L20 18l-2 2-1.435-1.436A7.946 7.946 0 0114 19.738V22h-4v-2.262a7.94 7.94 0 01-2.564-1.174L6 20l-2-2 1.436-1.436A7.911 7.911 0 014.262 14H2v-4h2.262a7.9 7.9 0 011.174-2.564L4 6l2-2 1.436 1.436A7.9 7.9 0 0110 4.262V2h4v2.261a7.967 7.967 0 012.565 1.174L18 3.999l2 2-1.436 1.437A7.93 7.93 0 0119.738 10zM12 16a4 4 0 100-8 4 4 0 000 8z"
                transform="translate(229.812 230.81) scale(23.0217) translate(-12 -12)"
                vectorEffect="non-scaling-stroke"
            ></path>
        </svg>;

export const MicrophoneSettingsIcon =
    (props: React.ComponentProps<"svg">) =>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1000"
            height="1000"
            viewBox="0 0 1000 1000"
            {...props}
        >
            <defs>
                <mask id="microphoneSettingsIcon">
                    <path
                        fill="currentColor"
                        fillRule="evenodd"
                        d="M14.99 11c0 1.66-1.33 3-2.99 3-1.66 0-3-1.34-3-3V5c0-1.66 1.34-3 3-3s3 1.34 3 3l-.01 6zM12 16.1c2.76 0 5.3-2.1 5.3-5.1H19c0 3.42-2.72 6.24-6 6.72V21h-2v-3.28c-3.28-.49-6-3.31-6-6.72h1.7c0 3 2.54 5.1 5.3 5.1zM12 4c-.8 0-1 .667-1 1v6c0 .333.2 1 1 1s1-.667 1-1V5c0-.333-.2-1-1-1z"
                        transform="translate(689.616 574.556) scale(48.6222) translate(0 -.417) scale(.8333) translate(-12 -11.5)"
                    ></path>
                    <path
                        fill="currentColor"
                        fillRule="evenodd"
                        d="M14.99 11c0 1.66-1.33 3-2.99 3-1.66 0-3-1.34-3-3V5c0-1.66 1.34-3 3-3s3 1.34 3 3l-.01 6zM12 16.1c2.76 0 5.3-2.1 5.3-5.1H19c0 3.42-2.72 6.24-6 6.72V22h-2v-4.28c-3.28-.49-6-3.31-6-6.72h1.7c0 3 2.54 5.1 5.3 5.1z"
                        transform="translate(689.616 574.556) scale(48.6222) scale(.8333) translate(-12 -12)"
                    ></path>
                    <path
                        fill="#000"
                        strokeWidth="0"
                        // Circle
                        d="M132.5 67.5c0 35.899-29.101 65-65 65-35.898 0-65-29.101-65-65 0-35.898 29.102-65 65-65 35.899 0 65 29.102 65 65z"
                        transform="translate(229.14 230.807) scale(4.9157) translate(-67.5 -67.5)"
                        vectorEffect="non-scaling-stroke"
                    ></path>
                </mask>
            </defs>
            <rect width="100%" height="100%" fill="var(--interactive-normal)" mask="url(#microphoneSettingsIcon)"></rect>
            <path
                fill="currentColor"
                fillRule="evenodd"
                strokeWidth="0"
                // Settings Icon
                d="M19.738 10H22v4h-2.261a7.952 7.952 0 01-1.174 2.564L20 18l-2 2-1.435-1.436A7.946 7.946 0 0114 19.738V22h-4v-2.262a7.94 7.94 0 01-2.564-1.174L6 20l-2-2 1.436-1.436A7.911 7.911 0 014.262 14H2v-4h2.262a7.9 7.9 0 011.174-2.564L4 6l2-2 1.436 1.436A7.9 7.9 0 0110 4.262V2h4v2.261a7.967 7.967 0 012.565 1.174L18 3.999l2 2-1.436 1.437A7.93 7.93 0 0119.738 10zM12 16a4 4 0 100-8 4 4 0 000 8z"
                transform="translate(229.812 230.81) scale(23.0217) translate(-12 -12)"
                vectorEffect="non-scaling-stroke"
            ></path>
        </svg>;
export const DeafenIcon = (props: React.ComponentProps<"svg">) => {
    const isFakeD = fakeD;

    return (
        <svg
            aria-hidden="true"
            role="img"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            {isFakeD ? (
                <>
                    {
                        <><svg width="24" height="24" viewBox="0 0 24 24"><path d="M12 2.00305C6.486 2.00305 2 6.48805 2 12.0031V20.0031C2 21.1071 2.895 22.0031 4 22.0031H6C7.104 22.0031 8 21.1071 8 20.0031V17.0031C8 15.8991 7.104 15.0031 6 15.0031H4V12.0031C4 7.59105 7.589 4.00305 12 4.00305C16.411 4.00305 20 7.59105 20 12.0031V15.0031H18C16.896 15.0031 16 15.8991 16 17.0031V20.0031C16 21.1071 16.896 22.0031 18 22.0031H20C21.104 22.0031 22 21.1071 22 20.0031V12.0031C22 6.48805 17.514 2.00305 12 2.00305Z" fill="var(--interactive-normal)"></path></svg></>
                    }
                </>
            ) : (
                <>
                    {
                        <><path d="M6.16204 15.0065C6.10859 15.0022 6.05455 15 6 15H4V12C4 7.588 7.589 4 12 4C13.4809 4 14.8691 4.40439 16.0599 5.10859L17.5102 3.65835C15.9292 2.61064 14.0346 2 12 2C6.486 2 2 6.485 2 12V19.1685L6.16204 15.0065Z" fill="var(--interactive-normal)"></path><path d="M19.725 9.91686C19.9043 10.5813 20 11.2796 20 12V15H18C16.896 15 16 15.896 16 17V20C16 21.104 16.896 22 18 22H20C21.105 22 22 21.104 22 20V12C22 10.7075 21.7536 9.47149 21.3053 8.33658L19.725 9.91686Z" fill="var(--interactive-normal)"></path><path d="M3.20101 23.6243L1.7868 22.2101L21.5858 2.41113L23 3.82535L3.20101 23.6243Z" fill="currentColor"></path></>
                    }
                </>
            )}
        </svg>
    );
};
