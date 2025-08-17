const profesorado = document.getElementById('profesorado');
const ciclosmodulos = document.getElementById('ciclosmodulos');
maximoProfesor=0;
maximoCiclo=0;
maximoModulo=0;
cargaDatos();
let numProfeActualiza=0;
let numCicloActualiza=0;
let numModuloActualiza=0;


function creaCadenaHorario(){
    cadenaProfesorado = creaCadenaProfesorado();
    cadenaCiclos = creaCadenaCiclos();
    CadenaHorario =  "{" + cadenaProfesorado + "," + cadenaCiclos+ "}";
    return CadenaHorario;
}
function creaCadenaProfesorado(){

    let cadenaProfesorado = '"profesorado": [{"nombre": "Jose Luis BenitoAndújar","horas": 0,"tipo": "PS"}]';
    cadenaProfesorado = '"profesorado": [';
    for ( i=0; i<profesorado.children.length; i++ ){
        hijo = profesorado.children[i];
        nombre = hijo.getAttribute('nombre');
        horas = hijo.getAttribute('horas');
        tipo = hijo.getAttribute('tipo');
        if (hijo.getAttribute('profe')!=null) { //SI ES UN PROFE
            cadenaProfe= '{"nombre": "'+nombre+'","horas":'+horas+',"profe":"si","tipo": "'+tipo+'"}';
        } else { //SI ES UN MÓDULO
            ciclo = hijo.getAttribute('ciclo');
            id = hijo.getAttribute('id');
            cadenaProfe= '{"nombre": "'+ nombre +'","horas":'+horas+',"ciclo": "'+ciclo+'","id": "'+id+'","tipo": "'+tipo+'"}';
        }
        if (i===0){
            cadenaProfesorado = cadenaProfesorado +cadenaProfe;
        }
        else
        {
            cadenaProfesorado = cadenaProfesorado +','+cadenaProfe;
        }
       
    }
    cadenaProfesorado = cadenaProfesorado + ']'
    return cadenaProfesorado;
}
function creaCadenaCiclos(){
    let cadenaCiclos = '"ciclos": [{"nombre": "CMS1B","modulos": [{"nombre":"Aplicaciones Web","horas": 6,	"tipo": "PS","id":"1",clonado":"2", profe": "u"}]}]';
    cadenaCiclos = '"ciclos":[';
    let abiertoCiclos = false;
    let abiertoModulos = false;
    for ( i=0; i<ciclosmodulos.children.length; i++ ){
        hijo = ciclosmodulos.children[i];
        nombre = hijo.getAttribute('nombre');
        tipo = hijo.getAttribute("tipo");

        if ( tipo=="ciclo") { //SE TRATA DE UNO CICLO
            if (abiertoCiclos ) {
                cadenaCiclos=cadenaCiclos + ']},';
            }
            abiertoModulos = false;
            cadenaCiclos = cadenaCiclos + '{"nombre":"' + nombre + '","modulos": [';
            abiertoCiclos = true;
        } else { //SE TRATA DE UN MÓDULO
            if  (abiertoModulos ) {
                cadenaCiclos = cadenaCiclos+',';
            }
            profe = hijo.getAttribute("profe");
            
            id = hijo.getAttribute("id");
            horas = hijo.getAttribute("horas");
            //clonado = hijo.getAttribute("clonado")?hijo.getAttribute("clonado"):'';
            if ( hijo.getAttribute("clonado")!=null ){
                cadenaClonado = '","clonado":"'+hijo.getAttribute("clonado")+'","profe":"'+profe;
            } else {
                cadenaClonado ='';
                }

            cadenaCiclos = cadenaCiclos +'{"nombre":"' + nombre +'","horas":'+ horas+ ',"tipo": "' + tipo + '","id":"' + id + cadenaClonado + '"}'   ; 
            abiertoModulos=true;
        }

        }
        if ( abiertoCiclos ) {
            cadenaCiclos=cadenaCiclos + ']}'; //cierro el ciclo abierto
        }
        cadenaCiclos=cadenaCiclos + ']'; //cierro todos los ciclos
        

    
    
    return cadenaCiclos;
}




function clear(node) {
  while (node.hasChildNodes()) {
    clear(node.firstChild);
  }
  
  
     node.parentNode.removeChild(node);

  
  //console.log(node, "cleared!");
}

