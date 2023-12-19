class Alumno {
    constructor(nombre, apellido, edad, curso, calificaciones) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.edad = edad;
        this.curso = curso;
        this.calificaciones = calificaciones;
    }
}

const listaCursos = ['Matemáticas', 'Programación', 'Inglés', 'Logística', 'Electrónica'];

class Curso {
    constructor(nombre, calificaciones) {
        this.nombre = nombre;
        this.calificaciones = calificaciones;
        this.estudiantes = [];
    }
}

const alumnos = JSON.parse(localStorage.getItem('Alumnos')) || [];
const cursos = JSON.parse(localStorage.getItem('Cursos')) || []; 

//OCULTA LAS SECCIONES DE LA PAGINA
function ocultarElementos() {
    document.getElementById('Baseparte1').style.display = 'none';
    document.getElementById('Baseparte2').style.display = 'none';
    document.getElementById('form').style.display = 'none';  // Agrega esta línea para ocultar el formulario
    document.getElementById('contenedorGrupos').style.display = 'none';
}


function agregarAlumnos(nombre, apellido, edad, curso, calificaciones) {
    const nuevoAlumno = new Alumno(nombre, apellido, edad, curso, calificaciones);

    const existeAlumno = alumnos.some(alumno =>
        alumno.nombre === nombre &&
        alumno.apellido === apellido &&
        alumno.edad === edad &&
        alumno.curso === curso
    );

    if (!existeAlumno) {
        alumnos.push(nuevoAlumno);

        let cursoExistente = cursos.find(cursoItem => cursoItem.nombre === curso);

        if (!cursoExistente) {
            cursoExistente = new Curso(curso, [], []); // Modificación aquí
            cursos.push(cursoExistente);
        }

        cursoExistente.estudiantes.push(nuevoAlumno);
        cursoExistente.materiasInscritas = Array.from(new Set([...cursoExistente.materiasInscritas, curso]));

        // Calcular el promedio y asignarlo al nuevo alumno
        nuevoAlumno.promedio = calcularPromedioNotas(calificaciones);

        // Modificación en la siguiente línea para manejar calificaciones
        cursoExistente.calificaciones.push({ alumno: nuevoAlumno, calificaciones: calificaciones, promedio: nuevoAlumno.promedio });

        localStorage.setItem('Alumnos', JSON.stringify(alumnos));
        localStorage.setItem('Cursos', JSON.stringify(cursos));

        console.log('Alumno agregado:', nuevoAlumno);

        // Llamar a la función para calcular el promedio después de agregar un nuevo alumno
        calcularPromedio();

        getLocalStorage();

        // Ocultar el formulario después de enviar los datos
        ocultarElementos();

        return {
            alumno: nuevoAlumno,
            cursos: [{ nombre: curso, estudiantes: [{ nombre, apellido }], calificaciones: calificaciones }],
        };
    } else {
        console.log('El alumno ya existe en la lista.');
        return null;
    }
}


//GUARDAR DATOS EN LOCALSTORAGE, FUNCIONA COMO MEMORIA
function getLocalStorage() {
    const alumnosLocal = JSON.parse(localStorage.getItem('Alumnos')) || [];
    const cursosLocal = JSON.parse(localStorage.getItem('Cursos')) || [];

    console.log('Alumnos almacenados:', alumnosLocal);
    console.log('Cursos almacenados:', cursosLocal);

     // Llama a la función para mostrar la sección de promedio
     mostrarPromedioSection();
}

//LLAMADO AGREGARALUMNOS PARA POR DEFECTO TENER DATOS DE ESTUDIANTES
agregarAlumnos('María', 'García', 25, 'Matemáticas', [4.0, 5.5, 4.5]);
agregarAlumnos('Laura', 'Acevedo', 22, 'Programación', [3.0, 6.5, 5.5]);
agregarAlumnos('Javier', 'Díaz', 26, 'Inglés', [4.0, 5.5, 4.5]);
agregarAlumnos('Eliza', 'Castillo', 22, 'Logística', [5.5, 6.5, 7.0]); 


