import {
    KeyMapOptions,
    ExtendedKeyMapOptions,
    MouseTrapKeySequence
} from "react-hotkeys";

const PREFIX = "HOTKEYS.";

// export const SET_MENU_BAR_HOTKEYS = PREFIX + "SET_MENU_BAR_HOTKEYS";
export const STORE_PROJECT_EDITOR_KEYBOARD_CALLBACKS =
    PREFIX + "STORE_PROJECT_EDITOR_KEYBOARD_CALLBACKS";

export const STORE_EDITOR_KEYBOARD_CALLBACKS =
    PREFIX + "STORE_EDITOR_KEYBOARD_CALLBACKS";

interface StoreProjectEditorKeyboardCallbacks {
    type: typeof STORE_PROJECT_EDITOR_KEYBOARD_CALLBACKS;
    callbacks: IProjectEditorCallbacks;
}

export type HotKeysActionTypes = StoreProjectEditorKeyboardCallbacks;

type AnyCallback = (...arguments_: any[]) => any;
type CallbackOrUnbound = AnyCallback | null;

export interface IProfileCallbacks {
    new_project?: CallbackOrUnbound;
}

export interface IProjectEditorCallbacks {
    add_file?: CallbackOrUnbound;
    new_document?: CallbackOrUnbound;
    pause_playback?: CallbackOrUnbound;
    open_target_config_dialog?: CallbackOrUnbound;
    run_project?: CallbackOrUnbound;
    save_all_documents?: CallbackOrUnbound;
    save_document?: CallbackOrUnbound;
    save_and_close?: CallbackOrUnbound;
    stop_playback?: CallbackOrUnbound;
}

export interface IEditorCallbacks {
    doc_at_point?: CallbackOrUnbound;
    find_simple?: CallbackOrUnbound;
    undo?: CallbackOrUnbound;
    redo?: CallbackOrUnbound;
}

export type IHotKeysCallbacks = IEditorCallbacks &
    IProfileCallbacks &
    IProjectEditorCallbacks;

export type HotKeySequence =
    | string
    | string[]
    | KeyMapOptions
    | ExtendedKeyMapOptions
    | MouseTrapKeySequence[]
    | KeyMapOptions[]
    | undefined;

export type BindingsMap = { [key in keyof IHotKeysCallbacks]?: HotKeySequence };
