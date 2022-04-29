export {getMouse, getRandom, goFullscreen};

function getRandom(min, max) {
	return Math.random() * (max - min) + min;
}

// returns mouse position in local coordinate system of element
function getMouse(e){
	var mouse = {}; // make an object
	mouse.x = e.pageX - e.target.offsetLeft;
	mouse.y = e.pageY - e.target.offsetTop;
	return mouse;
}

const goFullscreen = (element) => {
	console.log(element);
	if (element.requestFullScreen) {
		element.requestFullScreen();
	} else if (element.mozRequestFullScreen) {
		element.mozRequestFullScreen();
	} else if (element.mozRequestFullScreen) { // camel-cased 'S' was changed to 's' in spec
		element.mozRequestFullScreen();
	} else if (element.webkitRequestFullScreen) {
		element.webkitRequestFullScreen();
	}
	// .. and do nothing if the method is not supported
};