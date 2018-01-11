# EasySliderbar

* Native HTML + CSS + JS
* Chrome, Firefox, IE 9 +

## Usage

```html
<link rel="stylesheet" type="text/css" href="./index.css">
<div id="slider"></div>
<script type="text/javascript" src="./index.js"></script>
<script type="text/javascript">
	var sb = new EasySliderBar({
		el: 'slider'
	})
</script>
```



### Options

| Name        | Type                                | Constraint       | Comment               |
| :---------- | :---------------------------------- | :--------------- | :-------------------- |
| el          | String                              | required         | DOM Node              |
| max         | Number                              | default 100      | Upper Limit           |
| min         | Number                              | default 0        | Lower Limit           |
| scale       | Integer                             | default 0        | Decimal Digits        |
| trackHeight | Integer                             | default 10       | Track Height          |
| type        | enum['circle', 'square', 'diamond'] | default 'circle' | Bar Type              |
| barNumber   | Integer                             | default 1        | Bar Number            |
| positions   | Array                               | default [min...] | Initial Bar Positions |

* If el illegal, cancel the creation.
* If others  illegal, use the default value.



### Methods

| Name           | Parameter  | Return          | Comment                                  |
| -------------- | ---------- | --------------- | ---------------------------------------- |
| setBarPosition | pos, index | void            | Set position of the indexed bar. If index is not defined, set all. |
| getBarPosition | index      | Number \| Array | Return position of the indexed bar. If index is not defined, return all. |