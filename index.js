// The main script for the extension
// The following are examples of some basic extension functionality

//You'll likely need to import extension_settings, getContext, and loadExtensionSettings from extensions.js
import { extension_settings, getContext, loadExtensionSettings } from "../../../extensions.js";

//You'll likely need to import some other functions from the main script
import { saveSettingsDebounced, eventSource, event_types, chat } from "../../../../script.js";

import Handy from "./defucilis_thehandy.js";

// Keep track of where your extension is located, name should match repo name
const extensionName = "st-extension-example";
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;
const extensionSettings = extension_settings[extensionName];
const defaultSettings = {
	handy_key: ""
};


const stroke = /stroke\((\d+)\)/;
const slide = /slide\((\d+),(\d+)\)/;

const handy = new Handy.default();


eventSource.on(event_types.MESSAGE_RECEIVED, handleIncomingMessage);
// For debug
eventSource.on(event_types.MESSAGE_UPDATED, handleIncomingMessage);

async function handleIncomingMessage(dataId) {
	const msg = chat[dataId].mes
    console.log("extension msg: ", msg)
	const mstroke = msg.match(stroke)
	if (mstroke) {
		const regulated = Math.max(Math.min(mstroke[1],100),0)
		console.log("stroke: ", mstroke, regulated)
		await handy.setHampVelocity(regulated);
	}
	const mslide = msg.match(slide)
	if (mslide) {
		const minregulated = Math.max(Math.min(mstroke[1],100),0)
		const maxregulated = Math.max(Math.min(mstroke[2],100),0)
		console.log("slide: ", mslide, minregulated, maxregulated)
		await handy.setSlideSettings(minregulated,maxregulated)
	}
}

// Loads the extension settings if they exist, otherwise initializes them to the defaults.
async function loadSettings() {
  //Create the settings if they don't exist
  extension_settings[extensionName] = extension_settings[extensionName] || {};
  if (Object.keys(extension_settings[extensionName]).length === 0) {
    Object.assign(extension_settings[extensionName], defaultSettings);
  }

  handy.connectionKey = extension_settings[extensionName].handy_key;

  // Updating settings in the UI
  $("#handykey_setting").prop("value", extension_settings[extensionName].handy_key).trigger("input");
}

// This function is called when the extension settings are changed in the UI
function onExampleInput(event) {
  const value = Boolean($(event.target).prop("value"));
  extension_settings[extensionName].handy_key = value;
  handy.connectionKey = value;
  console.log("updated handy key")
  saveSettingsDebounced();
}

function setStatusColor(isred) {
	const statusDot = document.getElementById('thehandy-status');
  
	if (!isred) {
		statusDot.classList.remove('dot-red');
		statusDot.classList.add('dot-green');
	} else {
		statusDot.classList.remove('dot-green');
		statusDot.classList.add('dot-red');
	}
}

// This function is called when the button is clicked
async function onButtonClick() {
	// You can do whatever you want here
	// Let's make a popup appear with the checked setting

	//you can request info about the Handy
	try {
		const info = await handy.getInfo();
		console.log(`Handy conneted with firmware ${info.fwVersion}`);

		//you can send requests to the Handy API
		await handy.setMode(HandyMode.hamp);
		await handy.setHampStart();
		setStatusColor(false)

		toastr.info(
			`Connected!`,
			"Handy Status"
		);
	} catch (e) {
		setStatusColor(true)
		toastr.info(
			`Not connected error: ${e}!`,
			`Handy Status`
		);
	}
}

// This function is called when the extension is loaded
jQuery(async () => {
  // This is an example of loading HTML from a file
  const settingsHtml = await $.get(`${extensionFolderPath}/example.html`);

  // Append settingsHtml to extensions_settings
  // extension_settings and extensions_settings2 are the left and right columns of the settings menu
  // Left should be extensions that deal with system functions and right should be visual/UI related 
  $("#extensions_settings").append(settingsHtml);

  // These are examples of listening for events
  $("#my_button").on("click", onButtonClick);
  $("#handykey_setting").on("input", onExampleInput);

  // Load settings when starting things up (if you have any)
  loadSettings();
});