function reinicia(){
    for ( i=0; i<profesorado.childNodes.length; i++) {
         p=profesorado.childNodes[i];
         clear(p);
    }
    //cargaDatos(true);

}
function deshabilitaControlesProfe(){
    for (const hijo of profesorado.children) {
          if (hijo.getAttribute('profe')!=null) { //SI ES UN PROFE
                if (hijo.nextSibling) {
                        let siguienteHijo=hijo.nextSibling;
                        if (siguienteHijo.getAttribute('profe')==null){ //si el siguiente hijo no es un profe, deshabilita los botonoes
                              hijo.style.pointerEvents = 'none';
                              hijo.title = "Para borrar o editar este profe debe eliminar sus módulos";
                        } else { hijo.style.pointerEvents = 'auto' }
                        
                } else {
                    hijo.style.pointerEvents = 'auto'
                }
          }
    
    } //fin de for
}// fin de deshabilitaControlesProfe

function cargaDatos(reinicia){

        if (true) {
           let horario = {};
          
            //fetch('horariosFERNANDO.json')
            fetch('fetchuserdata.php')
                    .then(function(response) {
                     if (!response.ok) {
                          throw new Error('OH OH No se pudo cargar el archivo JSON.');
                    }
                return response.json(); // Convertimos la respuesta a JSON
            })
            .then(function(data) {
                // La variable "data" ahora contiene el objeto JavaScript
                //console.log(data);

                // Puedes acceder a las propiedades del objeto, por ejemplo:
                //let cadenaCentro = "Centro:"+ data.centro; // Asumiendo que el JSON original tiene "campo1"
                
                horario = data.datos;
                //bucle sobre el profesorado
          for ( i=0;i<horario.profesorado.length;i++ ) {
           nombre = horario.profesorado[i].nombre;
           horas = horario.profesorado[i].horas;
           tipo = horario.profesorado[i].tipo;
           profe = horario.profesorado[i].profe;
           let profesor = document.createElement("div");
           profesor.setAttribute('horas',horas);
           profesor.setAttribute('tipo',tipo);
           profesor.setAttribute('nombre',nombre);
           if ( horario.profesorado[i].profe!=null) {

             profe=maximoProfesor;
              maximoProfesor++;
               profesor.setAttribute('profe',profe);
               pintaProfe(profesor);
           } else { //no es un profesor 
               if ( !reinicia ) {//cuando reinicia no carga los módulos asignados
               profesor.setAttribute('ciclo',profe = horario.profesorado[i].ciclo);
               profesor.setAttribute('id',profe = horario.profesorado[i].id);
               pintaModuloColocado(profesor);
               }
           }
           
           profesorado.appendChild(profesor);
          } //FIN del bucle sobre el profesorado
          
          
          deshabilitaControlesProfe(); //cuando acaba de pintar los profes comprueba los botones
          
          //bucle sobre los ciclos
           for ( i=0; i<horario.ciclos.length;i++){
               nombreCiclo=horario.ciclos[i].nombre;
               
               /** lo añade a la lista de ciclos del formulario modal **/
               listaCiclos=document.getElementById('listaCiclos');
                let cicloLista = document.createElement("option");
                cicloLista.innerHTML = nombreCiclo;
                cicloLista.setAttribute("value",nombreCiclo);
                listaCiclos.appendChild(cicloLista);
               /** FIN lo añade a la lista de ciclos del formulario modal **/
                
               let ciclo = document.createElement("div");
               ciclo.setAttribute('nombre',nombreCiclo);
               ciclo.setAttribute('tipo',"ciclo"); // con esto marca el elemento como ciclo, no como móduloç
               //los ciclos se enumeran con el atributo numciclo
               ciclo.setAttribute('numciclo',maximoCiclo);
               maximoCiclo+=1;
               
               pintaCiclo(ciclo);
               ciclosmodulos.appendChild(ciclo);
               //ahora añade los módulos
               for ( j=0; j<horario.ciclos[i].modulos.length;j++){
                   let modulo = horario.ciclos[i].modulos[j];
                   nombreModulo = modulo.nombre;
                   horasModulo = modulo.horas;
                   tipoModulo = modulo.tipo;
                   profeModulo = modulo.profe;
                   clonadoModulo = modulo.clonado;
                   idModulo = modulo.id;
                   if ( idModulo==null) {
                       idModulo = maximoModulo+1;
                       maximoModulo = idModulo
                   }
                   idModuloNum = parseInt(idModulo);
                   if ( idModuloNum> maximoModulo ) {
                       maximoModulo=idModuloNum;
                   }
                   let capaModulo = document.createElement("div");
                   capaModulo.setAttribute('horas',horasModulo);
                   capaModulo.setAttribute('nombre',nombreModulo);
                   capaModulo.setAttribute('tipo',tipoModulo);
                   if (modulo.profe) {
                       capaModulo.setAttribute('profe',profeModulo);
                   }
                   
                   capaModulo.setAttribute('ciclo',nombreCiclo);
                   capaModulo.setAttribute('id',idModulo);
                   if ( reinicia ) {
                        modulo.clonado = false
                   }
                   
                   if ( modulo.clonado ) {
                   capaModulo.setAttribute('clonado',modulo.clonado );
                   }
                   pintaModulo(capaModulo);
                   ciclosmodulos.appendChild(capaModulo);
                
                   
               }
               
               
           }// FIN de bucle sobre los ciclos
                // Aqu铆 puedes realizar cualquier operaci贸n que necesites con los datos del archivo JSON
            })//FIN DEL TODO VA BIEN
            .catch(function(error) {
                console.error('Se produjo un error al cargar el archivo JSON:', error);
            });

                // Accediendo a las propiedades del objeto 'datos'
               
               
          // profesorado = document.getElementById("profesorado");
          //horario = data.datos;
          
        } //fin del if
        }//fin del function

