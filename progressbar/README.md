# ColorProgress

* Native HTML + CSS + JS
* Chrome, Firefox, IE 9 +



## Usage

```html
<link rel="stylesheet" type="text/css" href="./index.css">
<div id="progress"></div>
<script type="text/javascript" src="./index.js"></script>
<script type="text/javascript">
	var cp1 = new ColorProgress('progress', 'danger', 84)
</script>
```



### params

| name       | type                                     | comment                        |
| :--------- | :--------------------------------------- | :----------------------------- |
| el         | String                                   | DOM Node ID                    |
| type       | Enum['exceed', 'success', 'warning', 'danger'] | Bar Type (Determine the color) |
| percentage | Integer                                  | Current Progress               |
| max        | Integer                                  | Max Progress                   |
| height     | Integer                                  | Bar Height                     |



### methods

| name          | comment              |
| :------------ | :------------------- |
| setPercentage | set current progress |
| setType       | set progress type    |

