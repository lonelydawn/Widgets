# ColorProgress

* Native HTML + CSS + JS
* Chrome, Firefox, IE 9 +



## Usage

```html
<link rel="stylesheet" type="text/css" href="./css/index.min.css">
<div id="progress"></div>
<script type="text/javascript" src="./js/index.min.js"></script>
<script type="text/javascript">
	var cp1 = new ColorProgress('progress', 'danger', 84)
</script>
```



### Options

| name       | type                                     | comment                        |
| :--------- | :--------------------------------------- | :----------------------------- |
| el         | String                                   | DOM Node                       |
| type       | Enum['exceed', 'success', 'warning', 'danger'] | Bar Type (Determine the color) |
| percentage | Integer                                  | Current Progress               |
| max        | Integer                                  | Max Progress                   |
| height     | Integer                                  | Bar Height                     |



### Methods

| name          | comment              |
| :------------ | :------------------- |
| setPercentage | set current progress |
| setType       | set progress type    |