function escribeDatos(jsonArr){
    fetch('updateJson.php', {
                method: 'PUT', // O 'POST', según tu API
                headers: {
                    'Content-Type': 'application/json',
                },
                // body: JSON.stringify(jsonArr) // Convierte el objeto a JSON
                body: jsonArr
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la red: ' + response.status);
                }
                return response.json(); // Devuelve la respuesta como JSON
            })
            .then(data => {
                console.log('Datos actualizados:', data);
                // Manejar la interfaz de usuario según lo necesario
                cargados=true;
            })
            .catch(error => {
                console.error('Hubo un problema con la solicitud Fetch:', error);
            }); 
}

function pintaProfe(e) { //escribe el contenido de la div según sus atributos
    e.classList.add("titulo");
    e.classList.add("list-group-item");
	horasProfe = e.getAttribute("horas");
	nombreProfe = e.getAttribute("nombre");
	tipoProfe =  e.getAttribute("tipo");
	if (horasProfe < 19) {
		color = "red";
	} else {
		color = "green";
	}
	estilo = " style='color:" + color + "'";
	if ( tipoProfe=="PS" ) {
	    e.style.backgroundColor="aqua";
	} else {
	    e.style.backgroundColor="antiquewhite";
	}
	e.innerHTML = "<span style='font-weight:bold'>" + tipoProfe + " " + 
	nombreProfe + "<span" + estilo + ">" + " ( " + horasProfe + " h)" + "</span>" +
	"</span>" 
	+ '<a style="float:right" data-toggle="modal" onclick="editaProfesor(this,2)" href="" >Editar</a>'
	+ '  '+ '<a style="float:right" data-toggle="modal" onclick="borraCajas(this,1)" href="" >Borrar</a>';
    deshabilitaControlesProfe();
    
}
function pintaCiclo(e){
    e.classList.add("titulo");
    e.classList.add("list-group-item");
    nombreCiclo = e.getAttribute("nombre");
    e.innerHTML = '<span style="font-weight:bold">' + nombreCiclo +'</span>'+ '<a style="float:right" data-toggle="modal" onclick="editaCiclo(this,2)" href="" >Editar</a>';
}
function borraModulo(e){
    		if ( confirm('Está seguro de que quieres borrar el módulo?. De todos modos los cambios no serán definitivos hasta que guarde los datos')==true ) {
			 //elem = e.parentNode;
			 elem = document.getElementById("1");
			 elem.parentNode.removeChild(elem);       

	    } else {
		}
}


function pintaModulo(e) {
	horasModulo = e.getAttribute("horas");
    e.classList.add("list-group-item");
	nombre = e.getAttribute("nombre");
	//ciclo = e.getAttribute("ciclo");
	tipo = e.getAttribute("tipo");
	cadenaProfe = "";
	if (e.getAttribute("profe") != null) {
		nombreProfe = e.getAttribute("profe");
		cadenaProfe = "->" + nombreProfe;
		cadenaEdicion = "";
		e.style.cursor = "default";
	} else {
	    e.style.cursor = "move";
	    cadenaEdicion ='<a style="float:right" data-toggle="modal" onclick="editaModulo(this)" href="" >Editar</a> '
	+ '<a style="float:right" data-toggle="modal" onclick="borraCajas(this,2)" href="" >Borrar</a> ';
	}
	e.style.fontWeight="normal"; 
	if ( tipo=="PT") {
	    e.style.backgroundColor="FloralWhite";
	    
	}
	if ( tipo=="PS") {
	    e.style.backgroundColor="LightCyan";
	}

	e.innerHTML = "<i class='fas fa-grip-lines'></i>"+ nombre + "(" + horasModulo + "h) " + tipo + cadenaProfe + cadenaEdicion;
	if (e.getAttribute("clonado")!=null ) {
			e.style.color = "red";
		e.style.opacity = "0.5";
		e.style.fontWeight="bold";
		e.classList.add('titulo');
	} 
}

