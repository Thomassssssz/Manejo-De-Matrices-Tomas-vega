const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let alumnos = [
  [
    "Juan",
    [
      ["Matematicas", 8],
      ["Lengua", 9],
      ["Sociales", 7],
      ["Naturales", 7],
    ],
  ],
  [
    "Ana",
    [
      ["Lengua", 9],
      ["Matematicas", 10],
      ["Sociales", 8],
      ["Naturales", 6],
    ],
  ],
  [
    "Luis",
    [
      ["Lengua", 6],
      ["Sociales", 8],
      ["Matematicas", 7],
      ["Naturales", 6],
    ],
  ],
  [
    "María",
    [
      ["Lengua", 9],
      ["Sociales", 10],
      ["Naturales", 10],
      ["Matematicas", 9],
    ],
  ],
];

function preguntar(texto) {
  return new Promise((resolve) => {
    rl.question(texto, resolve);
  });
}

function buscarAlumno(nombre) {
  for (let i = 0; i < alumnos.length; i++) {
    if (alumnos[i][0].toLowerCase() === nombre.toLowerCase()) {
      return i;
    }
  }
  return -1;
}

function buscarMateria(materias, nombreMateria) {
  for (let i = 0; i < materias.length; i++) {
    if (materias[i][0].toLowerCase() === nombreMateria.toLowerCase()) {
      return i;
    }
  }
  return -1;
}

async function pedirNota() {
  while (true) {
    let entrada = await preguntar("Ingrese la nota: ");
    let nota = parseFloat(entrada);

    if (!isNaN(nota) && nota >= 0 && nota <= 10) {
      return nota;
    } else {
      console.log("La nota debe ser un número entre 0 y 10.");
    }
  }
}

function calcularPromedio(materias) {
  if (materias.length === 0) return 0;

  let suma = 0;
  for (let i = 0; i < materias.length; i++) {
    suma += materias[i][1];
  }
  return suma / materias.length;
}

function verAlumnos() {
  if (alumnos.length === 0) {
    console.log("\nNo hay alumnos cargados.\n");
    return;
  }

  console.log("\n--- LISTA DE ALUMNOS ---");
  for (let i = 0; i < alumnos.length; i++) {
    let nombre = alumnos[i][0];
    let materias = alumnos[i][1];

    console.log(`\nAlumno: ${nombre}`);
    if (materias.length === 0) {
      console.log("  Sin materias registradas.");
    } else {
      for (let j = 0; j < materias.length; j++) {
        console.log(`  - ${materias[j][0]}: ${materias[j][1]}`);
      }
      console.log(`  Promedio: ${calcularPromedio(materias).toFixed(2)}`);
    }
  }
  console.log();
}

async function agregarAlumno() {
  let nombre = (await preguntar("Ingrese el nombre del alumno: ")).trim();

  if (nombre === "") {
    console.log("El nombre no puede estar vacío.");
    return;
  }

  let posAlumno = buscarAlumno(nombre);

  if (posAlumno !== -1) {
    console.log("El alumno ya está registrado.");
    let opcion = (
      await preguntar("¿Desea agregar/modificar una materia? (s/n): ")
    )
      .trim()
      .toLowerCase();
    if (opcion === "s") {
      await agregarOModificarNotas(nombre);
    }
    return;
  }

  let materias = [];
  while (true) {
    let nombreMateria = (
      await preguntar("Ingrese el nombre de la materia: ")
    ).trim();

    if (nombreMateria === "") {
      console.log("La materia no puede estar vacía.");
      continue;
    }

    let nota = await pedirNota();
    materias.push([nombreMateria, nota]);

    let continuar = (await preguntar("¿Desea agregar otra materia? (s/n): "))
      .trim()
      .toLowerCase();
    if (continuar !== "s") {
      break;
    }
  }

  alumnos.push([nombre, materias]);
  console.log("Alumno agregado correctamente.\n");
}

