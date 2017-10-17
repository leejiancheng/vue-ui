import Vue from "vue";

const SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
const MOZ_HACK_REGEXP = /^moz([A-Z])/;

const isServer = Vue.prototype.$isServer;
const ieVersion = isServer ? 0 : Number(document.documentMode);

const trim = (string) => {
	return (string || "").replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, "");
};

const camelCase = (name) => {
	return name.replace(SPECIAL_CHARS_REGEXP, (_, separator, letter, offset) => {
		return offset ? letter.toUpperCase() : letter;
	}).replace(MOZ_HACK_REGEXP, "Moz$1")
};

export const oneOf = (value, validList) => {
	for (let i = 0; i < validList.length; i++) {
		if (value === validList[i]) {
			return true;
		}
	}
	return false;
}

export const camelcaseToHyphen = (str) => {
	return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

export const on = (() => {
	if (!isServer && document.addEventListener) {
		return function(element, event, handler) {
			if (element && event && handler) {
				element.addEventListener(event, handler, false);
			}
		};
	} else {
		return function(element, event, handler) {
			if (element && event && handler) {
				element.attachEvent("on" + event, handler);
			}
		}
	}
})();

export const off = (() => {
	if (!isServer && document.removeEventListener) {
		return function(element, event, handler) {
			if (element && event) {
				element.removeEventListener(event, handler, false);
			}
		}
	} else {
		return function(element, event, handler) {
			if (element && event && handler) {
				element.attachEvent("on" + event, handler);
			}
		}
	}
})();

export const once = (el, event, fn) => {
	let listener = () => {
		if (fn) {
			fn.apply(this, arguments);
		}
		off(el, event, listener);
	};
	on(el, event, listener);
}

export function hasClass(el, cls) {
	if (!el || !cls) return false;
	if (cls.indexOf(" ") !== -1) {
		throw new Error("className should not contain space.");
	}
	if (el.classList) {
		return el.classList.contains(cls);
	} else {
		return (" " + el.className + " ").indexOf(" " + cls + " ") > -1;
	}
}

export function addClass(el, cls) {
	if (!el) return;
	let curClass = el.className;
	let classes = (cls || "").split(" ");

	for(let i = 0, j = classes.length; i < j; i++) {
		let clsName = classes[i];
		if (!clsName) continue;

		if (el.classList) {
			el.classList.add(clsName);
		} else {
			if (!hasClass(el, clsName)) {
				curClass += " " + clsName;
			}
		}
	}

	if (!el.classList) {
		el.className = curClass;
	}
};

export function removeClass(el, cls) {
	if (!el || !cls) return;
	let curClass = " " + el.className + " ";
	let classes = cls.split(" ");

	for(let i = 0, j = classes.length; i < j; i++) {
		let clsName = classes[i];
		if (!clsName) continue;

		if (el.classList) {
			el.classList.remove(clsName);
		} else {
			if (hasClass(el, clsName)) {
				curClass = curClass.replace(' ' + clsName + ' ', ' ');
			}
		}
	}

	if (!el.classList) {
		el.className = trim(curClass);
	}
};

// 小于IE9
const getStyleLt9 = (element, styleName) => {
	if (isServer) return;
	if (!element || !styleName) return null;

	styleName = camelCase(styleName);

	if (styleName === "float") {
		styleName = "styleFloat";
	}

	try {
		switch(styleName) {
			case "opacity":
				try {
					return element.filter.item("alpha").opacity / 100;
				} catch (error) {
					return 1.0;
				}
			default:
				return (element.style[styleName] || element.currentStyle ? element.currentStyle[styleName] : null);
		}
	} catch (error) {
		return element.style[styleName];
	}
}

// 大于IE9
const getStyleGt9 = (element, styleName) => {
	if (isServer) return;
	if (!element || !styleName) return null;

	styleName = camelCase(styleName);

	if (styleName === "float") {
		styleName = "cssFloat";
	}

	try {
		let computed = document.defaultView.getComputedStyle(element, "");
		return element.style[styleName] || computed ? computed[styleName] : null;
	} catch (error) {
		return element.style[styleName];
	}
};

export const getStyle = ieVersion < 9 ? function(element, styleName) {
	if (isServer) return;
	if (!element || !styleName) return null;

	styleName = camelCase(styleName);

	if (styleName === "float") {
		styleName = "styleFloat";
	}

	try {
		switch(styleName) {
			case "opacity":
				try {
					return element.filter.item("alpha").opacity / 100;
				} catch (error) {
					return 1.0;
				}
			default:
				return (element.style[styleName] || element.currentStyle ? element.currentStyle[styleName] : null);
		}
	} catch (error) {
		return element.style[styleName];
	}
} : function(element, styleName) {
	if (isServer) return;
	if (!element || !styleName) return null;

	styleName = camelCase(styleName);

	if (styleName === "float") {
		styleName = "cssFloat";
	}

	try {
		let computed = document.defaultView.getComputedStyle(element, "");
		return element.style[styleName] || computed ? computed[styleName] : null;
	} catch (error) {
		return element.style[styleName];
	}
}


export function setStyle(element, styleName, value) {
	if (!element || !styleName) return;

	if (typeof styleName === "object") {
		for(let prop in styleName) {
			if (styleName.hasOwnProperty(prop)) {
				setStyle(element, prop, styleName[prop]);
			}
		}
	} else {
		styleName = camelCase(styleName);
		if (styleName === "opacity" && ieVersion < 9) {
			element.style.filter = isNaN(value) ? "" : "alpha(opacity=" + value * 100 + ")";
		} else {
			element.style[styleName] = value;
		}
	}
}