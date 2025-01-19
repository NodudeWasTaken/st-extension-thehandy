// The main script for the extension
// The following are examples of some basic extension functionality

//You'll likely need to import extension_settings, getContext, and loadExtensionSettings from extensions.js
import { extension_settings, getContext, loadExtensionSettings } from "../../../extensions.js";

//You'll likely need to import some other functions from the main script
import { saveSettingsDebounced, eventSource, event_types, chat } from "../../../../script.js";

import Handy from "./defucilis_thehandy.js";
import { regulateSpeed, extensionName, extensionFolderPath, defaultSettings, extensionSettings } from "./utils.js";
import { aichat_cmd } from "./aichat_extension.js";

// Keep track of where your extension is located, name should match repo name

var cmdtable = [
	{
		command: /stroke\((\d+)\)/,
		func: async (match,handy) => {
			var regulated = Math.max(Math.min(match[1],100),0)
			regulated = regulateSpeed(regulated)
			console.log(match, regulated)
			await handy.setHampStart();
			await handy.setHampVelocity(regulated);
		}
	},
	{
		command: /slide\((\d+),(\d+)\)/,
		func: async (match,handy) => {
			var minr = Math.max(Math.min(match[1],100),0)
			var maxr = Math.max(Math.min(match[2],100),0)
			console.log(match, minr, maxr)
			await handy.setHampStart();
			await handy.setStrokeZone(minr,maxr)
		}
	},
];

eventSource.on(event_types.MESSAGE_RECEIVED, handleIncomingMessage);
eventSource.on(event_types.SMOOTH_STREAM_TOKEN_RECEIVED, handleSmoothMessage);
// For debug
eventSource.on(event_types.MESSAGE_UPDATED, handleIncomingMessage);

let running = false
let timer;
const handy = new Handy.default();
async function handleCommand(msg) {
	if (!getActive()) {
		return
	}

	try {
		var matched = false

		for (const x of cmdtable) { 
			const match = msg.match(x.command)
			matched = matched || match
			if (match) {
				await x.func(match,handy)
			}
		}

		if (matched) {
			const delay = Number(extensionSettings.maxrun)
			console.log("handy delay", delay)

			// Clear the previous timer to prevent the execution of 'mainFunction'
			clearTimeout(timer);
		
			// Set a new timer that will execute 'mainFunction' after the specified delay
			timer = setTimeout(() => {
				console.log("handy stop")
				handy.setHampStop().then(() => {
					running = false
				})
			}, delay);
		}

		return matched
	} catch (e) {
		console.log("handleIncomingMessage error", e)
		toastr.info(
			`handleIncomingMessage error: ${e}!`,
			`Handy Script`
		);
	}

	return false
}

let readBuffer = ""
async function handleSmoothMessage(dataId) {
	readBuffer += dataId
	if (await handleCommand(readBuffer)) {
		console.log("smooth msg: ", readBuffer)
		readBuffer = ""
	}
}

async function handleIncomingMessage(dataId) {
	const msg = chat[dataId].mes
	console.log("extension msg: ", chat[dataId])
	await handleCommand(msg)
	readBuffer = ""
}

// Loads the extension settings if they exist, otherwise initializes them to the defaults.
async function loadSettings() {
  //Create the settings if they don't exist
  extension_settings[extensionName] = extension_settings[extensionName] || defaultSettings;
  handy.connectionKey = extensionSettings.key;

  // Updating settings in the UI
  $("#handykey_setting").prop("value", extensionSettings.key).trigger("input");
  $("#handykey_maxrun").prop("value", extensionSettings.maxrun).trigger("input");
  $("#handykey_maxspeed").prop("value", extensionSettings.maxspeed).trigger("input");
  onButtonClick()
}

// This function is called when the extension settings are changed in the UI
function onHandykeyInput(event) {
  const _val = $("#handykey_setting").val()
  extensionSettings.key = _val;
  handy.connectionKey = _val;
  console.log("onHandykeyInput", _val);
  saveSettingsDebounced();
}

function onMaxvalInput(event) {
	const _maxw = $("#handykey_maxrun").val()
	extensionSettings.maxrun = _maxw;
	console.log("onMaxvalInput", _maxw);
	saveSettingsDebounced();
}

function onMaxspeedInput(event) {
	const _maxw = $("#handykey_maxspeed").val()
	extensionSettings.maxspeed = _maxw;
	console.log("onMaxspeedInput", _maxw);
	saveSettingsDebounced();
}

function setStatusColor(isred) {
	const statusDot = document.getElementById('thehandy-status');
  
	if (!isred) {
		statusDot.classList.remove('status-red');
		statusDot.classList.add('status-green');
	} else {
		statusDot.classList.remove('status-green');
		statusDot.classList.add('status-red');
	}
}

function getActive() {
	const statusDot = document.getElementById('thehandy-status');
  
	return statusDot.classList.contains("status-green") || typeof __SILLYHANDY_DEBUG !== "undefined"
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
		await handy.setMode(Handy.HandyMode.hamp);
		await handy.setHampStop();
		setStatusColor(false)

		toastr.info(
			`Connected!`,
			"Handy Status"
		);
	} catch (e) {
		console.log("onButtonClick error", e)
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
  const settingsHtml = await $.get(`${extensionFolderPath}/settings.html`);

  // Append settingsHtml to extensions_settings
  // extension_settings and extensions_settings2 are the left and right columns of the settings menu
  // Left should be extensions that deal with system functions and right should be visual/UI related 
  $("#extensions_settings").append(settingsHtml);

  // These are examples of listening for events
  $("#my_button").on("click", onButtonClick);
  $("#handykey_setting").on("input", onHandykeyInput);
  $("#handykey_maxrun").on("input", onMaxvalInput);
  $("#handykey_maxspeed").on("input", onMaxspeedInput);

  // Load settings when starting things up (if you have any)
  loadSettings();
  cmdtable = cmdtable.push(...aichat_cmd);
});
