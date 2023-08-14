/*
 * @Description: TODO
 * @Author: zb
 * @Date: 2023-08-13 11:13:04
 * @LastEditors: zb
 * @LastEditTime: 2023-08-14 23:30:19
 */
import gulp from "gulp"; // 基础库
import imagemin, { mozjpeg, optipng, gifsicle } from "gulp-imagemin"; // 图片压缩
import pngquan from 'imagemin-pngquant';

gulp.task("images", function () {
  return gulp
    .src("source/_posts/**/*.{png,jpg,gif}") // 指明源文件路径、并进行文件匹配
    .pipe(
      imagemin([mozjpeg(), optipng(), pngquan()])
    )
    .pipe(gulp.dest("source/_posts")); // 输出路径
});
