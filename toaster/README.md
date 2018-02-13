# EasyToaster

* Native HTML + CSS + JS
* Chrome, Firefox, IE 6 +
* IE Animation Support: IE 9 + 

## Usage

```html
<link rel="stylesheet" type="text/css" href="./index.css">
<div id="slider"></div>
<script type="text/javascript" src="./index.js"></script>
<script type="text/javascript">
	var toaster = new Toaster()
	toaster.info({
		text: 'default config'
	})
</script>
```

## Example

```js
toaster.error({
	text: 'There\'s something wrong',
	textAlign: 'left',
	withIcon: true,
	closable: true,
	animation: true,
	duration: 2500,
	onClick: function () {
		// do sth
	},
	onAppear: function () {
		// do sth
	},
	onVanish: function () {
		// do sth
	}
})
```


### Methods

| Name        | Comment               |
| :---------- | :-------------------- |
| wait        | Wait message          |
| info        | Info message          |
| success     | Success message       |
| warning     | Warning message       |
| error		  | Error message         |

### Options

| Name      | Type                          | Constraint       | Comment                         |
| :-------- | :---------------------------- | :--------------- | :------------------------------ |
| text      | String                        | required         | Message content                 |
| textAlign | enum['center','left','right'] | default 'center' | Determine Text align            |
| withIcon  | boolean                       | default false    | Create icon or not              |
| closable  | boolean                       | default false    | Create close button or not      |
| animation | boolean                       | default false    | Use animation to transit or not |
| duration  | Integer                       | default 2000     | Message duration                |

### Events

| Name     | Comment            |
| :------- | :----------------- |
| onClick  | Message is clicked |
| onAppear | Message is created |
| onVanish | Message is removed |
