var gulp = require('gulp');
var browserSync = require('browser-sync').create();

gulp.task('default', function () {

    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    // add browserSync.reload to the tasks array to make
    // all browsers reload after tasks are complete.
    gulp.watch("js/app.js").on("change", browserSync.reload);
    gulp.watch("index.html").on("change", browserSync.reload);
    gulp.watch("css/app.css").on("change", browserSync.reload);
});