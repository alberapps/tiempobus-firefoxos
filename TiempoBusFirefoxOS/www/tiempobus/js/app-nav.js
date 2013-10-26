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

// boton recarga tiempos
document.querySelector('#boton-recarga').addEventListener('click', function() {

	cargarTiempos();

});

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