//TABLA DE ALUMNOS
function mostrarDatosAlumnos(base) {
     // Oculta la sección de promedio al mostrar datos de alumnos
    ocultarPromedioSection();

    const baseElement = document.getElementById(base);


    if (baseElement) {
        ocultarElementos();
        baseElement.style.display = 'block';

        const tablabody = baseElement.querySelector('tbody');
        const thead = baseElement.querySelector('thead');

        if (base === 'Baseparte1') {
            tablabody.innerHTML = crearFilas(alumnos);
            thead.innerHTML = `
                <tr>
                    <th scope="col">Nombre</th>
                    <th scope="col">Apellidos</th>
                    <th scope="col">Edad</th>
                </tr>
            `;
        }
    } else {
        console.error('Elemento no encontrado:', base);
    }

    // Obtener y mostrar los datos almacenados en localStorage
    getLocalStorage();
}

//AYUDA A QUE PROMEDIOFORMULARIO NO INTERTIIERA CON BOTONES
function ocultarPromedioSection() {
    // Oculta la sección de promedio
    const promedioSection = document.getElementById('resultadoPromedio'); // Cambiado a 'resultadoPromedio'
    promedioSection.innerHTML = ''; 
}

// Agrega un listener al botón de cursos
//const btnCursos = document.getElementById('btnCursos');
//btnCursos.addEventListener('click', function () {
    //mostrarDatosCursos('Baseparte2', true); // Mostrar la tabla de cursos
//});

// TABLA DE CURSOS
function mostrarDatosCursos(base) {
    // Oculta la sección de promedio al mostrar datos de cursos
    ocultarPromedioSection();

    // Ocultar el formulario cuando se revisan los cursos
    ocultarElementos();

    const baseElement = document.getElementById(base);

    if (baseElement) {
        baseElement.style.display = 'block';

        const tablabody = baseElement.querySelector('tbody');
        const thead = baseElement.querySelector('thead');

        if (base === 'Baseparte2') {
            tablabody.innerHTML = crearFilasCursos(cursos);
            thead.innerHTML = `
                <tr>
                    <th scope="col">Alumno</th>
                    <th scope="col">Materias Inscritas</th>
                    <th scope="col">Calificaciones</th>
                </tr>
            `;
        }
    } else {
        console.error('Elemento no encontrado:', base);
    }

    // Obtener y mostrar los datos almacenados en localStorage
    getLocalStorage();
}

//ANEXO TABLA ALUMNOS
function crearFilas(info) {
    let filasWEB = ''; 
    for (let i = 0; i < info.length; i++) {
        const { nombre, apellido, edad } = info[i];

        filasWEB += `
        <tr>
            <td>${nombre}</td>
            <td>${apellido}</td>
            <td>${edad || 'Sin edad'}</td>
        </tr>
        `;
    }
    return filasWEB;
}

//ANEXO TABLA CURSOS
function crearFilasCursos(info) {
    let filasWEB = '';
    for (let i = 0; i < info.length; i++) {
        const { estudiantes, materiasInscritas, calificaciones } = info[i];

        // Ordenar las calificaciones de manera ascendente
        const calificacionesOrdenadas = calificaciones.map(item => ({
            alumno: item.alumno,
            calificaciones: item.calificaciones.slice().sort((a, b) => a - b),
        }));

        // Iterar sobre cada estudiante del curso
        for (let j = 0; j < estudiantes.length; j++) {
            const estudiante = estudiantes[j];

            filasWEB += `
                <tr>
                    <td>${estudiante.nombre} ${estudiante.apellido}</td>
                    <td>${materiasInscritas ? materiasInscritas.join(', ') : 'N/A'}</td>
                    <td>${calificacionesOrdenadas[j]
                        ? calificacionesOrdenadas[j].calificaciones.map(nota => (nota % 1 === 0 ? `${nota}.0` : nota)).join(', ')
                        : 'N/A'}</td>
                </tr>
            `;
        }
    }
    return filasWEB;
}



