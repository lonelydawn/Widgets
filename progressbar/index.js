/**
 * Created by lonelydawn on 2017-11-20.
 * ColorProgress - Pretty easy progressar
 * @params
 * el: String
 * type: enum['exceed', 'success', 'warning', 'danger']
 * percentage: Integer
 * max: Integer
 * height: Integer
 * 
 * @methods
 * setPercentage(percentage: Integer)
 * setType(type: enum['exceed', 'success', 'warning', 'danger'])
 */

var ColorProgress = function (el, type, percentage, max, height) {
	var types = ['exceed', 'success', 'warning', 'danger']
	type = types.indexOf(type) > -1 ? type : types[0]
	percentage = (percentage && percentage <= max) ? percentage : 0
	max = (max && max >= 100) ? max : 100
	height = height || 12

	var setPercentage = function (percentage) {
		inner.style.width = percentage * 100 / max + '%'
		label.innerHTML = percentage + '%'
		label.className = 'progress-label' + (percentage === 0 ? ' is-danger' : '')
	}
	var setType = function (type) {
		inner.className = 'progress-inner ' + {
			exceed: 'status-exceed',
			success: 'status-success',
			warning: 'status-warning',
			danger: 'status-danger'
		}[type]
	}

	var wrapper = document.getElementById(el)
	if (wrapper) {
		// 清空容器
		var childs = wrapper.childNodes
		for(var i = childs.length - 1; i >= 0; i--) {
		  wrapper.removeChild(childs[i]); 
		}
		// 添加节点并设置样式
		var track = document.createElement('div')
		track.className = 'progress-track'
		track.style.height = height + 'px'
		var inner = document.createElement('div')
		var label = document.createElement('div')
		var bg = document.createElement('div')
		bg.className = 'progress-bg'
		bg.style.width = 10000 / max + '%'
		setPercentage(percentage)
		setType(type)

		track.appendChild(inner)
		track.appendChild(label)
		track.appendChild(bg)
		wrapper.appendChild(track)
	}

	return {
		setPercentage: setPercentage,
		setType: setType
	}
} 