/**
 *  TiempoBus - Informacion sobre tiempos de paso de autobuses en Alicante
 *  Copyright (C) 2013 Alberto Montiel
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/*
 * Funciones para la carga de tiempos
 */

//navigator.mozL10n.language.code = 'ca';

/**
 * Activar progreso
 */
function activarSpinner() {

	document.querySelector("#progreso").innerHTML = "<progress></progress>";

}

/**
 * Desactivar progreso
 */
function quitarSpinner() {

	document.querySelector("#progreso").innerHTML = "";

}

/**
 * Carga la lista de tiempos en pantalla
 * 
 * @param listaTiempos
 */
function mostrarListaTiempos(listaTiempos) {

	console.debug("Carga lista de tiempos en pantalla");

	var htmlTiempos = '';

	// Control de resultados
	if (listaTiempos == null || listaTiempos.length == 0) {

		htmlTiempos = "<div style='text-align:center'><h3>" + navigator.mozL10n.get('l10n_sin_result') +"</h3><h4>"
+ navigator.mozL10n.get('l10n_sin_resultados_2') +"</h4></div>";

	} else {
		// Carga listado formateado
		htmlTiempos = '<ul>';

		for (var i = 0; i < listaTiempos.length; i++) {

			htmlTiempos += '<li><a href="#">';
			htmlTiempos += '<p>' + listaTiempos[i].linea + ' '
					+ listaTiempos[i].ruta + '</p>';
			htmlTiempos += '<p>' + listaTiempos[i].tiemposFormateados + '</p>';
			htmlTiempos += '</a></li>';

		}

		htmlTiempos += '</ul>';
		
		//pie
		
		
		//htmlTiempos += '<p class="content micro">' + navigator.mozL10n.get('l10n_aviso')
		//+'<br/>' +navigator.mozL10n.get('l10n_aviso1')
		//+'<br/>' +navigator.mozL10n.get('l10n_aviso2')+'</p>';
			
			
			
		
		
		

	}

	// Actualiza componente
	document.querySelector("#lista-tiempos").innerHTML = htmlTiempos;

}

/**
 * Funcion de acceso al servicio de tiempos para la parada indicada
 */
function cargarTiempos(parada) {

	guardarPreferencia('paradaInicial')

	/**
	 * Funcion para gestionar la respuesta del servicio
	 */
	function reqListener() {

		var listaTiempos = new Array();

		try{

		var a = this.responseXML.documentElement;
		for (var ii = 0; ii < a.childNodes[0].childNodes[0].childNodes[0].childNodes.length; ++ii) {

			// PasoParada
			var pasoParada = a.childNodes[0].childNodes[0].childNodes[0].childNodes[ii];

			// e1
			var minutos1 = pasoParada.childNodes[1].childNodes[0].childNodes[0].nodeValue;

			// e1
			var minutos2 = pasoParada.childNodes[2].childNodes[0].childNodes[0].nodeValue;

			// linea
			var linea = pasoParada.childNodes[3].childNodes[0].nodeValue;

			// parada
			var parada = pasoParada.childNodes[4].childNodes[0].nodeValue;

			// ruta
			var ruta = pasoParada.childNodes[5].childNodes[0].nodeValue;

			tiempo = new Object();

			tiempo.linea = linea;
			tiempo.ruta = ruta;
			// Tiempos con el formato adecuado
			tiempo.tiemposFormateados = formatearTiempos(minutos1, minutos2);

			listaTiempos.push(tiempo);

		}

		// Mostrar lista cargada
		mostrarListaTiempos(listaTiempos);

		actualizarHora();

		}catch(e){

			console.error("add error", e);
		        utils.status.show(navigator.mozL10n.get('l10n_tiempos_ko'));		

		}


		quitarSpinner();

	}
	

	activarSpinner();

	// Peticion de tiempos
	var oReq = new XMLHttpRequest({
		mozSystem : true
	});
	oReq.onload = reqListener;
	oReq.open("POST", "http://isaealicante.subus.es/services/dinamica.asmx",
			true);

	var sr = '<?xml version="1.0" encoding="utf-8"?>'
			+ '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">'
			+ '<soap:Body>' + '<GetPasoParada xmlns="http://tempuri.org/">' +
			// '<linea>24</linea>'+
			// '<parada>4450</parada>'+
			'<parada>' + parada + '</parada>' + '<status>0</status>'
			+ '</GetPasoParada>' + '</soap:Body>' + '</soap:Envelope>';

	oReq.setRequestHeader('Content-Type', 'text/xml; charset=utf-8');

	oReq.send(sr);

}

/**
* Carga la hora de actualizacion en la cabecera
*
*/
function actualizarHora(){
	
	var dia = new Date();
	var hora = ("0" + dia.getHours()).slice(-2);
	var minutos = ("0" + dia.getMinutes()).slice(-2);	

	document.querySelector('#hora_actualiza').innerHTML = hora + ":" + minutos;

}

/**
* Formatear hora
*/
function formatearHora(hora, minutos){
	var hora = ("0" + hora).slice(-2);
	var minutos = ("0" + minutos).slice(-2);	
	
	return hora + ":" + minutos;
}

/**
 * Formatea los tiempos recibidos
 * 
 * @param minutos1
 * @param minutos2
 * @returns {String}
 */
function formatearTiempos(minutos1, minutos2) {

	console.debug("formatear: " + minutos1 + " - " + minutos2);

	var dato = '';

	if (minutos1 !== '0') {

		// Tiempo
		dato += minutos1 + " " + navigator.mozL10n.get('l10n_min');

		// Hora
		var dateTime = new Date();
		var minutos1Int = parseInt(minutos1);
		dateTime.setMinutes(new Date().getMinutes() + minutos1Int);
		dato += " (" + formatearHora(dateTime.getHours(),dateTime.getMinutes()) + ")"

	} else {
		
		
		
		dato += navigator.mozL10n.get('l10n_en_la_parada'); //"En la parada"
	}

	if (minutos2 !== '-1') {

		//dato += " " + "y" + " " + minutos2 + " " + "min."
		dato += " " + navigator.mozL10n.get('l10n_y') + " " + minutos2 + " " + navigator.mozL10n.get('l10n_min')

		// Hora
		var dateTime2 = new Date();
		var minutos2Int = parseInt(minutos2);
		dateTime2.setMinutes(new Date().getMinutes() + minutos2Int);
		dato += " (" + formatearHora(dateTime2.getHours(),dateTime2.getMinutes())
				+ ")"

	} else {
		//dato += "y" + " " + "Sin información"
		
		dato += " "+navigator.mozL10n.get('l10n_y')+" " + navigator.mozL10n.get('l10n_sin_info');
		
	}

	return dato;

}