function pintaModuloColocado(e) {
	horasModulo = e.getAttribute("horas");
	ciclo = e.getAttribute("ciclo");
    e.classList.add("list-group-item");
    tipo = e.getAttribute("tipo");
    if ( tipo=="PT") {
	    e.style.backgroundColor="FloralWhite";
	    e.style.cursor = "move";
	}
	if ( tipo=="PS") {
	    e.style.backgroundColor="LightCyan";
	    e.style.cursor = "move";
	}
	nombre = e.getAttribute("nombre");
	//ciclo = e.getAttribute("ciclo");

	cadenaProfe = "";

	e.innerHTML = "<i class='fas fa-grip-lines mr-2'></i>"+ nombre + "(" + horasModulo + "h) " + tipo + "["+ ciclo +"]";

}
function reiniciaModulo(e){
	e.classList.remove('titulo');
	e.removeAttribute('clonado');
	e.removeAttribute('profe'); //ya no está asociado a ningún profe
	e.style.color = "black";
	e.style.opacity = 1;
	pintaModulo(e);

}

const listaProfesorado = Sortable.create(profesorado, {
	group: {
		name: "lista-tareas",
		pull: true,
		
		put: true
	},
	animation: 150,
	easing: "cubic-bezier(0.895, 0.03, 0.685, 0.22)",
	handle: ".fa-grip-lines",
	filter: ".titulo",
	// ghostClass: "active",
	chosenClass: "active",
	//dragClass: "invisible"
	dataIdAttr: "data-identificador",
	sort: false,
	/* onChoose: (evento) => {
		console.log('Se ha seleccionado un elemento')},
	onUnchoose: (evento) => { console.log('Se ha deseleccionado un elemento') },
	onStart: (evento) => { console.log('Se inicio el drag and drop') },
	
	onEnd: (evento) => { console.log('On End') },

	*/
	
	onAdd: (evt) => { //AGREGO UN ELEMENTO A LA LISTA DE PROFES
		elementoAdd = evt.item;
		//le pongo el nombre del ciclo al final del nombre
		let ciclo = elementoAdd.getAttribute("ciclo");
		pintaModuloColocado(elementoAdd);
		//elementoAdd.innerHTML = elementoAdd.innerHTML + "["+ciclo+"]";
		let horasAdd = elementoAdd.getAttribute('horas'); //averiguo las horas del elemento añadido
		let tipoAdd = elementoAdd.getAttribute('tipo'); //averiguo las horas del elemento añadido
		let idAdd = elementoAdd.getAttribute('id'); //averiguo el id del elemento añadido
		let padre = elementoAdd.parentElement;
		//no se puede poner el primero para eso averguo en que posición está
		esPrimero=false;
		for (i = 0; i < padre.children.length; i++){
			let hijo = padre.children[i];
			let idHijo = hijo.getAttribute('id');
			if (idHijo == idAdd && i==0 ) {
				console.log( "indice: "+ i);
				elementoAdd.parentNode.removeChild(elementoAdd); //borro el elemento si lo ha colocado al principio
				esPrimero=true;
				let elementoClonado = document.querySelector("div[clonado='" + idHijo + "'");
				reiniciaModulo(elementoClonado);
			}
		}
		if (!esPrimero) {
			encontrado = false;
			for (i = padre.children.length - 1; i >= 0; i--) { //recorro los elementos hijo del último al primero
				let hijo = padre.children[i];
				let idHijo = hijo.getAttribute('id');
				if ( idHijo == idAdd ) {
					encontrado = true;
				}
				//console.log(hijo);
				if (hijo.classList.contains("titulo") && encontrado) { //SI ES PROFESOR
					let horasProfe = 0;
					if (hijo.getAttribute("horas")) {
						horasProfe = hijo.getAttribute("horas");
					}
					horasProfe = parseInt(horasProfe) + parseInt(horasAdd);
                    tipoProfe = hijo.getAttribute("tipo"); //averigua el tipo PS o PT del profe
					hijo.setAttribute("horas", horasProfe); //guarda en el atributo el número de horas
					nombreProfe = hijo.getAttribute("nombre");
					if ( tipoAdd!=tipoProfe ){
					    alert("Vas a signar un modulo de " +tipoAdd + " a docente " + tipoProfe ); 
					}
					
    					pintaProfe(hijo);
    					//ahora pone el nombre del profe en la lista de la derecha
    					let elementoClonado = document.querySelector("div[clonado='" + idAdd + "'");
    
    					//elementoClonado.innerHTML = elementoClonado.innerHTML + "->" + nombreProfe;
    					elementoClonado.setAttribute("profe", nombreProfe);
    					pintaModulo(elementoClonado);
    					break;
					
				} else { //SI ES UN MÓDULO 

				}
				horas = hijo.getAttribute('horas');
			}
		}
		deshabilitaControlesProfe();
	},

	onRemove: (evt) => {
		

	 },
		/*
	onUpdate: (evento) => { console.log('Se actualizo la lista') },
	onFilter: (evento) => { console.log('Se intento mover un elemento filtrado') },
	onMove: (evento) => { console.log('Se movio un elemento') }, 
	onChange: (evt) => {
		console.log('CHANGE')
	},
/*	store: {
		set: function(sortable){
			const orden = sortable.toArray();
			localStorage.setItem('lista-tareas', orden.join('|'));
		},

		get: function(){
			const orden = localStorage.getItem('lista-tareas');
			return orden ? orden.split('|') : [];
		}
	},*/

	 /* onChoose: (evento) => { 
	 	console.log('Se ha seleccionado un elemento')
	 },
	 onUnchoose: (evento) => { console.log('Se ha deseleccionado un elemento') },
	 onStart: (evento) => { console.log('Se inicio el drag and drop') },
	 onEnd: (evento) => { console.log('On End') },
	 onAdd: (evento) => { console.log('Se agrego un elemento a la lista') },
	 onRemove: (evento) => { console.log('Se elimino un elemento a la lista') },
	 onUpdate: (evento) => { console.log('Se actualizo la lista') },
	 onFilter: (evento) => { console.log('Se intento mover un elemento filtrado') },
	 onMove: (evento) => { console.log('Se movio un elemento') },
	 onChange: (evento) => { console.log('Un elemento cambio de lugar') }, */
});