async function agregarOModificarNotas(nombreIngresado = null) {
  let nombre;

  if (nombreIngresado === null) {
    nombre = (await preguntar("Ingrese el nombre del alumno: ")).trim();
  } else {
    nombre = nombreIngresado;
  }

  let posAlumno = buscarAlumno(nombre);

  if (posAlumno === -1) {
    console.log("El alumno no existe.");
    let crear = (await preguntar("¿Desea crearlo? (s/n): "))
      .trim()
      .toLowerCase();

    if (crear === "s") {
      alumnos.push([nombre, []]);
      posAlumno = buscarAlumno(nombre);
    } else {
      return;
    }
  }

  let materias = alumnos[posAlumno][1];
  let nombreMateria = (
    await preguntar("Ingrese el nombre de la materia: ")
  ).trim();
  let posMateria = buscarMateria(materias, nombreMateria);

  if (posMateria !== -1) {
    console.log(`La materia '${nombreMateria}' ya existe.`);
    console.log(`Nota actual: ${materias[posMateria][1]}`);
    let nuevaNota = await pedirNota();
    materias[posMateria][1] = nuevaNota;
    console.log("Nota modificada correctamente.\n");
  } else {
    console.log(`La materia '${nombreMateria}' no existe.`);
    let nota = await pedirNota();
    materias.push([nombreMateria, nota]);
    console.log("Materia agregada correctamente.\n");
  }
}

function mostrarMejorPromedio() {
  if (alumnos.length === 0) {
    console.log("No hay alumnos cargados.\n");
    return;
  }

  let mejorNombre = "";
  let mejorPromedio = -1;

  for (let i = 0; i < alumnos.length; i++) {
    let promedio = calcularPromedio(alumnos[i][1]);
    if (promedio > mejorPromedio) {
      mejorPromedio = promedio;
      mejorNombre = alumnos[i][0];
    }
  }

  console.log(
    `\nAlumno con mejor promedio: ${mejorNombre} (${mejorPromedio.toFixed(2)})\n`,
  );
}

function verAlumnosOrdenadosPorPromedio() {
  if (alumnos.length === 0) {
    console.log("No hay alumnos cargados.\n");
    return;
  }

  let copia = [];
  for (let i = 0; i < alumnos.length; i++) {
    copia.push([alumnos[i][0], alumnos[i][1]]);
  }

  // Ordenamiento descendente por promedio
  for (let i = 0; i < copia.length; i++) {
    for (let j = i + 1; j < copia.length; j++) {
      if (calcularPromedio(copia[j][1]) > calcularPromedio(copia[i][1])) {
        let aux = copia[i];
        copia[i] = copia[j];
        copia[j] = aux;
      }
    }
  }

  console.log("\n--- ALUMNOS ORDENADOS POR PROMEDIO ---");
  for (let i = 0; i < copia.length; i++) {
    console.log(
      `${copia[i][0]} -> Promedio: ${calcularPromedio(copia[i][1]).toFixed(2)}`,
    );
  }
  console.log();
}

async function menu() {
  let salir = false;

  while (!salir) {
    console.log("====== MENÚ ======");
    console.log("1. Ver alumnos");
    console.log("2. Agregar alumno");
    console.log("3. Agregar o modificar notas");
    console.log("4. Ver alumno con mejor promedio");
    console.log("5. Ordenar alumnos por promedio");
    console.log("6. Salir");

    let opcion = (await preguntar("Seleccione una opción: ")).trim();

    switch (opcion) {
      case "1":
        verAlumnos();
        break;
      case "2":
        await agregarAlumno();
        break;
      case "3":
        await agregarOModificarNotas();
        break;
      case "4":
        mostrarMejorPromedio();
        break;
      case "5":
        verAlumnosOrdenadosPorPromedio();
        break;
      case "6":
        console.log("Saliendo del sistema...");
        salir = true;
        break;
      default:
        console.log("Opción inválida.\n");
    }
  }

  rl.close();
}

menu();