function obtenerEstudiantesPorCurso(curso) {
    return alumnos.filter(alumno => alumno.curso === curso);
}

// Mostrar el formulario solo cuando se hace clic en el botón "Agregar Alumno"
function mostrarFormulario() {
    ocultarElementos();
    document.getElementById('form').style.display = 'block';
}

//ENVIO CORRECTO AL LLENAR FORMULARIO
function enviarFormulario() {
    console.log('Enviando formulario...');

    const nombre = document.getElementById('inputNombre').value;
    const apellido = document.getElementById('inputApellido').value;
    const edad = document.getElementById('inputEdad').value;
    const curso = document.getElementById('inputCurso').value;

    // Validar que los campos obligatorios estén completos
    if (!nombre || !apellido || !edad || !curso) {
        alert('Por favor, completa todos los campos obligatorios.');
        return;
    }

    // Obtener las calificaciones seleccionadas
    const calificacion1 = parseFloat(document.getElementById('inputCalificacion1').value) || 0;
    const calificacion2 = parseFloat(document.getElementById('inputCalificacion2').value) || 0;
    const calificacion3 = parseFloat(document.getElementById('inputCalificacion3').value) || 0;

    // Verificar que se hayan seleccionado calificaciones
    if (calificacion1 !== 0 && calificacion2 !== 0 && calificacion3 !== 0) {
        const calificacionesSeleccionadas = [calificacion1, calificacion2, calificacion3];

        const nuevoAlumno = agregarAlumnos(nombre, apellido, edad, curso, calificacionesSeleccionadas);

        if (nuevoAlumno) {
            // Actualizar los datos en las tablas y mostrar la sección de promedio si es necesario
            ocultarElementos();

            // Mostrar la alerta después de ocultar el formulario
            alert('Datos enviados correctamente');
        } else {
            alert('Error: El alumno ya existe en la lista.');
        }
    } else {
        alert('Selecciona exactamente tres calificaciones.');
    }

    // Ocultar el formulario después de enviar los datos
    document.getElementById('form').style.display = 'none';
}

 // Actualiza los datos en las tablas y en localStorage
function actualizarDatos() {
    mostrarDatosAlumnos('Baseparte1');
    mostrarDatosCursos('Baseparte2');
}



function ocultarAlumnosPorCurso(cursoNombre) {
    const listaAlumnos = document.getElementById(`listaAlumnos-${cursoNombre}`);
    listaAlumnos.style.display = 'none';
}


function mostrarGruposCursos() {
    const listaGrupos = document.getElementById('listaGrupos');

    if (listaGrupos.style.display === 'none') {
        // Si está oculto, mostrar la lista de grupos
        listaGrupos.style.display = 'block';
        // ... (Llamar a funciones adicionales si es necesario)
    } else {
        // Si está visible, ocultar la lista de grupos
        listaGrupos.style.display = 'none';
    }
}

//PROMEDIO GENERAL DEL CURSO

function calcularPromedioCurso(cursoNombre) {
    const curso = cursos.find(c => c.nombre === cursoNombre);

    if (curso) {
        const promedios = curso.calificaciones.map(item => item.promedio);
        const promedioGeneral = calcularPromedioNotas(promedios);

        // Mostrar información en el área correspondiente (puedes adaptarlo para mostrar en la interfaz)
        const infoPromedioCurso = document.getElementById(`infoPromedioCurso-${cursoNombre}`);
        infoPromedioCurso.textContent = `Promedio del curso: ${promedioGeneral.toFixed(1)}`;
    } else {
        console.error(`No se encontró el curso ${cursoNombre}`);
    }
}


