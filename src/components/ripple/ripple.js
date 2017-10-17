"use strict";

import {addClass, removeClass, hasClass} from "../utils/dom";

let startRipple = function startRipple(eventType, event) {
	let holder = event.currentTarget || event.target;
	if (!hasClass(holder, "mint-ripple")) {
		holder = holder.querySelector(".mint-ripple");
		if (!holder) return;
	}

	let prev = holder.getAttribute("data-ui-event");

	if (prev && prev !== eventType) return;

	holder.setAttribute("data-ui-event", eventType);

	let rect = holder.getBoundingClientRect();
	let x = event.offsetX;
	let y;

	if (x !== undefined) {
		y = event.offsetY
	} else {
		x = event.clientX - rect.left;
		y = event.clientY - rect.top;
	}

	let ripple = document.createElement("div");
	let max;

	if (rect.width === rect.height) {
		max = rect.width * 1.412;
	} else {
		max = Math.sqrt((rect.width * rect.width) + (rect.height * rect.height))
	}

	let dim = (max * 2) + "px";
	ripple.style.width = dim;
	ripple.style.height = dim;
	ripple.style.width = dim;
	ripple.style.marginLeft = -max + x + "px";
	ripple.style.marginTop = -max + y + "px";

	ripple.className = "ripple";
	holder.appendChild(ripple);
	setTimeout(() => {
		addClass(ripple, "held");
	}, 0)

	let releaseEvents = eventType === "mousedown" ? ["mouseup", "mousemove"] : ["touchend", "touchmove", "touchcancel"]

	let release = () => {
		releaseEvents.forEach((releaseEvent) => {
			document.removeEventListener(releaseEvent, release)
		});

		addClass(ripple, "done");

		setTimeout(() => {
			holder.removeChild(ripple);
			if (!holder.children.length) {
				removeClass(holder, "active");
				holder.removeAttribute("data-ui-event");
			}
		}, 450);
	}

	releaseEvents.forEach((releaseEvent) => {
		document.addEventListener(releaseEvent, release);
	});
}

export function handleMouseDown(event) {
	console.log(11111);
	if (event.button === 0) {
		startRipple(event.type, event);
	}
}

export function handleTouchStart(event) {
	if (event.changedTouches) {
		for (let i = 0; i < event.changedTouches.length; i++) {
			startRipple(event.type, event.changedTouches[i])
		}
	}
}

export default {
	handleMouseDown: handleMouseDown,
	handleTouchStart: handleTouchStart
}