const sortablaCiclosModulos = Sortable.create(ciclosmodulos, {
	group: {
		name: "lista-tareas",
		pull: "clone",
		put: true
	},
	animation: 150,
	easing: "cubic-bezier(0.895, 0.03, 0.685, 0.22)",
	handle: ".fa-grip-lines",
	filter: ".titulo",
	// ghostClass: "active",
	chosenClass: "active",
	sort:false,
	//dragClass: "invisible"
	/**onEnd: (evt) => {
		var itemEl = evt.item;  // dragged HTMLElement
		console.log(itemEl);    // muestra el objeto
		var id = itemEl.getAttribute("id");
		console.log("id:" + id);
		alert("id:" + id);
		let modulos = document.getElementById(id);
		modulos.style.color="red";

	},*/

	// Called when creating a clone of element
	onClone: function (/**Event*/evt) {
		var origEl = evt.item;
		var cloneEl = evt.clone;
		//console.log(origEl);
		//console.log(cloneEl);
		cloneEl.style.color = "red";
		cloneEl.style.opacity = "0.5";
		cloneEl.classList.add('titulo');
		let id = origEl.getAttribute("id");
		cloneEl.setAttribute("clonado",id); //"Marca" elemento clonado con el atributo "clonado" y el id
		/*var id = origEl.getAttribute("id");

		let modulos = document.getElementById(id);
		modulos.style.color = "green";*/

	},
	onAdd: (evt) => {//cuando "devuelvo un módulo a la lista"
		elementoAdd = evt.item;
		let id = elementoAdd.getAttribute("id");
		let elementoClonado=document.querySelector("div[clonado='"+id+ "'");
		/*elementoClonado.style.color="black";
		elementoClonado.style.opacity = 1;
		elementoClonado.classList.toggle('titulo');
		elementoClonado.removeAttribute('clonado');*/
		let nombreProfe = elementoClonado.getAttribute('profe');
		let profeAsociado= document.querySelector("div[nombre='" + nombreProfe + "'");
		let horasprofeAsociado = parseInt(profeAsociado.getAttribute("horas"));
		let horasModulo = parseInt(elementoClonado.getAttribute("horas"));
		horasprofeAsociado = horasprofeAsociado - horasModulo;
		profeAsociado.setAttribute("horas", horasprofeAsociado);
		pintaProfe(profeAsociado);

		reiniciaModulo(elementoClonado);
		elementoAdd.parentNode.removeChild(elementoAdd); //se elimina el elemento añadido
		console.log('Se agrego un elemento a la lista') },
	/*onChoose: (evento) => {
		console.log('Se ha seleccionado un elemento')
	},
	onUnchoose: (evento) => { console.log('Se ha deseleccionado un elemento') },
	onStart: (evento) => { console.log('Se inicio el drag and drop') },
	onEnd: (evento) => { console.log('On End') },


	
	onRemove: (evento) => { console.log('Se elimino un elemento a la lista') },
	onUpdate: (evento) => { console.log('Se actualizo la lista') },
	onFilter: (evento) => { console.log('Se intento mover un elemento filtrado') },
	onMove: (evento) => { console.log('Se movio un elemento') },
	onChange: (evento) => { console.log('Un elemento cambio de lugar') },*/

});