const dropdownToggle = document.createElement('button');
dropdownToggle.type = 'button';
dropdownToggle.className = 'btn btn-secondary btn-sm dropdown-toggle';
dropdownToggle.setAttribute('data-toggle', 'dropdown');
dropdownToggle.setAttribute('aria-haspopup', 'true');
dropdownToggle.setAttribute('aria-expanded', 'false');
dropdownToggle.textContent = 'Acciones';

function calcularPromedio() {
    // Obtener las notas seleccionadas
    const nota1 = parseFloat(document.getElementById('inputCalificacion1').value) || 0;
    const nota2 = parseFloat(document.getElementById('inputCalificacion2').value) || 0;
    const nota3 = parseFloat(document.getElementById('inputCalificacion3').value) || 0;

    // Verificar que las notas sean válidas
    if (!isNaN(nota1) && !isNaN(nota2) && !isNaN(nota3) && nota1 !== 0 && nota2 !== 0 && nota3 !== 0) {
        // Calcular el promedio
        const promedio = (nota1 + nota2 + nota3) / 3;

        // Mostrar el resultado solo si las 3 calificaciones están seleccionadas
        const resultadoPromedio = document.getElementById('resultadoPromedio');
        resultadoPromedio.innerHTML = `<p>Promedio: ${promedio.toFixed(1)}</p>`;
        resultadoPromedio.style.display = 'block';  // Mostrar la sección de promedio
    } else {
        // Limpiar el resultado si no se han seleccionado todas las calificaciones
        const resultadoPromedio = document.getElementById('resultadoPromedio');
        resultadoPromedio.innerHTML = '';
        resultadoPromedio.style.display = 'none';  // Ocultar la sección de promedio
    }
}
//MOSTRAR PROMEDIO EN FORMULARIO
function mostrarPromedioSection() {
    const botonPresionado = document.activeElement; // Obtener el botón que fue presionado

    // Verificar si el botón presionado es el de "Enviar Formulario"
    if (botonPresionado.id === 'btnEnviarFormulario') {
        // Obtener las notas seleccionadas
        const nota1 = parseFloat(document.getElementById('inputCalificacion1').value) || 0;
        const nota2 = parseFloat(document.getElementById('inputCalificacion2').value) || 0;
        const nota3 = parseFloat(document.getElementById('inputCalificacion3').value) || 0;

        // Verificar que las notas sean válidas
        if (!isNaN(nota1) && !isNaN(nota2) && !isNaN(nota3) && nota1 !== 0 && nota2 !== 0 && nota3 !== 0) {
            // Calcular el promedio solo si todas las calificaciones están seleccionadas
            const promedio = (nota1 + nota2 + nota3) / 3;

            // Mostrar el resultado solo si las 3 calificaciones están seleccionadas
            const resultadoPromedio = document.getElementById('resultadoPromedio');
            resultadoPromedio.innerHTML = `<p>Promedio: ${promedio.toFixed(1)}</p>`;
            resultadoPromedio.style.display = 'block';  // Mostrar la sección de promedio
        } else {
            // Limpiar el resultado si no se han seleccionado todas las calificaciones
            const resultadoPromedio = document.getElementById('resultadoPromedio');
            resultadoPromedio.innerHTML = '';
            resultadoPromedio.style.display = 'none';  // Ocultar la sección de promedio
        }
    } else {
        // Ocultar la sección de promedio si se presiona cualquier otro botón
        const resultadoPromedio = document.getElementById('resultadoPromedio');
        resultadoPromedio.innerHTML = '';
        resultadoPromedio.style.display = 'none';
    }
}

function ordenarAlumnosPorCalificaciones(ascendente = true) {
    alumnos.forEach(alumno => {
        alumno.calificaciones.sort((a, b) => {
            return ascendente ? a - b : b - a;
        });
    });
}

// Llamada para ordenar de manera ascendente
ordenarAlumnosPorPromedio(true);

