

// el, type, date, onChange
var EasyDatePicker = function (config) {
	if (!config || !config.el) {
		console.error(' Uncaught TypeError: el can\'t be undefined')
		return
	}
	// param
	var type = config.type || 'date'
	var date = new Date(config.date || null)
	var globalYear = date.getYear() + 1900
	var globalMonth = date.getMonth() + 1
	var globalDate = date.getDate()
	// event
	var onChange = config.onChange || new Function()
	// global element
	var wrapper = document.createElement('div')
	var input = document.createElement('div')
	var panel = document.createElement('div')

	// common function
	var doubleBit = function (number) {
		return (number >= 0 && number < 10) ? '0' + number : number
	}
	var addedClassName = function (className, _class) {
		return className.indexOf(_class) > -1 ? className : className + ' ' + _class
	}
	var rmedClassName = function (className, _class) {
		var names = className.split(' ')
		if (names.indexOf(_class) > -1) {
			names.splice(names.indexOf(_class), 1)
		}
		return names.join(' ')
	}
	var toggledClassName = function (className, _class) {
		var names = className.split(' ')
		names.indexOf(_class) > -1 ? names.splice(names.indexOf(_class), 1) : names.push(_class)
		return names.join(' ')
	}
	// method
	var getDate = function () {
		return globalYear + '-' + doubleBit(globalMonth) + '-' + doubleBit(globalDate)
	}
	var syncDateInput = function () {
		input.innerHTML = getDate()
	}
	var createWidget = function () {
		var el = document.getElementById(config.el)
		wrapper.className = 'picker-wrapper'
		el.parentNode.insertBefore(wrapper, el)
		el.parentNode.removeChild(el)
		input.className = 'picker-input'
		input.onclick = function () {
			panel.className = toggledClassName(panel.className, 'hidden')
			input.className = toggledClassName(input.className, 'is-active')
		}
		wrapper.appendChild(input)
		panel.className = 'picker-panel hidden'
		wrapper.appendChild(panel)
	}
	var createYearMonthPicker = function () {
		// empty panel
		panel.innerHTML = ''
		var createHead = function () {
			var header = document.createElement('div')
			header.className = 'picker-header'
			panel.appendChild(header)
			var back = document.createElement('span')
			back.className = 'picker-back'
			back.innerText = 'back'
			back.onclick = function () {
				createDatePicker()
			}
			header.appendChild(back)
		}
		var yearList = function () {
			var list = []
			for (var i = globalYear - 50; i < globalYear + 50; i++) {
				list.push(i)
			}
			return list
		}
		var createBody = function () {
			var createYearList = function () {
				var anchorPos = 0
				var aside = document.createElement('ul')
				aside.className = 'picker-aside'
				body.appendChild(aside)
				var collection = []
				yearList().forEach(function (item) {
					var listItem = document.createElement('li')
					listItem.className = 'year-list-item'
					listItem.innerText = item
					aside.appendChild(listItem)
					if (item === globalYear) {
						listItem.className = addedClassName(listItem.className, 'is-active')
						anchorPos = listItem.offsetTop
					}
					listItem.onclick = function () {
						collection.forEach(function (item) {
							item.className = rmedClassName(item.className, 'is-active')
						})
						listItem.className = addedClassName(listItem.className, 'is-active')
						// on change
						var latter = getDate()
						globalYear = item
						syncDateInput()
						onChange(latter, getDate())
					}
					collection.push(listItem)
				})
				aside.scrollTop = anchorPos - 125
			}
			var createMonthPanel = function () {
				var data = [
					[1, 2, 3],
					[4, 5, 6],
					[7, 8, 9],
					[10, 11, 12]
				]
				var collection = []
				var content = document.createElement('div')
				content.className = 'picker-content'
				body.appendChild(content)
				data.forEach(function (rItem) {
					var row = document.createElement('div')
					row.className = 'picker-row'
					rItem.forEach(function (cItem) {
						var cell = document.createElement('span')
						cell.className = 'picker-cell month-cell' + (cItem === globalMonth ? ' is-active' : '')
						cell.innerText = cItem
						cell.onclick = function () {
							collection.forEach(function (item) {
								item.className = rmedClassName(item.className, 'is-active')
							})
							cell.className = addedClassName(cell.className, 'is-active')
							// on change
							var latter = getDate()
							globalMonth = cItem
							syncDateInput()
							onChange(latter, getDate())
						}
						collection.push(cell)
						row.appendChild(cell)
					})
					content.appendChild(row)
				})
			}
			var body = document.createElement('div')
			body.className = 'picker-body'
			panel.appendChild(body)
			createYearList()
			createMonthPanel()
		}
		createHead()
		createBody()
	}
	var createDatePicker = function () {
		panel.innerHTML = ''
		var body
		// date picker
		var year = globalYear
		var month = globalMonth
		var yearRange = document.createElement('span')
		var syncYearRange = function () {
			yearRange.innerHTML = year + '-' + doubleBit(month)
		}
		// create picker header
		var createHead = function () {
			// header
			var header = document.createElement('div')
			header.className = 'picker-header'
			panel.appendChild(header)
			// preMonth
			var preMonth = document.createElement('span')
			preMonth.className = 'pre-month'
			preMonth.innerHTML = '&lt;'
			preMonth.onclick = function () {
				if (month > 1) {
					month--
				} else {
					year--
					month = 12
				}
				syncYearRange()
				panel.removeChild(body)
				createBody()
			}
			header.appendChild(preMonth)
			// yearRange
			yearRange.className = 'year-range'
			syncYearRange()
			yearRange.onclick = function () {
				createYearMonthPicker()
			}
			header.appendChild(yearRange)
			// nextMonth
			var nextMonth = document.createElement('span')
			nextMonth.className = 'next-month'
			nextMonth.innerHTML = '&gt;'
			nextMonth.onclick = function () {
				if (month < 12) {
					month++
				} else {
					year++
					month = 1
				}
				syncYearRange()
				panel.removeChild(body)
				createBody()
			}
			header.appendChild(nextMonth)
		}
		// get calendar data
		var calendarData = function () {
			// Judge the year is leap or not.
			var isLeapYear = function (year) {
				return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0
			}
			// Get how many days the month has.
			var getNumberOfDay = function (year, month) {
				return [31, isLeapYear(year)
				? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1]
			}
			var data = []
			var weekDay = new Date(year + '-' + month + '-' + globalDate).getDay()
			var lastMonth = month === 1 ? 12 : month - 1
			var dayNum = getNumberOfDay(year, month)
			var pmDayNum = getNumberOfDay(year, lastMonth)
			var colBeginIndex = 7 - (globalDate - weekDay) % 7
			// count current month's days
			var counter = 0
			for (var i = 0; i < 6; i++) {
				var row = []
				if (i === 0) {
					for (var j = 0; j < 7; j++) {
						if (j < colBeginIndex) {
							// begin with last month
							row.push({
								type: 'light',
								value: pmDayNum - colBeginIndex + j + 1
							})
						} else {
							row.push({
								type: 'normal',
								value: j - colBeginIndex + 1
							})
							counter++
						}
					}
				} else {
					for (var j = 0; j < 7; j++) {
						if (counter < dayNum) {
							row.push({
								type: 'normal',
								value: ++counter
							})
						} else {
							// end with next month
							row.push({
								type: 'light',
								value: ++counter - dayNum
							})
						}
					}
				}
				data.push(row)
			}
			return data
		}
		// create picker body
		var createBody = function () {
			body = document.createElement('div')
			body.className = 'picker-body'
			panel.appendChild(body)
			var title = document.createElement('div')
			title.className = 'picker-row picker-title'
			var labels = ['一', '二', '三', '四', '五', '六', '日']
			// create title cell
			labels.forEach(function (item) {
				var cell = document.createElement('span')
				cell.className = 'picker-cell date-cell picker-cell-title'
				cell.innerText = item
				title.appendChild(cell)
			})
			body.appendChild(title)
			// create body cell
			var collection = []
			calendarData().forEach(function (rItem) {
				var row = document.createElement('div')
				rItem.forEach(function (cItem) {
					var cell = document.createElement('span')
					cell.innerText = cItem.value
					cell.className = 'picker-cell date-cell' + (cItem.type === 'light' 
					? ' picker-cell-light' : '') 
					if (cItem.type === 'normal') {
						// initial set
						if (globalYear === year && 
							globalMonth === month && globalDate === cItem.value) {
							cell.className = addedClassName(cell.className, 'is-active')
						}
						cell.onclick = function () {
							// clear siblings style
							collection.forEach(function (item) {
								item.className = rmedClassName(item.className, 'is-active')
							})
							cell.className = addedClassName(cell.className, 'is-active')
							// on change
							var latter = getDate()
							globalDate = cItem.value
							globalYear = year
							globalMonth = month
							syncDateInput()
							onChange(latter, getDate())
						}
						collection.push(cell)
					}
					row.appendChild(cell)
				})
				body.appendChild(row)
			})
		}
		createHead()
		createBody()
	}
	var create = function () {
		syncDateInput()
		createDatePicker()
	}

	createWidget()
	create()

	return {
		getDate: getDate
	}
}
