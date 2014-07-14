/**
 *  TiempoBus - Informacion sobre tiempos de paso de autobuses en Alicante
 *  Copyright (C) 2013 Alberto Montiel
 *
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
 * Funciones para el buscador
 *  
 */

var listaLineas = new Array();
var listaParadasIda = new Array();
var listaParadasVuelta = new Array();

/**
 * Activar progreso
 */
function activarSpinnerBuscador() {

	document.querySelector("#progreso-buscador").innerHTML = "<progress></progress>";

}

/**
 * Desactivar progreso
 */
function quitarSpinnerBuscador() {

	document.querySelector("#progreso-buscador").innerHTML = "";

}

/**
 * Mostrar listado de lineas en pantalla
 */
function mostrarListaLineas(listaLineas) {

	var htmlLineas = '';

	htmlLineas = '<ul>';

	for (var i = 0; i < listaLineas.length; i++) {

		htmlLineas += '<li><a href="#" id="linea--' + listaLineas[i].linea
				+ '">';
		htmlLineas += '<p>' + listaLineas[i].descripcion + '</p>';
		htmlLineas += '</a></li>';

	}

	htmlLineas += '</ul>';

	document.querySelector("#lista-lineas").innerHTML = htmlLineas;

	// Eventos de seleccion de linea
	for (var jj = 0; jj < listaLineas.length; jj++) {

		document.querySelector('#linea--' + listaLineas[jj].linea)
				.addEventListener('click', function() {

					console.log("linea seleccionada");
					seleccionLinea(this.id);

				});
	}

}

/**
 * Carga de lineas desde los listados de constantes
 */
function cargarLineas() {
	
	listaLineas = new Array();

	for (var i = 0; i < lineasNum.length; i++) {

		var linea = lineasNum[i];
		var descripcion = lineasDescripcion[i];

		var linea1 = new Object();

		linea1.linea = linea;
		linea1.descripcion = descripcion;

		listaLineas.push(linea1);

	}

	mostrarListaLineas(listaLineas);
}

/**
 * Seleccion de linea de la lista
 * 
 * @param lineaId
 */
function seleccionLinea(lineaId) {

	var sp = lineaId.split("--");

	var linea = sp[1];

	console.debug("seleccion linea: " + linea);

	document.querySelector('#cabecera_linea').innerHTML = getDescripcionLinea(linea); 

	// Ida
	cargarParadas(linea);

	// Vuelta
	//cargarParadas(linea, 'vuelta');

}

/**
 * Mostrar la lista de paradas, en funcion de ida o vuelta
 * 
 * @param listaParadas
 * @param sentido
 */
function mostrarListaParadas(listaParadas) {

	var htmlLineas = '';

	htmlParadas = '<ul>';

	for (var i = 0; i < listaParadas.length; i++) {

		htmlParadas += '<li><a href="#" id="parada' + sentido + '-'
				+ listaParadas[i].parada + '">';
		htmlParadas += '<p>' + listaParadas[i].parada + ' - '
				+ listaParadas[i].direccion + '</p>' 
				+ "<p>T: " + listaParadas[i].lineas +"</p>";
		htmlParadas += '</a></li>';

	}

	htmlParadas += '</ul>';

	// Carga del listado correspondiente
	//if (sentido == 'ida') {
		console.debug('sentido ida');
		document.querySelector("#lista-lineas").innerHTML = htmlParadas;
	//} else if (sentido == 'vuelta') {
	//	console.debug('sentido vuelta');
	//	document.querySelector("#lista-vuelta").innerHTML = htmlParadas;
	//}

	// Control de eventos de seleccion
	for (var jj = 0; jj < listaParadas.length; jj++) {

		document.querySelector(
				'#parada' + sentido + '-' + listaParadas[jj].parada)
				.addEventListener('click', function() {

					seleccionParada(this.id);

				});
	}

}

/**
 * Cargar la lista de paradas desde la web. En funcion del sentido
 * 
 * @param linea
 * @param sentido
 */
