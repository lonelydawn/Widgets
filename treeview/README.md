# EasyTreeview

* Lightweight Treeview
* Native HTML + CSS + JS
* Chrome, Firefox, IE > 9

## Usage

```html
<link rel="stylesheet" type="text/css" href="./css/index.min.css">
<div id="tree"></div>
<script type="text/javascript" src="./js/index.min.js"></script>
<script type="text/javascript">
	var tv = new EasyTreeview({
		el: 'tree',
		data: [
			{
				text: 'root',
				children: [
					{
						text: 'child - 1'
					}, {
						text: 'child - 2',
						children: [
							{
								text: 'child - 2 - 1'
							}
						]
					}
				]
			}
		]
	})
</script>
```

## Example

```js
var tv = new EasyTreeview({
	el: 'tree',
	draggable: true,
	checkable: true,
	onClick: function (symbol, node) {
		// console.log('%o %o', symbol, node)
	},
	onDragged: function (symbol, node) {
		// console.log('%o %o', symbol, node)
	},
	onDropped: function (symbol, node) {
		// console.log('%o %o', symbol, node)
	},
	onChecked: function (symbol, node, symbols) {
		// console.log('%o %o %o', symbol, node, symbols)
	},
	onUnchecked: function (symbol, node, symbols) {
		// console.log('%o %o %o', symbol, node, symbols)
	},
	data: [
		{
			id: 0,
			text: '服装',
			children: [
				{
					id: 4,
					text: '男装'
				}, {
					id: 6,
					text: '女装',
					style: {
						color: '#e33',
						lineHeight: '21px'
					},
					children: [
						{
							id: 12,
							text: '裤子',
							style: {
								color: '#fff',
								backgroundColor: '#bbdefb'
							}
						}, {
							id: 13,
							text: '裙子',
							checked: true,
							on: {
								click: function (e) {
									console.log(e.target)
								}
							}
						}
					]
				}
			]
		}
	]
})
```

## Option

#### el  (String | required)

The document element which is the container of treeview. 

If it does't exist, the treeview will not be created.

#### draggable (Boolean | default: false)

If value is true, the tree node will be draggable.

#### checkable (Boolean | default: false)

If value is true, the tree node will have checkbox. 

#### data (Array | required)

User data which the treeview depended on.

#### data[i].text (String | required)

Text of tree node.

#### data[i].style (Object | optional)

Customized node style.

#### data[i].on (Object | optional)

Customized node event listener.

#### data[i].children (Object | optional)

Sub tree.

## Event

#### onClick (Function | default: f (symbol, node) {})

- symbol, index distributed by system
- node, object packed by system based on the node data

Triggered when tree node is clicked. 

#### onDragged (Function | default: f (symbol, node) {})

Triggered when tree node is dragged (The treeview should be draggable).

#### onDropped (Function | default: f (symbol, node) {})

Triggered when tree node is dropped (The treeview should be draggable).

PS: Argument node is't the dragged element but the dropped target.

#### onChecked (Function | default: f (symbol, node, symbols) {})

* symbols, all checked nodes' symbol

Triggered when tree node is checked (The treeview should be checkable). 

#### onUnchecked (Function | default: f (symbol, node, symbols) {})

Triggered when tree node is unchecked (The treeview should be checkable).

## Method

#### getNodes () : Array

Get node collection which is packed by system.

#### getCheckedNodes (): Array

Get checked node collection.

#### getTree (): Array

Get new tree data after drag-drop.

## Extra

If you want to customize style detaily, please overwrite the class style of node.

document structure:

```html
<ul class="sub-tree">
	<li class="branch-node" draggable="true">
		<div class="node-body">
			<span class="collapse-switch"></span>
			<span class="checkbox"></span>
			<span class="node-text">节点</span>
		</div>
		<ul class="sub-tree">
			<!-- recursive -->
		</ul>
	</li>
</ul>
```

























