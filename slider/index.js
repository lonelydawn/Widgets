/**
 * Created by lonelydawn on 2017-11-20.
 * EasySliderBar - Easy slider bar
 * @params
 * el 			String		required			DOM Node
 * scale 		Integer		default 0 			Decimal Digits
 * min 			Number 		default 0 			Lower Limit
 * max 			Number 		default 100			Upper Limit
 * barNumber 	Integer 	default 1			Bar Number
 * positions 	Array 		default [0...]		Bar Initial Positions (Array length determined by barNumber.)
 * type 		String 		default 'circle'	Bar Type
 * trackHeight 	Integer 	default 10			Track Height (Also determines bar size.)
 * 
 * @methods
 * setBarPosition (pos, index)
 * getBarPosition (index)
 */

// Polyfill
Array.prototype.forEach = Array.prototype.forEach || function (cb) {
	for (var i = 0; i < this.length; i++) {
		cb(this[i], i)
	}
}
Array.prototype.filter = Array.prototype.filter || function (cb) {
	var arr = []
	for (var i = 0; i < this.length; i++) {
		if (cb[this[i], i]) {
			arr.push(this[i])
		}
	}
	return arr
}

var EasySliderBar = function (options) {
	// Add class, then return the changed className
	var getPushedClass = function (className, value) {
		return typeof className === 'string' && typeof value === 'string'
			? className.split(' ').concat(value).join(' ') : className 
	}
	// Remove class, then return the changed className
	var getRemovedClass = function (className, value) {
		if (typeof className === 'string' && typeof value === 'string') {
			return className.split(' ').filter(function (item) {
				return item !== '' && item !== value
			}).join(' ')
		}
		return className
	}
	// Get parallel pixel to scale
	var getInterval = function () {
		return track.clientWidth / (max - min)
	}
	// Limit bars' moving range
	var getValidLeft = function (value) {
		if (value < 0) {
			return 0
		} else if (value > track.clientWidth) {
			return track.clientWidth
		} else {
			return value
		}
	}
	// Add trigger on slidebar
	var setBarMove = function (bar, index) {
		bar.onmousedown = function (e) {
			var start = (e || window.event).clientX
			var left = Math.floor((bar.position - min) * getInterval())
			bar.label.className = getRemovedClass(bar.label.className, 'hidden')
			// Execute callback
			onBarMoveBegin({
				index: index,
				position: Number(bar.position)
			})
			document.onmousemove = function (e) {
				var movingLeft = getValidLeft(left + (e || window.event).clientX - start)
				var movingPosition = (min + movingLeft / getInterval()).toFixed(scale)
				bar.label.innerHTML = movingPosition
				bar.style.left = movingLeft - barOffset + 'px'
				onBarMoving({
					index: index,
					position: Number(movingPosition)
				})
			}
			document.onmouseup = function (e) {
				bar.position = (min + getValidLeft(left + (e || window.event).clientX - start) / getInterval()).toFixed(scale)
				bar.label.className = getPushedClass(bar.label.className, 'hidden')
				// Execute callback
				onBarMoveEnd({
					index: index,
					position: Number(bar.position)
				})
				document.onmousemove = null
				document.onmouseup = null
				bar.releaseCapture && bar.releaseCapture()
			}
			bar.setCapture && bar.setCapture()
			return false
		}
	}
	var el = options.el
	var scale = options.scale || 0
	var min = !isNaN(options.min) ? options.min : 0
	var max = !isNaN(options.max) ? (options.max > min ? options.max : min + 100) : 100
	var barNumber = options.barNumber || 1
	var positions = Object.prototype.toString.call(options.positions) === '[object Array]' ? options.positions : []
	for (var i = 0; i < barNumber; i++) {
		positions[i] = positions[i] && positions[i] >= min && positions[i] <= max ? positions[i] : min
	}
	var type = options.type || 'circle'
	// Set bars' width and height by type
	var trackHeight = !isNaN(options.trackHeight) ? options.trackHeight : 10
	var barWidth = {
		square: trackHeight * 2,
		circle: trackHeight * 3,
		diamond: 20
	}[type]
	var barHeight = {
		square: trackHeight * 3,
		circle: trackHeight * 3,
		diamond: trackHeight
	}[type]
	var barOffset = barWidth / 2
	var labelWidth = (30 + 7 * scale) || 30
	var labelOffset = labelWidth / 2 - barOffset
	// Get customized callback
	var onBarMoveBegin = options.onBarMoveBegin || new Function()
	var onBarMoving = options.onBarMoving || new Function()
	var onBarMoveEnd = options.onBarMoveEnd || new Function()

	var wrapper = document.getElementById(el)
	if (!wrapper) {
		return
	}
	// Init wrapper height
	wrapper.style.padding = barOffset + 5 + 'px'
	wrapper.style.height = trackHeight + 'px'
	// Empty container
	var childs = wrapper.childNodes
	for (var i = childs.length - 1; i > -1; i--) {
		wrapper.removeChild(childs[i])
	}
	// Create track
	var track = document.createElement('div')
	track.className = 'slider-track'
	wrapper.appendChild(track)
	// Create slider bar
	var barStack = []
	for (var counter = 0; counter < barNumber; counter++) {
		var bar = document.createElement('div')
		bar.className = 'slider-bar ' + type
		bar.position = positions[counter]
		bar.style.width = barWidth + 'px'
		bar.style.height = barHeight + 'px'
		bar.style.top = (trackHeight - barHeight) / 2 + 'px'
		bar.style.left = Math.floor((positions[counter] - min) * getInterval()) - barOffset + 'px'
		setBarMove(bar, counter)
		// Create slider bar label
		var label = document.createElement('div')
		label.className = 'slider-label hidden'
		label.style.width = labelWidth + 'px'
		label.style.left = -labelOffset + 'px'
		label.innerHTML = positions[counter].toFixed(scale)
		bar.label = label
		// Create DOM structure
		bar.appendChild(label)
		track.appendChild(bar)
		barStack.push(bar)
	}
	return {
		// Set some bars' position. (If index is not defined, set all.)
		setBarPosition: function (pos, index) {
			var set = function (bar) {
				if (pos >= min && pos <= max) {
					bar.position = pos
					bar.style.left = Math.floor((pos - min) * getInterval()) - barOffset + 'px'
					bar.label.innerHTML = Number(pos).toFixed(scale)
				}
			}
			index ? set(barStack[index]) : barStack.forEach(function (item) {
				set(item)
			})
		},
		// Return some bars' position. (If index is not defined, return all.)
		getBarPosition: function (index) {
			return index >= 0 ? barStack[index].position : barStack.map(function (item) {
				return item.position
			})
		}
	}
}