function cargarParadas(linea) {
	
	listaParadasIda = new Array();
	listaParadasVuelta = new Array();

	/**
	 * Funcion para gestionar la respuesta de la llamada
	 */
	function reqListenerParadas() {

	  try{

		var a = this.responseXML.documentElement;
		
		var folderPrincipalList = a.getElementsByTagName('Folder');
		
		if(folderPrincipalList.length == 2){
		

			//Caso 2 sin anidar

			var direccionalidad = folderPrincipalList.item(0).childNodes.item(1).childNodes.item(0).nodeValue;

			 if(direccionalidad === 'Ida'){
		        	folderIda = folderPrincipalList.item(0);
			        folderVuelta = folderPrincipalList.item(1);
		         }else{
		     	        folderIda = folderPrincipalList.item(1);
			        folderVuelta = folderPrincipalList.item(0);
		         }


			

		}else{


			var direccionalidad = folderPrincipalList.item(1).childNodes.item(1).childNodes.item(0).nodeValue;

			 if(direccionalidad === 'Ida'){
		        	folderIda = folderPrincipalList.item(1);
			        folderVuelta = folderPrincipalList.item(2);
		         }else{
		     	        folderIda = folderPrincipalList.item(2);
			        folderVuelta = folderPrincipalList.item(1);
		         }


		 }

		//var folderIda = folderPrincipalList.item(1);
		//var folderVuelta = folderPrincipalList.item(2);
		
		var items = folderIda.getElementsByTagName('Placemark');

		
		
		for(var a = 0; a < 2; ++a){
			
			if(a==0){
				items = folderIda.getElementsByTagName('Placemark');
				sentido = "ida"
			}else{
				items = folderVuelta.getElementsByTagName('Placemark');
				sentido = "vuelta"
			}
			
			
			
			
			
		
		for (var ii = 0; ii < items.length; ++ii) {
			
			item = items.item(ii);
			datosPlaceMark = item.childNodes;
			
			for (var j = 0; j < datosPlaceMark.length; ++j) {
				
				dato = datosPlaceMark.item(j);
				etiqueta = dato.nodeName;
				//console.log("etiqueta: " + etiqueta);
				
				if (etiqueta == "name") {
					direccion = dato.childNodes[0].nodeValue;
				}
				
				if(etiqueta == 'description'){
					
					descripcion = dato.childNodes[0].nodeValue;
					console.log("valor: " + descripcion);
					
					var procesaDesc = "";
					var parada = "";
					var sent = "";
					var neas = "";
					var lineas = "";
					var sentidoRecorrido = "";

					try{

						procesaDesc = descripcion.split(" ");

						parada = procesaDesc[3].trim();

						// posicion sentido
						sent = descripcion.indexOf("Sentido");
						neas = descripcion.indexOf("neas");

						// lineas conexion
						lineas = descripcion.substring(neas + 5, sent).trim();

						// Sentido
						sentidoRecorrido = descripcion.substring(sent + 8).trim();

						console.debug("parada: " + parada + "lineas: " + lineas
								+ "sentido: " + sentidoRecorrido);

					
					}catch(e){
					
					}

					var infoParada = new Object();

					infoParada.parada = parada;
					infoParada.descripcion = descripcion;
					infoParada.lineas = lineas;
					infoParada.sentido = sentidoRecorrido;
					infoParada.direccion = direccion;

					if(sentido == 'ida'){
						listaParadasIda.push(infoParada);
					}
					else{
						listaParadasVuelta.push(infoParada);
					}		
					
				}
				
				
			}
			
			mostrarListaParadas(listaParadasIda);
			document.querySelector('#panel1a').setAttribute('aria-selected','false');
			document.querySelector('#panel2a').setAttribute('aria-selected','true');
			document.querySelector('#panel3a').setAttribute('aria-selected','false');
			
		}
		
		}
		
		
		
	   }catch(e){
		
		console.error("error paradas", e);
		utils.status.show(navigator.mozL10n.get('l10n_error_paradas'));

	   }

		
	
		quitarSpinnerBuscador();

	};

	activarSpinnerBuscador();

	var listaParadas = new Array();

	//var url = generarUrlLinea(linea, sentido);

	var url = generarUrlLineaNuevo(linea);
		
	
	// Peticion de tiempos
	var oReq = new XMLHttpRequest({
		mozSystem : true
	});
	oReq.onload = reqListenerParadas;
	oReq.open("GET", url, true);

	oReq.setRequestHeader('Content-Type', 'text/xml; charset=utf-8');

	oReq.send();

}

/**
 * Seleccion de la parada
 * 
 * @param paradaId
 */
function seleccionParada(paradaId) {

	var sp = paradaId.split("-");

	var parada = sp[1];

	console.log("seleccion parada: " + parada);

	document.querySelector('#parada-entrada').value = parada;

	document.querySelector('#buscador').className = 'right';
	document.querySelector('[data-position="current"]').className = 'current';

	activarSpinner();
	
	cargarTiempos(document.querySelector('#parada-entrada').value);

}

/*******************************************************************************
 * DATOS LINEAS
 */

