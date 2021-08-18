// Initialize modules
const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const imagemin = require('gulp-imagemin');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const terser = require('gulp-terser');
const del = require('del');
const mode = require('gulp-mode')();
const browsersync = require('browser-sync').create();

const isDev =  mode.development() ? true : false;

const config = {
	fontsDir: 'dist/fonts/',
	jsDir: 'dist/js/',
	cssDir: 'dist/css/',
	htmlDir: 'dist/',
	imagesDir: 'dist/images/',
}

function htmlTask(){
	return src('src/layout/*.html')
		.pipe(dest(config.htmlDir));
}

function fontsTask(){
	return src('src/fonts/**/*.woff')
		.pipe(dest(config.fontsDir));
}

function imageminTask(){
	return src('src/images/*')
			.pipe(imagemin([
							imagemin.gifsicle({interlaced: true}),
							imagemin.mozjpeg({quality: 75, progressive: true}),
							imagemin.optipng({optimizationLevel: 5}),
							imagemin.svgo({
									plugins: [
											{removeViewBox: true},
											{cleanupIDs: false}
									]
							})
					], 
					{ verbose: true }
			))
			.pipe(dest(config.imagesDir));
}

// Sass Task
function scssTask() {
	return src('src/scss/styles.scss', { sourcemaps: isDev })
		.pipe(sass())
		.pipe(postcss([autoprefixer(), cssnano()]))
		.pipe(dest(config.cssDir, { sourcemaps: '.' }));
}

// JavaScript Task
function jsTask() {
	return src('src/js/*.js', { sourcemaps: isDev })
		.pipe(mode.production(terser()))
		.pipe(dest(config.jsDir, { sourcemaps: '.' }));
}

function cleanTask() {
	return del('dist/');
};

// Browsersync
function browserSyncServe(cb) {
	browsersync.init({
		server: {
			baseDir: 'dist',
			index: 'index.html'
		},
		notify: {
			styles: {
				top: 'auto',
				bottom: '0',
			},
		},
	});
	cb();
}
function browserSyncReload(cb) {
	browsersync.reload();
	cb();
}

// Watch Task
function watchTask() {
	watch('src/layout/*.html', browserSyncReload);
	watch(
		['src/layout/*.html', 'src/scss/**/*.scss', 'src/**/*.js'],
		series(htmlTask, scssTask, jsTask, browserSyncReload)
	);
}

// Default Gulp Task
if(isDev){
	exports.default = series(htmlTask, imageminTask, fontsTask, scssTask, jsTask, browserSyncServe, watchTask);
}else{
	exports.default = series(cleanTask, parallel(htmlTask, imageminTask, fontsTask, scssTask, jsTask));
}


