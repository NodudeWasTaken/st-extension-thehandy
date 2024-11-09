import { extension_settings } from "../../../extensions.js";

export const extensionName = "st-extension-thehandy";
export const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;
export const extensionSettings = extension_settings[extensionName];
export const defaultSettings = {
	key: "",
	maxrun: 30000,
	maxspeed: 80
};

export function regulateSpeed(value) {
	return value / 100*extensionSettings.maxspeed
}
