/**
 * TiempoBus - Informacion sobre tiempos de paso de autobuses en Alicante
 * Copyright (C) 2013 Alberto Montiel
 * 
 * 
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later
 * version.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
 * details.
 * 
 * You should have received a copy of the GNU General Public License along with
 * this program. If not, see <http://www.gnu.org/licenses/>.
 */

var intervaloRecarga;

//Carga inicial de informacion
document.onreadystatechange = function(){

	if(document.readyState == "complete"){

		cargarPreferencias();

		cargarTiempos(document.querySelector('#parada-entrada').value);

		//Control de recarga auto
		if(preferencias.cargaAutomatica){
			intervaloRecarga = setInterval(intervalo, 60000);
		}

		console.debug('Carga inicial: ' + document.readyState);
	}

}

/**
* Funcion para la recarga automatica cada 60 segundos
*/
function intervalo(){
	cargarTiempos(document.querySelector('#parada-entrada').value)
}

/**
* Funciones a carga y cerrar cuando la aplicacion pasa a segundo plano
*/
document.addEventListener("visibilitychange", function(){
	if(document.hidden){
		console.debug("Aplicacion en segundo plano");	

		//Desactivar recarga
		clearInterval(intervaloRecarga);

	}
	else{
		console.debug("Aplicacion abierta");

		//Reactivar recarga
		intervaloRecarga = setInterval(intervalo, 60000);
	}
});


// boton recarga tiempos
/*document.querySelector('#boton-recarga').addEventListener('click', 

	function() {

		console.debug('enviar datos: '
				+ document.querySelector('#parada-entrada').value);

		cargarTiempos(document.querySelector('#parada-entrada').value);

});*/

// boton nueva parada
document.querySelector('#boton-enviar').addEventListener(
		'click',
		function() {

			console.debug('enviar datos: '
					+ document.querySelector('#parada-entrada').value);

			cargarTiempos(document.querySelector('#parada-entrada').value);

		});

// favoritos
document
		.querySelector('#btn-action-favoritos')
		.addEventListener(
				'click',
				function() {

					document.querySelector('#favoritos').className = 'current';
					document.querySelector('[data-position="current"]').className = 'left';

					cargarFavoritos();

				});
document
		.querySelector('#btn-favoritos-back')
		.addEventListener(
				'click',
				function() {
					document.querySelector('#favoritos').className = 'right';
					document.querySelector('[data-position="current"]').className = 'current';
				});

// Nuevo favorito
document
		.querySelector('#btn-action-guardar')
		.addEventListener(
				'click',
				function() {

					favoritoSeleccionadoModificar = '';

					document.querySelector('#favoritos-nuevo').className = 'current';
					document.querySelector('[data-position="current"]').className = 'left';
				});
document
		.querySelector('#btn-favoritos-nuevo-back')
		.addEventListener(
				'click',
				function() {
					document.querySelector('#favoritos-nuevo').className = 'right';
					document.querySelector('[data-position="current"]').className = 'current';
				});

document.querySelector('#btn-guardar-form').addEventListener(
		'click',
		function() {

			addFavorito(document.querySelector('#parada-entrada').value,
					document.querySelector('#input-titulo').value, document
							.querySelector('#input-descrip').value);

		});

// buscador
document.querySelector('#btn-buscador').addEventListener('click', function() {

	document.querySelector('#buscador').className = 'current';
	document.querySelector('[data-position="current"]').className = 'left';

	cargarLineas();

});
document
		.querySelector('#btn-buscador-back')
		.addEventListener(
				'click',
				function() {
					document.querySelector('#buscador').className = 'right';
					document.querySelector('[data-position="current"]').className = 'current';
				});

// buscador Tabs
document
		.querySelector('#panel1')
		.addEventListener(
				'click',
				function() {

					document.querySelector('#panel1a').setAttribute('aria-selected','true');
					document.querySelector('#panel2a').setAttribute('aria-selected','false');
					document.querySelector('#panel3a').setAttribute('aria-selected','false');
					
					mostrarListaLineas(listaLineas);

				});

document
		.querySelector('#panel2')
		.addEventListener(
				'click',
				function() {

					document.querySelector('#panel1a').setAttribute('aria-selected','false');
					document.querySelector('#panel2a').setAttribute('aria-selected','true');
					document.querySelector('#panel3a').setAttribute('aria-selected','false');
					
					
					mostrarListaParadas(listaParadasIda);

				});

document
		.querySelector('#panel3')
		.addEventListener(
				'click',
				function() {

					document.querySelector('#panel1a').setAttribute('aria-selected','false');
					document.querySelector('#panel2a').setAttribute('aria-selected','false');
					document.querySelector('#panel3a').setAttribute('aria-selected','true');
					
					mostrarListaParadas(listaParadasVuelta)

				});



// favoritos
document
		.querySelector('#btn-action-preferencias')
		.addEventListener(
				'click',
				function() {
					document.querySelector('#acercade').className = 'current';
					document.querySelector('[data-position="current"]').className = 'left';

				});
document
		.querySelector('#btn-acercade-back')
		.addEventListener(
				'click',
				function() {
					document.querySelector('#acercade').className = 'right';
					document.querySelector('[data-position="current"]').className = 'current';
				});

// opciones favoritos
/*
 * document.querySelector('#btn-action-menu').addEventListener ('click',
 * function () { document.querySelector('#action-menu-favoritos').className =
 * 'fade-in'; });
 */
document.querySelector('#action-menu-favoritos').addEventListener('click',
		function() {
			this.className = 'fade-out';
		});

document.querySelector('#btn-favoritos-cargar').addEventListener('click',
		function() {

			console.log("fav seleccionado: " + favoritoSeleccionado);

			cargarTiemposFavorito(favoritoSeleccionado);

		});

document.querySelector('#btn-aceptar-eliminar').addEventListener('click',
		function() {

			eliminarFavorito(favoritoSeleccionado);

		});

// confirm
document.querySelector('#btn-favoritos-eliminar').addEventListener('click',
		function() {
			document.querySelector('#confirm-eliminar').className = 'fade-in';
		});
document.querySelector('#confirm-eliminar').addEventListener('click',
		function() {
			this.className = 'fade-out';
		});

document.querySelector('#btn-favoritos-modificar').addEventListener('click',
		function() {
			editarFavorito(favoritoSeleccionado);
		});


var viewURL = document.querySelector("#url-blog");
if (viewURL) {
    viewURL.onclick = function () {
        var openURL = new MozActivity({
            name: "view",
            data: {
                type: "url", // Possibly text/html in future versions
                url: "http://alberapps.blogspot.com"
            }
        });
    }
}

var viewURL = document.querySelector("#url-gpl");
if (viewURL) {
    viewURL.onclick = function () {
        var openURL = new MozActivity({
            name: "view",
            data: {
                type: "url", // Possibly text/html in future versions
                url: "http://www.gnu.org/licenses/gpl.html"
            }
        });
    }
}

var viewURL = document.querySelector("#url-subus");
if (viewURL) {
    viewURL.onclick = function () {
        var openURL = new MozActivity({
            name: "view",
            data: {
                type: "url", // Possibly text/html in future versions
                url: "http://www.subus.es"
            }
        });
    }
}

var viewURL = document.querySelector("#url-bfos");
if (viewURL) {
    viewURL.onclick = function () {
        var openURL = new MozActivity({
            name: "view",
            data: {
                type: "url", // Possibly text/html in future versions
                url: "http://buildingfirefoxos.com/"
            }
        });
    }
}