function ordenarAlumnosPorPromedio(ascendente) {
    const orden = ascendente ? 1 : -1;

    cursos.forEach(curso => {
        curso.calificaciones.sort((a, b) => {
            const promedioA = calcularPromedioNotas(a.calificaciones);
            const promedioB = calcularPromedioNotas(b.calificaciones);
            return (promedioA - promedioB) * orden; // Ordenar de menor a mayor o de mayor a menor promedio
        });
    });
}

const tituloCurso = document.createElement('span');
tituloCurso.textContent = curso.nombre;
tituloCurso.id = `nombreCurso-${curso.nombre}`;
tituloCurso.className = 'h4 pb-2 mb-6 tituloGrupos text-danger border-bottom border-danger';

function ocultarGrupos() {
    const contenedorGrupos = document.getElementById('contenedorGrupos');
    contenedorGrupos.classList.add('d-none');  // Agrega la clase d-none para ocultar
}

function mostrarGrupos() {
    const contenedorGrupos = document.getElementById('contenedorGrupos');
    contenedorGrupos.classList.remove('d-none');  // Remueve la clase d-none para mostrar
}

function crearGrupos() {
    ocultarGrupos(); // Ocultar grupos antes de mostrar nuevos

    const listaGrupos = document.getElementById('listaGrupos');
    listaGrupos.innerHTML = '';  // Limpiar contenido anterior

    cursos.forEach(curso => {
        // Resto de tu código para crear grupos
        const grupoContainer = document.createElement('div');
        grupoContainer.className = 'pb-2 mb-6'; // Clase para diseño de texto común

        const tituloCurso = document.createElement('div');
        tituloCurso.className = 'fs-5'; // Tamaño de texto común
        tituloCurso.textContent = curso.nombre;

        const grupoInfo = document.createElement('div');
        grupoInfo.className = 'd-flex justify-content-between p-3 border border-1 border-info-subtle rounded-1'; // Diseño para texto común

        const verAlumnosBtn = document.createElement('button');
        verAlumnosBtn.type = 'button';
        verAlumnosBtn.className = 'btn btn-primary btn-sm me-2';
        verAlumnosBtn.textContent = 'Ver Alumnos';
        verAlumnosBtn.addEventListener('click', () => {
            mostrarGrupos(); // Mostrar grupos al hacer clic
            verAlumnos(curso.nombre);
        });

        const ocultarBtn = document.createElement('button');
        ocultarBtn.type = 'button';
        ocultarBtn.className = 'btn btn-secondary btn-sm me-2';
        ocultarBtn.textContent = 'Ocultar';
        ocultarBtn.addEventListener('click', () => {
            ocultarAlumnosPromedio(curso.nombre); // Cambiado aquí para ocultar solo la lista de alumnos
        });

        const listaAlumnos = document.createElement('div');
        listaAlumnos.id = `listaAlumnos-${curso.nombre}`;
        listaAlumnos.className = 'listaAlumnos';  // Agrega la clase listaAlumnos

        const promedioCursoBtn = document.createElement('button');
        promedioCursoBtn.type = 'button';
        promedioCursoBtn.className = 'btn btn-warning btn-sm';
        promedioCursoBtn.textContent = 'Promedio Curso';
        promedioCursoBtn.addEventListener('click', () => {
            mostrarGrupos(); // Mostrar grupos al hacer clic
            calcularPromedioCurso(curso.nombre);
        });

        const infoPromedioCurso = document.createElement('span');
        infoPromedioCurso.id = `infoPromedioCurso-${curso.nombre}`;

        // Agregar elementos al DOM
        grupoInfo.appendChild(tituloCurso);
        grupoInfo.appendChild(verAlumnosBtn);
        grupoInfo.appendChild(ocultarBtn);
        grupoInfo.appendChild(promedioCursoBtn);
        grupoInfo.appendChild(listaAlumnos);
        grupoInfo.appendChild(infoPromedioCurso);

        grupoContainer.appendChild(grupoInfo);
        listaGrupos.appendChild(grupoContainer);
    });
    mostrarGrupos(); // Mostrar grupos después de crearlos
}

