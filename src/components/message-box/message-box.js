"use strict";

import Vue from "vue";
import msgboxVue from "./message-box.vue";

const CONFIRM_TEXT = "确定";
const CANCEL_TEXT = "取消";

let defaults = {
	title: "提示",
	message: "",
	type: "",
	showInput: false,
	showClose: true,
	modalFade: false,
	lockScroll: false,
	closeOnClickModal: true,
	inputValue: null,
	inputPlaceholder: "",
	inputPattern: null,
	inputValidator: null,
	inputErrorMessage: "",
	showConfirmButton: true,
	showCancelButton: false,
	confirmButtonPosition: "right",
	confirmButtonHighlight: false,
	cancelButtonHighlight: false,
	confirmButtonText: CONFIRM_TEXT,
	cancelButtonText: CANCEL_TEXT,
	confirmButtonClass: "",
	cancelButtonClass: ""
};


let merge = function(target) {
	for(let i = 1, j = arguments.length; i < j; i++) {
		let source = arguments[i];
		for(let prop in source) {
			if (source.hasOwnProperty(prop)) {
				let value = source[prop];
				if (value !== undefined) {
					target[prop] = value;
				}
			}
		}
	}
	// console.log(target);
	return target;
};

let MessageBoxConstructor = Vue.extend(msgboxVue);

let currentMsg, instance;
let msgQueue = [];

const defaultCallback = action => {
	if (currentMsg) {
		let callback = currentMsg.callback;

		if (typeof callback === "function") {
			if (instance.showInput) {
				callback(instance.inputValue, action);
			} else {
				callback(action);
			}
		}

		if (currentMsg.resolve) {
			let $type = currentMsg.options.$type;
			if ($type === "confirm" || $type === "prompt") {
				if (action === "confirm") {
					if (instance.showInput) {
						currentMsg.resolve({value: instance.inputValue, action});
					} else {
						currentMsg.resolve(action);
					}
				} else if (action === "cancel" && currentMsg.reject) {
					currentMsg.reject(action);
				}
			} else {
				currentMsg.resolve(action);
			}
		}
	}
};

let initInstance = () => {
	instance = new MessageBoxConstructor({
		el: document.createElement("div")
	});

	instance.callback = defaultCallback;
};

let showNextMsg = () => {
	if (!instance) {
		initInstance();
	}

	if (!instance.value || instance.closeTimer) {
		if (msgQueue.length > 0) {
			currentMsg = msgQueue.shift();

			let options = currentMsg.options;
			for(let prop in options) {
				if (options.hasOwnProperty(prop)) {
					instance[prop] = options[prop];
				}
			}

			if (options.callback === undefined) {
				instance.callback = defaultCallback;
			}

			["modal", "showClose", "closeOnClickModal", "closeOnPressEscape"].forEach(prop => {
				if (instance[prop] === undefined) {
					instance[prop] = true;
				}
			});

			document.body.appendChild(instance.$el);

			Vue.nextTick(() => {
				instance.value = true;
			});
		}
	}
};

let MessageBox = function(options, callback) {
		// console.log(options);
	if (typeof options === "string") {
		options = {
			title: options
		};
		if (arguments[1]) {
			options.message = arguments[1];
		}

		if (arguments[2]) {
			options.type = arguments[2];
		}
	} else if (options.callback && !callback) {
		callback = options.callback;
	}

	if (typeof Promise !== "undefined") {
		return new Promise((resolve, reject) => {
			msgQueue.push({
				options: merge({}, defaults, MessageBox.defaults || {}, options),
				callback: callback,
				resolve: resolve,
				reject: reject
			});
			showNextMsg();
		});
	} else {
		msgQueue.push({
			options: merge({}, defaults, MessageBox.defaults || {}, options),
			callback: callback
		});
		showNextMsg();
	}
};

MessageBox.setDefaults = (defaults) => {
	MessageBox.defaults = defaults;
};

MessageBox.alert = (message, title, options) =>{
	if (typeof title === "object") {
		options = title;
		title = "";
	}
	return MessageBox(merge({
		title: title,
		message: message,
		$type: "alert",
		closeOnPressEscape: false,
		closeOnClickModal: false
	}, options));
};

MessageBox.confirm = (message, title, options) => {
	if (typeof title === "object") {
		options = title;
		title = "";
	}
	return MessageBox(merge({
		title: title,
		message: message,
		$type: "confirm",
		showCancelButton: true
	}, options));	
};

MessageBox.prompt = (message, title, options) => {
	if (typeof title === "object") {
		options = title;
		title = "";
	}
	return MessageBox(merge({
		title: title,
		message: message,
		$type: "prompt",
		showCancelButton: true,
		showInput: true
	}, options));
};

MessageBox.close = () => {
	if (!instance) return;
	instance.value = false;
	msgQueue = [];
	currentMsg = null
};

export default MessageBox;
export {MessageBox};