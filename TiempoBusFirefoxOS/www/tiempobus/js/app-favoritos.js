/**
 *  TiempoBus - Informacion sobre tiempos de paso de autobuses en Alicante
 *  Copyright (C) 2013 Alberto Montiel
 *
 *	Based on mozilla.org examples: https://developer.mozilla.org/en-US/docs/IndexedDB/Using_IndexedDB
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
 * 
 */

/**
 * Mostrar la lista de favoritos en pantalla
 */
function mostrarListaFavoritos(listaFavoritos) {

	console.debug("lista Favoritos: " + listaFavoritos.length);

	var htmlFavoritos = '';

	htmlFavoritos = '<ul>';

	for (var i = 0; i < listaFavoritos.length; i++) {

		htmlFavoritos += '<li><a href="#" id="fav-' + listaFavoritos[i].parada
				+ '">';
		htmlFavoritos += '<p>' + listaFavoritos[i].parada + ' '
				+ listaFavoritos[i].titulo + '</p>';
		htmlFavoritos += '<p>' + listaFavoritos[i].descripcion + '</p>';
		htmlFavoritos += '</a></li>';

	}

	htmlFavoritos += '</ul>';

	// Actualizar componente
	document.querySelector("#lista-favoritos").innerHTML = htmlFavoritos;

	// Eventos de seleccion de filas
	for (var jj = 0; jj < listaFavoritos.length; jj++) {

		document.querySelector('#fav-' + listaFavoritos[jj].parada)
				.addEventListener('click', function() {

					seleccionFavorito(this.id);

				});
	}


}


/**
 * Configuracion e inicializacion de la base de datos
 */

const DB_NAME = 'tiempobus-indexeddb';
const DB_VERSION = 1; 
const DB_STORE_NAME = 'favoritos';

var db;

// Abrir base de datos
openDb();


/**
 * Abrir la base de datos
 * 
 */
function openDb() {
    console.log("openDb ...");
    var req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onsuccess = function (evt) {
      // Better use "this" than "req" to get the result to avoid problems with
      // garbage collection.
      // db = req.result;
      db = this.result;
      console.log("openDb DONE");
    };
    req.onerror = function (evt) {
      console.error("openDb:", evt.target.errorCode);
    };

    req.onupgradeneeded = function (evt) {
      console.log("openDb.onupgradeneeded");
      var store = evt.currentTarget.result.createObjectStore(
        DB_STORE_NAME, { keyPath: 'parada'});

      store.createIndex('titulo', 'titulo', { unique: false });
      store.createIndex('descripcion', 'descripcion', { unique: false });
      
    };
  }

/**
 * @param {string}
 *            store_name
 * @param {string}
 *            mode either "readonly" or "readwrite"
 */
function getObjectStore(store_name, mode) {
  var tx = db.transaction(store_name, mode);
  return tx.objectStore(store_name);
}

function clearObjectStore(store_name) {
  var store = getObjectStore(DB_STORE_NAME, 'readwrite');
  var req = store.clear();
  req.onsuccess = function(evt) {
    
	  // TODO
	  
  };
  req.onerror = function (evt) {
    console.error("clearObjectStore:", evt.target.errorCode);

    // TODO
    
  };
}



/**
 * @param {IDBObjectStore=}
 *            store
 */
function cargarFavoritos(store) {
  console.log("cargar lista favoritos");

  if (typeof store == 'undefined')
    store = getObjectStore(DB_STORE_NAME, 'readonly');

  

  var req;
  req = store.count();
  // Requests are executed in the order in which they were made against the
  // transaction, and their results are returned in the same order.
  // Thus the count text below will be displayed before the actual pub list
  // (not that it is algorithmically important in this case).
  req.onsuccess = function(evt) {
    // pub_msg.append('<p>There are <strong>' + evt.target.result +
      // '</strong> record(s) in the object store.</p>');
	  
	  console.error("resultados: " + evt.target.result);
	  
  };
  req.onerror = function(evt) {
    console.error("add error", this.error);
    utils.status.show(navigator.mozL10n.get('l10n_favorito_guardar_ko'));
  };

  var i = 0;
  var listaFavoritos = new Array();
  req = store.openCursor();
  req.onsuccess = function(evt) {
    var cursor = evt.target.result;

    // If the cursor is pointing at something, ask for the data
    if (cursor) {
      console.debug("displayPubList cursor:", cursor);
      req = store.get(cursor.key);
      req.onsuccess = function (evt) {
          
    	  var value = evt.target.result;
    	  
    	 
  		
  			  
  			  var parada = cursor.key;
  				var titulo = cursor.value.titulo;
  				var descripcion = cursor.value.descripcion; 
  				
  				var favorito1 = new Object();
  				
  				favorito1.parada = parada;
  				favorito1.titulo = titulo;
  				favorito1.descripcion = descripcion;

  				listaFavoritos.push(favorito1);
  			  
  			 console.debug("dato: " + cursor.key + " es " + cursor.value.titulo);
  			
      };	 
  			 
  			 
  		    cursor.continue();
  		  }
  		  else {
  			  console.debug("fin entradas");
  			  
  			  // Cargar listado en pantalla
  			  mostrarListaFavoritos(listaFavoritos);
  			  
  		  }
  		};
    	  
    

     
}



