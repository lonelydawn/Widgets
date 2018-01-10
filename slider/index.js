/**
 * Created by lonelydawn on 2017-11-20.
 * EasySlider - Easy slider
 * @params
 * 
 * @methods
 */

// el, scale, min, max, position, type, trackHeight
var SliderBar = function (options) {
	var el = options.el
	var scale = options.scale || 0
	var min = options.min || 0
	var max = options.max ? (options.max > min ? options.max : min + 100) : 100
	var position = (position && options.position >= min && options.position <= max) ? position : min
	var barNumber = options.barNumber || 1
	var type = options.type || 'circle'
	// 根据类型设置 bar 宽高
	// setHeight begin
	var trackHeight = options.trackHeight || 10
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
	var labelOffset = 18 - barOffset
	// end
	var onBarMousedown = options.onBarMousedown || new Function()
	var onBarMouseup = options.onBarMouseup || new Function()

	var wrapper = document.getElementById(el)
	// 初始化高度
	// setHeight
	wrapper.style.height = trackHeight + 'px'
	// 清空容器原有节点
	var childs = wrapper.childNodes
	for (var i = childs.length - 1; i > -1; i--) {
		wrapper.removeChild(childs[i])
	}
	// 创建轨道
	var track = document.createElement('div')
	track.className = 'slider-track'
	// 创建滑块
	var bar = document.createElement('div')
	// setType begin
	bar.className = 'slider-bar ' + type
	// end

	// setHeight begin
	bar.style.width = barWidth + 'px'
	bar.style.height = barHeight + 'px'
	bar.style.top = (trackHeight - barHeight) / 2 + 'px'
	// end

	var label = document.createElement('div')
	label.className = 'slider-label hidden'
	label.style.left = -labelOffset + 'px'
	// 初始化标签数值
	bar.appendChild(label)
	track.appendChild(bar)
	wrapper.appendChild(track)
	// 向className中添加class, 并返回修改后的className
	var getPushedClass = function (className, value) {
		return (typeof className === 'string' && typeof value === 'string')
			? className.split(' ').concat(value).join(' ') : className 
	}
	// 从className中删除指定class, 并返回修改后的className
	var getRemovedClass = function (className, value) {
		if (typeof className === 'string' && typeof value === 'string') {
			var result = []
			var classArr = className.split(' ')
			for(var i = 0; i < classArr.length; i++) {
				if (classArr[i] !== '' && classArr[i] !== value) {
					result.push(classArr[i])
				}
			}
			return result.join(' ')
		}
		return className
	}
	// 获得每刻度等价像素值
	var getInterval = function () {
		return track.clientWidth / (max - min)
	}
	// 设置sliderbar所处位置
	var setBarPosition = function (pos) {
		if (pos >= min && pos <= max) {
			position = pos
			bar.style.left = Math.floor(pos * getInterval()) - barOffset + 'px'
			label.innerHTML = pos.toFixed(scale)
		}
	}
	// 限制滑块滑动位置
	var getValidLeft = function (value) {
		if (value < 0) {
			return 0
		} else if (value > track.clientWidth) {
			return track.clientWidth
		} else {
			return value
		}
	}
	bar.onmousedown = function (e) {
		var start = (e || window.event).clientX
		var left = Math.floor(position * getInterval())
		label.className = getRemovedClass(label.className, 'hidden')
		// 执行回调函数
		onBarMousedown({
			min: min,
			max: max,
			type: type,
			position: Number(position)
		})
		document.onmousemove = function (e) {
			var value = getValidLeft(left + (e || window.event).clientX - start)
			label.innerHTML = (value / getInterval()).toFixed(scale)
			bar.style.left = value - barOffset + 'px'
		}
		document.onmouseup = function (e) {
			position = (getValidLeft(left + (e || window.event).clientX - start) / getInterval()).toFixed(scale)
			label.className = getPushedClass(label.className, 'hidden')
			// 执行回调函数
			onBarMouseup({
				min: min,
				max: max,
				type: type,
				position: Number(position)
			})
			document.onmousemove = null
			document.onmouseup = null
			bar.releaseCapture && bar.releaseCapture()
		}
		bar.setCapture && bar.setCapture()
		return false
	}
	setBarPosition(position)
	return {
		setBarPosition: setBarPosition
	}
}