const btnToggle = document.getElementById('toggle');
function Confirmacion(){
		if ( confirm('Los datos se almacenan en el sevidor y se sobreescriben¿Está seguro de que quiere guardarlos?')==true ) {
			alert("Los datos se han alamacenado");
			return true;
	    } else {
			return false;
		}
	}


btnToggle.addEventListener('click', () => {
    if ( Confirmacion() ) {
            CadenaHorario=creaCadenaHorario();
            escribeDatos(CadenaHorario);
    }
});

const btnInsertaNuevoModulo = document.getElementById('btnInsertaNuevoModulo');
btnInsertaNuevoModulo.addEventListener('click', () => {
    insertaNuevoModulo();
} ); 

const btnActualizaNuevoModulo = document.getElementById('btnActualizaNuevoModulo');
btnActualizaNuevoModulo.addEventListener('click', () => {
    actualizaNuevoModulo();
} ); 

function insertAfter(newNode, referenceNode) {
    // Verifica que el nodo de referencia tenga un siguiente elemento
    if (referenceNode.nextSibling) {
        // Inserta el nuevo nodo antes del siguiente hermano del nodo de referencia
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    } else {
        // Si no hay siguiente hermano, simplemente agrega el nuevo nodo al final
        referenceNode.parentNode.appendChild(newNode);
    }
}
function insertaNuevoModulo(){
    listaCiclos = document.getElementById("listaCiclos");
    nuevoModulo= document.getElementById("nuevoModulo").value;
    tipoNuevoModulo= document.getElementById("tipoNuevoModulo").value;
    horasNuevoModulo= document.getElementById("horasNuevoModulo").value;
    
    cicloNuevoModulo = listaCiclos.value;
    cicloIgual = ciclosmodulos.querySelector("div[nombre='" + cicloNuevoModulo + "'");
    console.log(cicloIgual);
    let nuevoModuloInsertar= document.createElement("div");
    nuevoModuloInsertar.setAttribute("nombre",nuevoModulo);
    nuevoModuloInsertar.setAttribute("ciclo",cicloNuevoModulo);
    nuevoModuloInsertar.setAttribute("horas",horasNuevoModulo);
    nuevoModuloInsertar.setAttribute("tipo",tipoNuevoModulo);
    //cálculo del nuevo id
    //let nuevoId = cicloIgual.getAttribute("id")+"1";
    let nuevoId = maximoModulo+1;
    maximoModulo = nuevoId;
    nuevoModuloInsertar.setAttribute("id",nuevoId);
    
    pintaModulo(nuevoModuloInsertar);
    insertAfter( nuevoModuloInsertar, cicloIgual);
    

}
function insertaNuevoModuloOLD(){
    listaCiclos = document.getElementById("listaCiclos");
    nuevoModulo= document.getElementById("nuevoModulo").value;
    tipoNuevoModulo= document.getElementById("tipoNuevoModulo").value;
    horasNuevoModulo= document.getElementById("horasNuevoModulo").value;
    
    cicloNuevoModulo = listaCiclos.value;
    cicloIgual = ciclosmodulos.querySelector("div[ciclo='" + cicloNuevoModulo + "'");
    console.log(cicloIgual);
    let nuevoModuloInsertar= document.createElement("div");
    nuevoModuloInsertar.setAttribute("nombre",nuevoModulo);
    nuevoModuloInsertar.setAttribute("ciclo",cicloNuevoModulo);
    nuevoModuloInsertar.setAttribute("horas",horasNuevoModulo);
    nuevoModuloInsertar.setAttribute("tipo",tipoNuevoModulo);
    //cálculo del nuevo id
    //let nuevoId = cicloIgual.getAttribute("id")+"1";
    let nuevoId = maximoModulo+1;
    maximoModulo = nuevoId;
    nuevoModuloInsertar.setAttribute("id",nuevoId);
    
   pintaModulo(nuevoModuloInsertar);
    if ( cicloIgual !=null ) {
        ciclosmodulos.insertBefore(nuevoModuloInsertar, cicloIgual);
    } else
    {
        ciclosmodulos.appendChild(nuevoModuloInsertar);
    }
    

}

function actualizaNuevoModulo(){
    insertaNuevoModulo();
    moduloEliminar = ciclosmodulos.querySelector("div[id='" + numModuloActualiza + "'");
    moduloEliminar.parentNode.removeChild(moduloEliminar);
}