/**
 * @param {string}
 *            biblioid
 * @param {string}
 *            title
 * @param {number}
 *            year
 * @param {Blob=}
 *            blob
 */
function addFavorito(newParada, newTitulo, newDescripcion) {
	
	// Si es una modificacion
	if(favoritoSeleccionadoModificar != ''){
		
		eliminarFavorito(favoritoSeleccionadoModificar);
		
		newParada = favoritoSeleccionadoModificar;
		favoritoSeleccionadoModificar = '';
		
	}
	
  
  var obj = {parada: newParada, titulo: newTitulo, descripcion: newDescripcion };
 
  var store = getObjectStore(DB_STORE_NAME, 'readwrite');
  var req;
  try {
    req = store.add(obj);
  } catch (e) {
    
    throw e;
  }
  req.onsuccess = function (evt) {
    console.log("Insertion in DB successful");
    document.querySelector('#input-titulo').value = ''; 
	document.querySelector('#input-descrip').value = '';
	document.querySelector('#favoritos-nuevo').className = 'right';
	document.querySelector('[data-position="current"]').className = 'current';
	utils.status.show(navigator.mozL10n.get('l10n_favorito_ok'));
  };
  req.onerror = function() {
	  utils.status.show(navigator.mozL10n.get('l10n_favorito_ko'));
  };
}


var favoritoSeleccionado = '';
var favoritoSeleccionadoModificar = '';


/**
 * Seleccion de favorito en pantalla
 * 
 * @param paradaId
 */
function seleccionFavorito(paradaId) {

	var sp = paradaId.split("-");

	var parada = sp[1];

	console.log("seleccion favorito: " + parada);

	favoritoSeleccionado = parada;
		
	
	document.querySelector('#action-menu-favoritos').className = 'fade-in';
	
}

/**
 * Cargar el tiempo seleccionado de favoritos
 * 
 * @param parada
 */
function cargarTiemposFavorito(parada) {

	
	console.log("seleccion favorito: " + parada);

	document.querySelector('#parada-entrada').value = parada;

	document.querySelector('#favoritos').className = 'right';
	document.querySelector('[data-position="current"]').className = 'current';

	cargarTiempos(document.querySelector('#parada-entrada').value);

}

/**
 * Eliminar el favorito seleccionado
 */
function eliminarFavorito(parada){
	
	var request = db.transaction(["favoritos"], "readwrite")
    .objectStore("favoritos")
    .delete(parada);

	
	request.onsuccess = function(event) {
		utils.status.show(navigator.mozL10n.get('l10n_favorito_borrado_ok'));
		
		cargarFavoritos();
		
	};
	
	request.onerror = function() {
		  utils.status.show(navigator.mozL10n.get('l10n_favorito_borrado_ko'));
	  };
}


/**
 * Seleccion de favorito para editar
 */
function editarFavorito(parada){
	
	var transaction = db.transaction(["favoritos"]);
	var objectStore = transaction.objectStore("favoritos");
	var request = objectStore.get(parada);
	request.onerror = function(event) {
		utils.status.show(navigator.mozL10n.get('l10n_favorito_recupera_ko'));
	};
	request.onsuccess = function(event) {
	 
		favoritoSeleccionadoModificar = parada;
		
		document.querySelector('#input-titulo').value = request.result.titulo; 
		document.querySelector('#input-descrip').value = request.result.descripcion;
	  
		document.querySelector('#favoritos-nuevo').className = 'current';
		document.querySelector('[data-position="current"]').className = 'left';
	  	  
	  
	};
	
	
	
}
