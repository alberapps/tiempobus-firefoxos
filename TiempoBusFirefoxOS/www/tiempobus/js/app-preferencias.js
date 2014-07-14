/**
 * TiempoBus - Informacion sobre tiempos de paso de autobuses en Alicante
 * Copyright (C) 2014 Alberto Montiel
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

/**
* Gestión de preferencias de la aplicacion
*/

//Preferencias
var preferencias = new Object();
preferencias.paradaInicial = '4450';
var autoPref = document.querySelector('#check_auto');

//Campo de entrada
var entradaParada = document.getElementById("parada-entrada");

/**
* Carga de las preferencias
*
*/
function cargarPreferencias(){

 if (localStorage.getItem("paradaInicial")) {    
    preferencias.paradaInicial = localStorage.getItem("paradaInicial");
    entradaParada.value = preferencias.paradaInicial;	

    console.debug('Cargada parada incicial: ' + preferencias.paradaInicial);

 }

console.debug('Cargada inicial pref auto: ' + localStorage.getItem("cargaAutomatica"));

 //Preferencia tiempos
 if (localStorage.getItem("cargaAutomatica") && localStorage.getItem("cargaAutomatica") == 'true') {
	preferencias.cargaAutomatica = true; 	
	autoPref.checked = true;	
 }else{
 	preferencias.cargaAutomatica = false;
	autoPref.checked =  false;
 }

//Evento para cuando cambie el valor
autoPref.addEventListener("change", function() {

	//Preferencia carga automatica
 	if (autoPref.checked) {
		preferencias.cargaAutomatica = true; 	
	}else{
 		preferencias.cargaAutomatica = false;
	}

	guardarPreferencia();
});

}
 

/**
* Guardar las preferencias en localStorage
*
*/ 
function guardarPreferencia(preferencia){
    
if(preferencia == 'paradaInicial' && preferencias.paradaInicial != entradaParada.value){

    localStorage.setItem("paradaInicial", entradaParada.value);
    preferencias.paradaInicial = entradaParada.value;

    console.debug('Guardar parada incicial: ' + preferencias.paradaInicial);

}else if(preferencia != 'paradaInicial'){

//Preferencias de la pantalla de preferencias

     localStorage.setItem("cargaAutomatica", autoPref.checked);
     
     console.debug('Guardar Pref Auto: ' + autoPref.checked);

     if(preferencias.cargaAutomatica){
	intervaloRecarga = setInterval(intervalo, 60000);
     }else{
        clearInterval(intervaloRecarga);
     }
	
}



}






