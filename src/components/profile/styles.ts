import { Theme } from "@material-ui/core";
import { createStyles, withStyles } from "@material-ui/styles";
import { css } from "@emotion/react";

const profileStyles = (theme: Theme) =>
    createStyles({
        root: {
            fontFamily: "'Space Mono', monospace"
        },
        centerBox: {
            position: "absolute",
            width: "600px",
            height: "50px",
            top: "120px",
            left: "50%",
            marginTop: "-25px",
            marginLeft: "-50px"
        },
        startCodingButton: {
            fontSize: "22px",
            border: "4px solid #518C82",
            borderRadius: "80%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "220px",
            height: "220px",
            textDecoration: "none",
            background: "#00DFCB"
        }
    });

const withStyles_ = (ClassComponent: any) =>
    withStyles(profileStyles)(ClassComponent);

export default withStyles_;

export const iconPreviewBox = css`
    margin-left: -16px;
    margin-top: -16px;
    border-radius: 50%;
    width: 62px;
    height: 62px;
    padding: 28px;
    justify-content: center;
    cursor: pointer;
`;

export const showAvatarPlayButton = css`
    .projectIcon {
        opacity: 0;
    }
    .listPlayIcon {
        opacity: 1;
    }
    transform: rotate(90deg);
    cursor: pointer;
    box-shadow: none;
`;

export const avatar = css`
    align-self: center;
    pointer-events: visible;
    width: 64px;
    height: 64px;

    .listPlayIcon {
        opacity: 0;
        transition: opacity 1s ease-out;
        transform: translate(0px, -3px) rotate(-90deg);
        &:hover {
            z-index: 10;
        }
    }
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    transition: color 0.2s ease, background-color 0.2s ease, transform 0.3s ease;
    &:after {
        content: "";
        width: 100%;
        height: 100%;
        transform: scale(0.8);
        position: absolute;
        top: -2px;
        left: -2px;
        border-radius: 50%;
        transition: all 0.3s ease;
    }
    &:hover:after {
        transform: scale(2);
        box-shadow: 10px 0 20px rgba(0, 0, 0, 0.19),
            6px 0 6px rgba(0, 0, 0, 0.23);
    }
    &:hover {
        ${showAvatarPlayButton}
        background-color: black!important;
    }
`;

export const avatarIconForeground = (foregroundColor: string) => css`
    & path {
        fill: ${foregroundColor};
    }
    & path:first-of-type {
        fill: black;
    }
    & path:last-of-type {
        fill: ${foregroundColor};
    }
`;

export const avatarIcon = (foregroundColor: string) => css`
    width: calc(100% - 32px);
    height: calc(100% - 32px);
    ${avatarIconForeground(foregroundColor)}
`;

export const previewAvatarColor = (foregroundColor: string) => css`
    & > svg {
        ${avatarIconForeground(foregroundColor)}
    }
`;

export const loadingSpinner = (theme) => css`
@keyframes cricle {
  from {
    transform: rotate(-25deg);
  }
  to {
    transform: rotate(335deg);
  }
}
    padding-right: 25px;
    padding-bottom: 25px;
    position: absolute;

    & > span {
      display: inline-block;
      position: absolute;
      border-radius: 100px;
      padding: 8px;
      border: 5px solid transparent;

      animation: cricle 1s ease-in-out infinite;
      border-top: 5px solid ${theme.allowed};

      &:nth-of-type(1) {
        animation-delay: -0.15s;
      }

`;

export const pauseIcon = (theme) => css`
    position: absolute;
    transform: rotate(90deg);
    cursor: pointer;
    border-color: ${theme.allowed};
    border-style: double;
    border-width: 0px 0 0px 20px;
    height: 26px;
`;

export const settingsIconContainer = css`
    position: absolute;
    top: calc(50% - 24px);
    right: 66px;
`;

export const settingsIcon = (theme) => css`
    align-self: center;
    width: 42px;
    height: 42px;
    display: flex;
    justify-content: center;
    box-shadow: 0 1px 3px black, 0 1px 2px black;
    transition: color 0.2s ease, background-color 0.2s ease, transform 0.3s ease;
    background-color: ${theme.highlightBackgroundAlt};
    color: ${theme.settingsIcon};
    position: relative;
    border-radius: 50%;
    padding: 6px;
    margin: 4px;

    &:after {
        content: "";
        width: 100%;
        height: 100%;
        border: solid 2px;
        position: absolute;
        top: 0px;
        left: 0px;
        border-radius: 50%;
        transition: all 0.3s ease;
    }
    &:hover {
        background-color: ${theme.settingsIcon};
        color: ${theme.settingsIcon};
        border-color: ${theme.highlightBackgroundAlt};
        background-color: transparent;
        transform: rotate(90deg);
        cursor: pointer;
        box-shadow: none;
    }
    &:hover:after {
        transform: scale(1);
        box-shadow: 10px 0 20px rgba(0, 0, 0, 0.49),
            6px 0 6px rgba(0, 0, 0, 0.53);
    }
    &:active {
        bottom: -2px;
    }

    & > svg {
        align-self: center;
        width: 100%;
        height: 100%;
    }
`;

export const deleteIconContainer = css`
    ${settingsIconContainer}
    right: 12px;
`;

export const deleteIcon = (theme) => css`
    align-self: center;
    width: 42px;
    height: 42px;
    display: flex;
    justify-content: center;
    box-shadow: 0 1px 3px black, 0 1px 2px black;
    transition: color 0.2s ease, background-color 0.2s ease, transform 0.5s ease;
    background-color: ${theme.highlightBackgroundAlt};
    color: ${theme.errorText};
    position: relative;
    border-radius: 50%;
    padding: 6px;
    margin: 4px;

    &:after {
        content: "";
        width: 100%;
        height: 100%;
        border: solid 2px;
        position: absolute;
        top: 0px;
        left: 0px;
        border-radius: 50%;
        transition: all 1s ease;
        & svg {
            transition: all 1s ease;
        }
    }
    &:hover {
        background-color: ${theme.errorText};
        color: ${theme.errorText};
        border-color: ${theme.highlightBackgroundAlt};
        background-color: transparent;
        cursor: pointer;
        box-shadow: none;
        & svg {
            transform: scale(1.1);
        }
    }
    &:hover:after {
        box-shadow: 10px 0 20px rgba(0, 0, 0, 0.49),
            6px 0 6px rgba(0, 0, 0, 0.53);
    }
    &:active {
        bottom: -2px;
    }

    & > svg {
        align-self: center;
        width: 100%;
        height: 100%;
    }
`;

export const publicIconContainer = css`
    position: absolute;
    top: calc(50% - 24px);
    right: 120px;
`;

export const publicIcon = (theme) => css`
    ${deleteIcon(theme)}
    color: ${theme.altButtonBackground};
    &:hover {
        color: ${theme.altButtonBackground};
        & svg {
            transform: scale(1.1, 0.9);
        }
    }
`;
