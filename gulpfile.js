/**
 * Created by lonelydawn on 2018-03-21
 */

var gulp = require('gulp')
var babel = require('gulp-babel')
var cleanCss = require('gulp-clean-css')
var concat = require('gulp-concat')
var plumber = require('gulp-plumber')
var uglify = require('gulp-uglify')

var stage = [
	{
		dir: 'datepicker',
		css: ['./datepicker/css/*.css'],
		javascript: ['./datepicker/js/*.js'],
		command: 'datepicker:minify'
	}, {
		dir: 'progressbar',
		css: ['./progressbar/css/*.css'],
		javascript: ['./progressbar/js/*.js'],
		command: 'progressbar:minify'
	}, {
		dir: 'slider',
		css: ['./slider/css/*.css'],
		javascript: ['./slider/js/*.js'],
		command: 'slider:minify'
	}, {
		dir: 'toaster',
		css: ['./toaster/css/*.css'],
		javascript: ['./toaster/js/*.js'],
		command: 'toaster:minify'
	}, {
		dir: 'treeview',
		css: ['./treeview/css/*.css'],
		javascript: ['./treeview/js/*.js'],
		command: 'treeview:minify'
	}
]

var defineTask = function (dir) {
	var actor = stage.find(function (actor) {
		return actor.dir === dir
	})
	gulp.task(actor.dir + ':minify', function () {
		// merge and minify javascript
		gulp.src(actor.javascript)
		.pipe(plumber())
		.pipe(concat('index.min.js'))
		.pipe(babel())
		.pipe(uglify())
		.pipe(gulp.dest('./' + dir + '/js'))
		// merge and minify css
		gulp.src(actor.css)
		.pipe(plumber())
		.pipe(concat('index.min.css'))
		.pipe(cleanCss())
		.pipe(gulp.dest('./' + dir + '/css'))
	})
}

gulp.task('define', function () {
	stage.forEach(function (item) {
		defineTask(item.dir)
	})
})

gulp.task('default', function () {
	gulp.start(stage.map(function (item) {
		return item.command
	}))
})

gulp.start('define')
