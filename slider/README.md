# EasySliderbar

* Native HTML + CSS + JS
* Chrome, Firefox, IE 9 +

## Usage

```html
<link rel="stylesheet" type="text/css" href="./css/index.min.css">
<div id="slider"></div>
<script type="text/javascript" src="./js/index.min.js"></script>
<script type="text/javascript">
	var sb = new EasySliderBar({
		el: 'slider',
        onBarMoveBegin: function (index, position) {
            // do sth
        }
	})
</script>
```



### Option

| Name           | Type                                | Constraint           | Comment               |
| :------------- | :---------------------------------- | :------------------- | :-------------------- |
| el             | String                              | required             | DOM Node              |
| max            | Number                              | default 100          | Upper Limit           |
| min            | Number                              | default 0            | Lower Limit           |
| scale          | Integer                             | default 0            | Decimal Digits        |
| trackHeight    | Integer                             | default 10           | Track Height          |
| type           | enum['circle', 'square', 'diamond'] | default 'circle'     | Bar Type              |
| barNumber      | Integer                             | default 1            | Bar Number            |
| positions      | Array                               | default [min...]     | Initial Bar Positions |
| onBarMoveBegin | Function                            | default new Function | .                     |
| onBarMoving    | Function                            | default new Function | .                     |
| onBarMoveEnd   | Function                            | default new Function | .                     |

* If el illegal, cancel the creation.
* If others  illegal, use the default value.


### Event

#### onBarMoveBegin(index, position)

#### onBarMoving(index, position)

#### onBarMoveEnd(index, position)

* index	When there are serveral bars, the index marks which bar you are dragging.
* position    Mark where the bar is.


### Method

| Name           | Parameter  | Return          | Comment                                  |
| :------------- | :--------- | :-------------- | :--------------------------------------- |
| setBarPosition | pos, index | void            | Set position of the indexed bar. If index is not defined, set all. |
| getBarPosition | index      | Number \| Array | Return position of the indexed bar. If index is not defined, return all. |
