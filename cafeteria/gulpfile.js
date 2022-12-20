
const { src, dest, watch, series, parallel }= require('gulp'); //src es una función de gulp que permite identificar un archivo, cuando tiene llaves significa que el paquete (en este caso gulp) tiene más de una función
//dest es una función que permite almacenar en el disco duro.

// CSS Y SASS
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');

//IMAGENES
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

function css( done ) {
    // compilar sass
    // pasos: 1 - identificar archivo, 2 - compilarla, 3- Guardar el .css

    //pipe es para que una vez que finalice la tarea anterior, empiece la de pipe.

    src('src/scss/app.scss') //paso 1
        .pipe( sourcemaps.init()) //inicializa sourcemap
        .pipe( sass( {outputStyle: 'expanded'}) ) // paso 2 
        .pipe( postcss([autoprefixer()])) //tiene corchetes [] porque es un arreglo, se le pueden pasar varias funciones a postcss
        .pipe( sourcemaps.write('.')) //indica donde se guardará sourcemap, en este caso en el mismo build/css
        .pipe( dest('build/css') ) //paso 3 build/css es el destino donde se guardará

        done();
    }

    function imagenes( ) {
        return src('src/img/**/*') //todos los archivos que estén en img
        .pipe( imagemin({optimizationLevel: 3})) //ayuda en el nivel de ligereza que queremos disminuir
        .pipe ( dest('build/img') );

        
    }
    function versionWebp() {
        const opciones = {
            quality: 50
        }
        return src('src/img/**/*.{png,jpg}')
        .pipe( webp(opciones))
        .pipe( dest('build/img') )
    }
    function versionAvif() {
        const opciones = {
            quality: 50
        }
        return src('src/img/**/*.{png,jpg}')
        .pipe( avif(opciones))
        .pipe( dest('build/img'))
    }
       
    function dev() {
        watch('src/scss/**/*.scss', css);
     //watch tiene 2 parametros, uno es el archivo que revisa y el otro es la función que va a ejecutar.
        watch('src/img/**/*', imagenes); //para actualizar las imágenes.
    }


exports.css = css;
exports.dev = dev;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.default = series( imagenes, css, dev ); //, versionWebp, versionAvif

//series -Se inicia una tarea, y hasta que finaliza, inicia la siguiente


//parallel - todas inician al mismo tiempo