function calcularPromedioAlumnos(alumnos) {
    const promedios = alumnos.map(alumno => calcularPromedioNotas(alumno.calificaciones));
    
    const promedioGeneral = promedios.reduce((sum, promedio) => sum + promedio, 0) / promedios.length;

    // Asegurémonos de que el promedioGeneral no sea NaN
    const resultado = {
        promedioGeneral: isNaN(promedioGeneral) ? 0 : promedioGeneral,
        promedios: promedios,
        comentario: obtenerComentarioPromedio(promedioGeneral),
    };

    return resultado;
}

function calcularPromedioNotas(notas) {
    const notasValidas = notas.filter(nota => !isNaN(nota));
    if (notasValidas.length === 0) {
        return 0;  // Si no hay notas válidas, devolvemos 0
    }

    const promedio = notasValidas.reduce((sum, nota) => sum + nota, 0) / notasValidas.length;
    return promedio;
}


function mostrarAlumnosPromedio(cursoNombre) {
    const curso = cursos.find(c => c.nombre === cursoNombre);

    if (curso) {
        const listaAlumnos = document.getElementById(`listaAlumnos-${cursoNombre}`);
        listaAlumnos.innerHTML = ''; // Limpiar contenido anterior

        const alumnosCurso = curso.estudiantes;

        // Ordenar estudiantes por promedio
        const alumnosOrdenados = ordenarAlumnosPorPromedio(alumnosCurso);

        // Mostrar estudiantes en la lista
        alumnosOrdenados.forEach(alumno => {
            const itemAlumno = document.createElement('li');
            itemAlumno.textContent = `${alumno.nombre} ${alumno.apellido} - Promedio: ${alumno.promedio.toFixed(1)}`;
            listaAlumnos.appendChild(itemAlumno);
        });

        // Mostrar la lista de alumnos
        listaAlumnos.style.display = 'block';
    } else {
        console.error(`No se encontró el curso ${cursoNombre}`);
    }
}

function ocultarAlumnosPromedio(cursoNombre) {
    const listaAlumnos = document.getElementById(`listaAlumnos-${cursoNombre}`);
    listaAlumnos.style.display = 'none';
}



// Llamada a la función para crear grupos al cargar la página
crearGrupos();

function revisarGrupos() {
    // Oculta el formulario al revisar los grupos
    ocultarElementos();

    // Lógica para obtener y mostrar los grupos
    crearGrupos(); // Llama a la función que crea los grupos

    // Muestra el contenedor de grupos después de crearlos
    const contenedorGrupos = document.getElementById("contenedorGrupos");
    contenedorGrupos.style.display = "block";
}

function verAlumnos(cursoNombre) {
    const listaAlumnos = document.getElementById(`listaAlumnos-${cursoNombre}`);
    
    // Asegúrate de que el elemento exista antes de cambiar el estilo
    if (listaAlumnos) {
        // Cambia el estilo para alternar entre 'block' y 'none'
        listaAlumnos.style.display = (listaAlumnos.style.display === 'none') ? 'block' : 'none';
    } else {
        console.error(`Elemento no encontrado: listaAlumnos-${cursoNombre}`);
    }
}

// En la creación del botón "Ver Alumnos"
const verAlumnosBtn = document.createElement('button');
verAlumnosBtn.type = 'button';
verAlumnosBtn.className = 'btn btn-primary btn-sm me-2 ver-alumnos-btn'; // Agrega una clase específica
verAlumnosBtn.textContent = 'Ver Alumnos';
verAlumnosBtn.addEventListener('click', () => {
    console.log('Haciendo clic en el botón "Ver Alumnos"');
    const cursoNombre = 'Logística'; // Reemplaza 'Logística' con el nombre del curso correspondiente
    mostrarGrupos(); // Mostrar grupos al hacer clic
    verAlumnos(cursoNombre);
});