// Informacione estatica de las lineas
const
lineasDescripcion = ["21 ALICANTE-P.S.JUAN-EL CAMPELLO","22 ALICANTE-C. HUERTAS-P.S. JUAN","23 ALICANTE-SANT JOAN-MUTXAMEL","24 ALICANTE-UNIVERSIDAD-S.VICENTE","25 ALICANTE-VILLAFRANQUEZA","26 ALICANTE-VILLAFRANQUEZA-TANGEL","27 ALICANTE(O.ESPLA) - URBANOVA","30 SAN VICENTE-LA ALCORAYA","C-55 EL CAMPELLO-UNIVERSIDAD","35 ALICANTE-PAULINAS-MUTXAMEL","36 SAN GABRIEL-UNIVERSIDAD","38 P.S.JUAN-H.ST.JOAN-UNIVERSIDAD","39 EXPLANADA - C. TECNIFICACIÓN","21N ALICANTE- P.S.JUAN-EL CAMPELLO","22N ALICANTE- PLAYA SAN JUAN","23N ALICANTE-SANT JOAN- MUTXAMEL","24N ALICANTE-UNIVERSIDAD-S.VICENTE","01 S. GABRIEL-JUAN XXIII  (1ºS)","02 LA FLORIDA-SAGRADA FAMILIA","03 CIUDAD DE ASIS-COLONIA REQUENA","04 CEMENTERIO-TOMBOLA","05 EXPLANADA-SAN BLAS-RABASA","06 AV.ÓSCAR ESPLÁ - COLONIA REQUENA","07 AV.ÓSCAR ESPLÁ-EL REBOLLEDO","8A EXPLANADA -VIRGEN REMEDIO","09 AV.ÓSCAR ESPLÁ - AV. NACIONES","10 EXPLANADA - VIA PARQUE","11 V.REMEDIO-AV DENIA (JESUITAS)","11H V.REMEDIO-AV. DENIA-HOSP.ST JOAN","12 AV. CONSTITUCION-S. BLAS(PAUI)","16 PZA. ESPAÑA-MERCADILLO TEULADA","17 ZONA NORTE-MERCADILLO TEULADA","8B EXPLANADA-VIRGEN DEL REMEDIO","191 PLA - CAROLINAS - RICO PEREZ","192 C. ASIS - BENALUA - RICO PEREZ","M MUTXAMEL-URBANITZACIONS","136 MUTXAMEL - CEMENTERIO","C2 VENTA LANUZA - EL CAMPELLO","C-51 MUTXAMEL - BUSOT","C-52 BUSOT - EL CAMPELLO","C-53 HOSPITAL SANT JOAN - EL CAMPELLO","C-54 UNIVERSIDAD-HOSP. SANT JOAN","C-6 ALICANTE-AEROPUERTO","45 HOSPITAL-GIRASOLES-MANCHEGOS","46A HOSPITAL-VILLAMONTES-S.ANTONIO","46B HOSPITAL-P.CANASTELL-P.COTXETA","TURI BUS TURÍSTICO (TURIBUS)","31 MUTXAMEL-ST.JOAN-PLAYA S. JUAN","30P SAN VICENTE-PLAYA SAN JUAN","C-6* ALICANTE-URBANOVA-AEROPUERTO"];
const
lineasCodigoKml = ["ALC21","ALC22","ALC23","ALC24","ALC25","ALC26","ALC27","ALC30","ALCC55","ALC35","ALC36","ALC38","ALC39","ALC21N","ALC22N","ALC23N","ALC24N","MAS01","MAS02","MAS03","MAS04","MAS05","MAS06","MAS07","MAS8A","MAS09","MAS10","MAS11","MAS11H","MAS12","MAS16","MAS17","MAS8B","MAS191","MAS192","MUTM","MUT136","CAMPC2","ALCC51","ALCC52","ALCC53","ALCC54","ALCC6","ALCS45","ALCS46A","ALCS46B","Turibus","ALC31","ALC30B","ALCC6"];
const
lineasNum = ["21","22","23","24","25","26","27","30","C-55","35","36","38","39","21N","22N","23N","24N","01","02","03","04","05","06","07","8A","09","10","11","11H","12","16","17","8B","191","192","M","136","C2","C-51","C-52","C-53","C-54","C-6","45","46A","46B","TURI","31","30P","C-6*" ];

//Posicion de la linea
function getDescripcionLinea(linea){
  for (var ii = 0; ii < lineasNum.length; ++ii) {
     if(linea == lineasNum[ii]){
        return lineasDescripcion[ii];
     }
  }	

  return "";
}

/**
 * Url de consulta de la linea. Indicar el sentido de ida o vuelta
 * 
 * @param linea
 * @param sentido
 * @returns {String}
 */
function generarUrlLinea(linea, sentido) {

	var url = "http://www.subus.es/Lineas/kml/";

	var urlSufijoIda = "";

	if (sentido === "ida") {
		urlSufijoIda = "ParadasIda.xml";
	} else {
		urlSufijoIda = "ParadasVuelta.xml";
	}

	var indiceLinea = lineasNum.indexOf(linea);

	var urlIda = url + lineasCodigoKml[indiceLinea] + urlSufijoIda;

	console.debug("urlIda: " + urlIda);

	return urlIda;

	
	//http://www.subus.es/K/ALC24P.xml
}

function generarUrlLineaNuevo(linea) {

	var url = "http://www.subus.es/K/";

	var urlSufijo = "";

	
	urlSufijo = "P.xml";
	

	var indiceLinea = lineasNum.indexOf(linea);

	var urlCompleta = url + lineasCodigoKml[indiceLinea] + urlSufijo;

	console.debug("urlIda: " + urlCompleta);

	return urlCompleta;

		
}


