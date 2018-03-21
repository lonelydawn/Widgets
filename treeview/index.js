/**
 * Created by lonelydawn.
 * Date: 2018-03-14
 */

// polyfill
if (!Array.prototype.find) {
	Array.prototype.find = function (callback) {
		for (var i = 0; i < this.length; i++) {
			if (callback(this[i], i)) {
				return this[i]
			}
		}
		return undefined
	}
}
Array.prototype.enhancedConcat = function (array) {
	if (Object.prototype.toString.call(array) === '[object Array]') {
		for (var i = 0; i < array.length; i++) {
			this.push(array[i])
		}
	}
	return this
}

var EasyTreeview = function (option) {
	var data = option.data
	var container = document.getElementById(option.el)
	var draggable = option.draggable
	var checkable = option.checkable
	var selectable = option.selectable
	var onClick = option.onClick || new Function()
	var onChecked = option.onChecked || new Function()
	var onUnchecked = option.onUnchecked || new Function()
	var onDragged = option.onDragged || new Function()
	var onDropped = option.onDropped || new Function()
	var index = -1
	var nodeCollection = []
	var checkedSymbol = []
	var collapsedSymbol = []
	var branchedSymbol = []
	// judge if the parameters are valid
	var isValid = function () {
		if (Object.prototype.toString.call(data) !== '[object Array]') {
			console.error('Uncaught TypeError: treeview data should be array.')
			return false
		}
		if (container === null) {
			console.error('Uncaught ReferenceError: treeview element does not exist.')
			return false
		}
		return true
	}
	if (!isValid()) {
		return
	}
	// add class
	var addClass = function (node, className) {
		var _classArr = node.className.split(' ')
		if (_classArr.indexOf(className) === -1) {
			_classArr.push(className)
		}
		node.className = _classArr.join(' ')
	}
	// remove class
	var removeClass = function (node, className) {
		var _classArr = node.className.split(' ')
		var index = _classArr.indexOf(className)
		if (index > -1) {
			_classArr.splice(index, 1)
		}
		node.className = _classArr.join(' ')
	}
	// render style
	var renderStyle = function (node, style) {
		for (var index in style) {
			node.style[index] = style[index]
		}
	}
	// render event listener
	var renderEvent = function (node, event) {
		for (var index in event) {
			// decorator
			node.addEventListener(index, function (e) {
				e.stopPropagation()
				event[index](e)
				// e.preventDefault()
			})
		}
	}
	// create element
	var createElement = function (tag, attrs, events) {
		var element = document.createElement(tag || 'div')
		for (var index in attrs) {
			var attr = attrs[index]
			if (Object.prototype.toString.call(attr) === '[object Object]') {
				renderStyle(element, attr)
			} else {
				element[index] = attr
			}
		}
		renderEvent(element, events)
		return element
	}
	// add or remove state symbol in collection
	var synchStateSymbol = function (collection, symbol, marked) {
		var index = collection.indexOf(symbol)
		if (index > -1 && !marked) {
			collection.splice(index, 1)
		} else if (index === -1 && marked) {
			collection.push(symbol)
		}
	}
	// synch the state properties of node with symbol
	var synchNodeWithSymbol = function (symbols, mark) {
		// global variable
		nodeCollection.forEach(function (node) {
			node[mark] = symbols.find(function (symbol) {
				return node.index === symbol
			}) !== undefined ? true : false
		})
	}
	// find child nodes by class name
	var findChildByClass = function (node, _class) {
		var childNodes = node.childNodes
		for (var index in childNodes) {
			if (childNodes[index].className.split(' ').indexOf(_class) > -1) {
				return childNodes[index]
			}
		}
		return -1
	}
	// synch document view with symbol
	var synchViewWithSymbol = function (collection, subClass, toggleClass) {
		// global variable - nodeCollection
		nodeCollection.forEach(function (node) {
			var sub = findChildByClass(node.obj, subClass)
			collection.indexOf(node.index) > -1
			? addClass(sub, toggleClass)
			: removeClass(sub, toggleClass)
		})
	}
	// return leaf nodes in the collection
	var leafNodes = function () {
		var leafNodes = []
		// global variable
		nodeCollection.forEach(function (_node_) {
			var isBranch = false
			nodeCollection.forEach(function (node) {
				if (node.parent === _node_.index) {
					isBranch = true
				}
			})
			if (!isBranch) {
				leafNodes.push(_node_)
			}
		})
		return leafNodes
	}
	// return leaf checked symbol
	var leafCheckedSymbol = function () {
		var lcs = []
		var leaves = leafNodes()
		checkedSymbol.forEach(function (symbol) {
			leaves.forEach(function (leaf) {
				if (symbol === leaf.index) {
					lcs.push(symbol)
				}
			})
		})
		return lcs
	}
	// return referenced checked symbol
	var refsCheckedSymbol = function (symbol) {
		var rcs = []
		nodeCollection.forEach(function (item) {
			if (item.index === nodeCollection.find(function (item) {
				return item.index === symbol
			}).parent) {
				rcs.push(item.index)
				rcs.enhancedConcat(refsCheckedSymbol(item.index))
			}
		})
		return rcs
	}
	// collect all the checked symbol
	var collectCheckedSymbol = function () {
		var lcs = leafCheckedSymbol()
		checkedSymbol = []
		lcs.forEach(function (symbol) {
			checkedSymbol.push(symbol)
			checkedSymbol.enhancedConcat(refsCheckedSymbol(symbol))
		})
	}
	// return clicked branch's leaf symbol
	var leafSymbolOnClicked = function (symbol) {
		var lsoc = []
		nodeCollection.forEach(function (node) {
			if (node.parent === symbol) {
				lsoc.enhancedConcat(node.isBranch 
					? leafSymbolOnClicked(node.index) 
					: [node.index])
			}
		})
		return lsoc
	}
	// synch all the clicked branch's node symbol
	var synchCheckedBranchSymbol = function (symbol, marked) {
		leafSymbolOnClicked(symbol).forEach(function (item) {
			synchStateSymbol(checkedSymbol, item, marked)
		})
	}
	// single entrance
	var synchCheckedView = function () {
		collectCheckedSymbol()
		synchNodeWithSymbol(checkedSymbol, 'isChecked')
		synchViewWithSymbol(checkedSymbol, 'node-body', 'checked')
	}
	// collect branched symbol
	var collectBranchedSymbol = function () {
		branchedSymbol = []
		nodeCollection.forEach(function (node) {
			if (nodeCollection.find(function (n) {
				return n.parent === node.index
			}) !== undefined) {
				branchedSymbol.push(node.index)
			}
		})
	}
	// synch branched
	var synchBranchedView = function () {
		collectBranchedSymbol()
		synchNodeWithSymbol(branchedSymbol, 'isBranch')
		synchViewWithSymbol(branchedSymbol, 'node-body', 'branched')
	}
	// synch collapsed
	var synchCollapsedView = function () {
		synchNodeWithSymbol(collapsedSymbol, 'isCollapsed')
		synchViewWithSymbol(collapsedSymbol, 'node-body', 'collapsed')
		synchViewWithSymbol(collapsedSymbol, 'sub-tree', 'invisible')
	}
	// create tree branch
	var createBranch = function (nodes, parent) {
		var ul = createElement('ul', {
			className: 'sub-tree'
		})
		nodes.forEach(function (node) {
			var symbol = ++index
			var li = createElement('li', {
				className: 'branch-node',
				draggable: draggable,
				style: node.style
			}, node.on)
			if (!node.on || !node.on.click) {
				li.addEventListener('click', function (e) {
					e.stopPropagation()
					onClick(symbol, nodeCollection.find(function (node) {
						return node.index === symbol
					}))
				})
			}
			// add drag event
			if (draggable) {
				li.addEventListener('dragstart', function (e) {
					e.stopPropagation()
					/** 
					 * the key must be named 'text' 
					 * and the value must be typeof String in IE
					 */
					e.dataTransfer.setData("text", String(symbol))
					// trigger event
					onDragged(symbol, nodeCollection.find(function (node) {
						return node.index === symbol
					}))
				})
				li.addEventListener('dragover', function (e) {
					e.preventDefault()
					e.stopPropagation()
					if (e.target.className.indexOf('node-text') > -1) {
						addClass(e.target, 'drag-enter')
					}
				})
				li.addEventListener('dragenter', function (e) {
					e.stopPropagation()
					e.preventDefault()
				})
				li.addEventListener('dragleave', function (e) {
					e.stopPropagation()
					e.preventDefault()
					if (e.target.className.indexOf('node-text') > -1) {
						removeClass(e.target, 'drag-enter')
					}
				})
				li.addEventListener('drop', function (e) {
					e.stopPropagation()
					e.preventDefault()
					if (e.target.className.indexOf('node-text') > -1) {
						removeClass(e.target, 'drag-enter')
					}
					var cachedSymbol = Number(e.dataTransfer.getData('text'))
					if (cachedSymbol === symbol) {
						return
					}
					var base = e.target.parentNode.parentNode
					var parent = findChildByClass(base, 'sub-tree')
					var child = nodeCollection.find(function (node) {
						return node.index === cachedSymbol
					})
					// global symbol
					child.parent = symbol
					parent.appendChild(child.obj)
					synchCheckedView()
					synchBranchedView()
					// trigger event
					onDropped(symbol, nodeCollection.find(function (node) {
						return node.index === symbol
					}))
				})
			}
			// local variable
			var data = JSON.parse(JSON.stringify(node))
			delete data.children
			// record node
			var record = {
				index: index,
				parent: parent,
				text: node.text,
				isBranch: node.children !== undefined,
				isChecked: node.checked,
				isCollapsed: node.collapsed,
				data: data,
				obj: li
			}
			nodeCollection.push(record)
			var div = createElement('div', {
				className: 'node-body'
			})
			// record checked node
			node.checked && synchStateSymbol(checkedSymbol, symbol, node.checked)
			li.appendChild(div)
			// create sub tree
			var sub = createBranch(node.children || [], index)
			// record collapsed node
			node.collapsed && synchStateSymbol(collapsedSymbol, symbol, node.collapsed)
			li.appendChild(sub)
			div.appendChild(createElement('span', {
				className: 'collapse-switch'
			}, {
				click: function (e) {
					record.isCollapsed = !record.isCollapsed
					record.isBranch && synchStateSymbol(collapsedSymbol, symbol, record.isCollapsed)
					synchNodeWithSymbol(collapsedSymbol, 'isCollapsed')
					synchCollapsedView()
				}
			}))
			record.isBranch && synchStateSymbol(branchedSymbol, symbol, record.isBranch)
			if (checkable) {
				div.appendChild(createElement('span', {
					className: 'checkbox'
				}, {
					// checkable
					click: function (e) {
						record.isChecked = !record.isChecked
						record.isBranch 
						? synchCheckedBranchSymbol(symbol, record.isChecked)
						: synchStateSymbol(checkedSymbol, symbol, record.isChecked)
						// trigger event
						record.isChecked 
						? onChecked(symbol, nodeCollection.find(function (node) {
							return node.index === symbol
						}), checkedSymbol)
						: onUnchecked(symbol, nodeCollection.find(function (node) {
							return node.index === symbol
						}), checkedSymbol)
						synchCheckedView()
					}
				}))
			}
			div.appendChild(createElement('span', {
				className: 'node-text',
				innerHTML: '&nbsp;' + node.text
			}))
			ul.appendChild(li)
		})
		return ul
	}
	container.appendChild(createBranch(data, index))
	// init state after document created
	synchCheckedView()
	synchBranchedView()
	synchCollapsedView()
	return {
		getNodes: function () {
			return nodeCollection
		},
		getCheckedNodes: function () {
			var cn = []
			nodeCollection.forEach(function (node) {
				if (node.isChecked) {
					cn.push(node)
				}
			})
			return cn
		},
		getTree: function () {
			var getChildren = function (index) {
				var sub = []
				// global variable
				nodeCollection.forEach(function (node) {
					if (node.parent === index) {
						var data = JSON.parse(JSON.stringify(node.data))
						var children = getChildren(node.index)
						if (children.length > 0) {
							data.children = children
						}
						sub.push(data)
					}
				})
				return sub
			}
			return getChildren(-1)
		}
	}
}