function editaModulo(e){
    $('#nuevomodulo').modal('show');
    let modulo = e.parentElement;
             btnInsertaNuevoModulo.style.display="none";
         btnActualizaNuevoModulo.style.display="block";
    listaCiclosActualiza = document.getElementById("listaCiclos");
    nuevoModuloActualiza= document.getElementById("nuevoModulo");
    tipoNuevoModuloActualiza= document.getElementById("tipoNuevoModulo");
    horasNuevoModuloActualiza= document.getElementById("horasNuevoModulo");
    nuevoModuloActualiza.value=modulo.getAttribute("nombre");
    tipoPSPT=modulo.getAttribute("tipo");
    id=modulo.getAttribute("id");
    numModuloActualiza =id; //guarda en la variable global el valor de su id para actualizarlo
    horasNuevoModuloActualiza.value=modulo.getAttribute("horas");
    ciclo=modulo.getAttribute("ciclo");
    /********** recorre todos los options del select listaCiclosActualiza *******/
    for ( i=0; i<listaCiclosActualiza.children.length; i++ ){
        let option = listaCiclosActualiza.children[i];
        if (option.getAttribute("value")==ciclo){
            option.setAttribute("selected","selected");
        } else
        {
            option.removeAttribute("selected");
        }
        
        
    }
    
    /********** recorre todos los options del select listaCiclosActualiza *******/
    for ( i=0; i<tipoNuevoModuloActualiza.children.length; i++ ){
        let option2 = tipoNuevoModuloActualiza.children[i];
        if (option2.getAttribute("value")==tipoPSPT){
            option2.setAttribute("selected","selected");
        } else
        {
            option2.removeAttribute("selected");
        }
        
        
    }
    

}


//^*****************************************************************
//*  INSERCIÓN Y ACTUALIZACIÓN DEL PROFESOR
//******************************************************************
const btnInsertaProfesor = document.getElementById('btnInsertaProfesor');
const btnActualizaProfesor = document.getElementById('btnActualizaProfesor');


function insertaProfesor(){ //es llamado desde el botón ACEPTAR de la ventana modal
    let profesor = document.createElement("div");
    profesor.setAttribute("horas","0");
    tipo= document.getElementById("tipoProfesor1").value;
    profesor.setAttribute("tipo",tipo);
    nombreProfesor= document.getElementById("nombreProfesor").value;
    profesor.setAttribute("nombre",nombreProfesor);
    maximoProfesor +=1; 
    profesor.setAttribute("profe",maximoProfesor);
    pintaProfe(profesor);
    profesorado.appendChild(profesor);
    
    
}

const btnMenuInsertaProfesor = document.getElementById('btnMenuInsertaProfesor');

btnMenuInsertaProfesor.addEventListener('click', () => {
    editaProfesor(null,1);
} ); 

function actualizaProfesor(numProfe) {
    let profesor = document.querySelector("div[profe='" + numProfeActualiza + "'");
    tipo= document.getElementById("tipoProfesor1").value;
    profesor.setAttribute("tipo",tipo);
    nombreProfesor= document.getElementById("nombreProfesor").value;
    profesor.setAttribute("nombre",nombreProfesor);
    pintaProfe(profesor);
   
    
}

btnInsertaProfesor.addEventListener('click', () => {
                insertaProfesor();
            } ); 
            
btnActualizaProfesor.addEventListener('click', () => {
                actualizaProfesor(numProfe);
            } ); 
            
function editaProfesor(e,accion){
    if (accion==1){ //1-inserta
        document.getElementById("nombreProfesor").value="";
         $('#insertaProfesor').modal('show');
         btnActualizaProfesor.style.display="none";
         btnInsertaProfesor.style.display="block";

    } else
    { //2-actualiza. coloca los atributos del profesor en el modal
         $('#insertaProfesor').modal('show');
        
         let profesor = e.parentElement;
         nombre = profesor.getAttribute("nombre");
         numProfe = profesor.getAttribute("profe");
         numProfeActualiza = numProfe;
         
         
         document.getElementById("nombreProfesor").value=nombre;
         tipo = document.getElementById("tipoProfesor1");
         tipoPSPT=profesor.getAttribute("tipo");
             /********** recorre todos los options del select listaCiclosActualiza *******/
            for ( i=0; i<tipo.children.length; i++ ){
                let option2 = tipo.children[i];
                if (option2.getAttribute("value")==tipoPSPT){
                    option2.setAttribute("selected","selected");
                } else
                {
                    option2.removeAttribute("selected");
                }
                
                
            }
            /********** FIN DE recorre todos los options del select listaCiclosActualiza *******/
            btnInsertaProfesor.style.display="none";
            btnActualizaProfesor.style.display="block";

         
    }
}
//*******************************************************************
//*    INSERCIÓN NUEVO CICLO
//*******************************************************************
const btnMenuNuevoCiclo = document.getElementById('btnMenuNuevoCiclo');

btnMenuNuevoCiclo.addEventListener('click', () => {
    editaCiclo(null,1);
} ); 

// estos son los botones del modal
const btnInsertaCiclo = document.getElementById('btnInsertaCiclo');
const btnActualizaCiclo = document.getElementById('btnActualizaCiclo');
btnInsertaCiclo.addEventListener('click', () => {
                insertaCiclo();
            } ); 
            
btnActualizaCiclo.addEventListener('click', () => {
                actualizaCiclo();
            } ); 

function actualizaCiclo() {
    let ciclo = document.querySelector("div[numciclo='" + numCicloActualiza + "'");
    nombre= document.getElementById("nombreCiclo").value;
    ciclo.setAttribute("nombre",nombre);
    pintaCiclo(ciclo);
    actualizaListaCiclosModal(); //actualiza la lista de la ventana modal
    
}

function insertaListaCiclosModal(nombreCiclo){
    /** lo añade a la lista de ciclos del formulario modal **/
               listaCiclos=document.getElementById('listaCiclos');
                let cicloLista = document.createElement("option");
                cicloLista.innerHTML = nombreCiclo;
                cicloLista.setAttribute("value",nombreCiclo);
                listaCiclos.appendChild(cicloLista);
               /** FIN lo añade a la lista de ciclos del formulario modal **/
}

function actualizaListaCiclosModal(){
    /** lo añade a la lista de ciclos del formulario modal **/
      listaCiclos=document.getElementById('listaCiclos');
      eliminarLista(listaCiclos); 
      
      for ( i=0; i<ciclosmodulos.children.length; i++ ){
        hijo = ciclosmodulos.children[i];
        
        tipo = hijo.getAttribute("tipo");

        if ( tipo=="ciclo") { //SE TRATA DE UNO CICLO
            nombre = hijo.getAttribute('nombre');
            let nuevoLI = document.createElement("option");
            nuevoLI.innerHTML = nombre;
            listaCiclos.appendChild(nuevoLI);
        } //if
      } //for
}

function eliminarLista(element) {
while (element.firstChild) {
  element.removeChild(element.firstChild);
}
}

function insertaCiclo(){ //es llamado desde el botón ACEPTAR de la ventana modal
    let nuevoCiclo = document.createElement("div");
    nombreCiclo = document.getElementById("nombreCiclo").value;
    nuevoCiclo.setAttribute("nombre",nombreCiclo);
    maximoCiclo +=1; 
    nuevoCiclo.setAttribute("tipo","ciclo");
    pintaCiclo(nuevoCiclo);
    ciclosmodulos.appendChild(nuevoCiclo);
    insertaListaCiclosModal(nombreCiclo);
    
}

function editaCiclo(e,accion){
    if (accion==1){ //1-inserta
        document.getElementById("nombreCiclo").value="";
         $('#insertaCiclo').modal('show');
         btnActualizaCiclo.style.display="none";
         btnInsertaCiclo.style.display="block";

    } else
    { //2-actualiza. coloca los atributos del profesor en el modal
         $('#insertaCiclo').modal('show');

         let ciclo = e.parentElement;
         nombre = ciclo.getAttribute("nombre");
         numCicloActualiza = ciclo.getAttribute("numciclo");
         document.getElementById("nombreCiclo").value=nombre;

            /********** FIN DE recorre todos los options del select listaCiclosActualiza *******/
            btnInsertaCiclo.style.display="none";
            btnActualizaCiclo.style.display="block";

         
    }
}
//*******************************************************************
//*    BORRADO DE UN MODULO Y PROFESOR/A
//*******************************************************************
const btnAceptaBorradoModulo = document.getElementById('btnAceptaBorradoModulo');
const btnAceptaBorradoProfe = document.getElementById('btnAceptaBorradoProfe');

btnAceptaBorradoModulo.addEventListener('click', () => {
    borraModulo();
} ); 

btnAceptaBorradoProfe.addEventListener('click', () => {
    borraProfe();
} ); 

function borraProfe(){ //es llamado desde el botón ACEPTAR de la ventana modal
    moduloBorrar=profesorado.querySelector("div[profe='" + numProfeActualiza + "'");
    moduloBorrar.parentNode.removeChild(moduloBorrar);   
}


function borraModulo(){ //es llamado desde el botón ACEPTAR de la ventana modal
    moduloBorrar=document.getElementById(numModuloActualiza);
    moduloBorrar.parentNode.removeChild(moduloBorrar);   
}

function borraCajas(e,accion){
    $('#confirmaborrado').modal('show');
    if (accion==1){ //1-borra profe
         let modulo = e.parentElement;
         numProfeActualiza = modulo.getAttribute("profe");
            btnAceptaBorradoProfe.style.display="block";
            btnAceptaBorradoModulo.style.display="none";

    } else //borra modulo
    { //2-actualiza. coloca los atributos del profesor en el modal


         let modulo = e.parentElement;
         numModuloActualiza = modulo.getAttribute("id");
            btnAceptaBorradoProfe.style.display="none";
            btnAceptaBorradoModulo.style.display="block";

         
    }
}