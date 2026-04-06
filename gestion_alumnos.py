# Sistema de gestión de calificaciones
# Estructura:
# [
#   ['Juan', [['Matematicas', 8], ['Lengua', 9]]],
#   ['Ana', [['Lengua', 9], ['Matematicas', 10]]]
# ]

alumnos = [
    ['Juan', [['Matematicas', 8], ['Lengua', 9], ['Sociales', 7], ['Naturales', 7]]],
    ['Ana', [['Lengua', 9], ['Matematicas', 10], ['Sociales', 8], ['Naturales', 6]]],
    ['Luis', [['Lengua', 6], ['Sociales', 8], ['Matematicas', 7], ['Naturales', 6]]],
    ['María', [['Lengua', 9], ['Sociales', 10], ['Naturales', 10], ['Matematicas', 9]]]
]


def buscar_alumno(nombre):
    for i in range(len(alumnos)):
        if alumnos[i][0].lower() == nombre.lower():
            return i
    return -1


def buscar_materia(lista_materias, nombre_materia):
    for i in range(len(lista_materias)):
        if lista_materias[i][0].lower() == nombre_materia.lower():
            return i
    return -1


def pedir_nota():
    while True:
        try:
            nota = float(input("Ingrese la nota: "))
            if 0 <= nota <= 10:
                return nota
            else:
                print("La nota debe estar entre 0 y 10.")
        except ValueError:
            print("Ingrese un número válido.")


def calcular_promedio(materias):
    if len(materias) == 0:
        return 0
    suma = 0
    for materia in materias:
        suma += materia[1]
    return suma / len(materias)


def ver_alumnos():
    if len(alumnos) == 0:
        print("\nNo hay alumnos cargados.\n")
        return

    print("\n--- LISTA DE ALUMNOS ---")
    for alumno in alumnos:
        nombre = alumno[0]
        materias = alumno[1]
        print(f"\nAlumno: {nombre}")
        if len(materias) == 0:
            print("  Sin materias registradas.")
        else:
            for materia in materias:
                print(f"  - {materia[0]}: {materia[1]}")
            print(f"  Promedio: {calcular_promedio(materias):.2f}")
    print()


def agregar_alumno():
    nombre = input("Ingrese el nombre del alumno: ").strip()

    if nombre == "":
        print("El nombre no puede estar vacío.")
        return

    pos_alumno = buscar_alumno(nombre)

    if pos_alumno != -1:
        print("El alumno ya está registrado.")
        opcion = input("¿Desea agregar/modificar una materia? (s/n): ").strip().lower()
        if opcion == "s":
            agregar_o_modificar_notas(nombre)
        return

    materias = []
    while True:
        nombre_materia = input("Ingrese el nombre de la materia: ").strip()
        if nombre_materia == "":
            print("La materia no puede estar vacía.")
            continue

        nota = pedir_nota()
        materias.append([nombre_materia, nota])

        continuar = input("¿Desea agregar otra materia? (s/n): ").strip().lower()
        if continuar != "s":
            break

    alumnos.append([nombre, materias])
    print("Alumno agregado correctamente.\n")


def agregar_o_modificar_notas(nombre_ingresado=None):
    if nombre_ingresado is None:
        nombre = input("Ingrese el nombre del alumno: ").strip()
    else:
        nombre = nombre_ingresado

    pos_alumno = buscar_alumno(nombre)

    if pos_alumno == -1:
        print("El alumno no existe.")
        crear = input("¿Desea crearlo? (s/n): ").strip().lower()
        if crear == "s":
            alumnos.append([nombre, []])
            pos_alumno = buscar_alumno(nombre)
        else:
            return

    materias = alumnos[pos_alumno][1]

    nombre_materia = input("Ingrese el nombre de la materia: ").strip()
    pos_materia = buscar_materia(materias, nombre_materia)

    if pos_materia != -1:
        print(f"La materia '{nombre_materia}' ya existe.")
        print(f"Nota actual: {materias[pos_materia][1]}")
        nueva_nota = pedir_nota()
        materias[pos_materia][1] = nueva_nota
        print("Nota modificada correctamente.\n")
    else:
        print(f"La materia '{nombre_materia}' no existe.")
        nota = pedir_nota()
        materias.append([nombre_materia, nota])
        print("Materia agregada correctamente.\n")


def mostrar_mejor_promedio():
    if len(alumnos) == 0:
        print("No hay alumnos cargados.\n")
        return

    mejor_nombre = ""
    mejor_promedio = -1

    for alumno in alumnos:
        promedio = calcular_promedio(alumno[1])
        if promedio > mejor_promedio:
            mejor_promedio = promedio
            mejor_nombre = alumno[0]

    print(f"\nAlumno con mejor promedio: {mejor_nombre} ({mejor_promedio:.2f})\n")


def ver_alumnos_ordenados_por_promedio():
    if len(alumnos) == 0:
        print("No hay alumnos cargados.\n")
        return

    copia = []
    for alumno in alumnos:
        copia.append([alumno[0], alumno[1]])

    # Ordenamiento descendente por promedio
    for i in range(len(copia)):
        for j in range(i + 1, len(copia)):
            if calcular_promedio(copia[j][1]) > calcular_promedio(copia[i][1]):
                aux = copia[i]
                copia[i] = copia[j]
                copia[j] = aux

    print("\n--- ALUMNOS ORDENADOS POR PROMEDIO ---")
    for alumno in copia:
        promedio = calcular_promedio(alumno[1])
        print(f"{alumno[0]} -> Promedio: {promedio:.2f}")
    print()


def menu():
    while True:
        print("====== MENÚ ======")
        print("1. Ver alumnos")
        print("2. Agregar alumno")
        print("3. Agregar o modificar notas")
        print("4. Ver alumno con mejor promedio")
        print("5. Ordenar alumnos por promedio")
        print("6. Salir")

        opcion = input("Seleccione una opción: ").strip()

        if opcion == "1":
            ver_alumnos()
        elif opcion == "2":
            agregar_alumno()
        elif opcion == "3":
            agregar_o_modificar_notas()
        elif opcion == "4":
            mostrar_mejor_promedio()
        elif opcion == "5":
            ver_alumnos_ordenados_por_promedio()
        elif opcion == "6":
            print("Saliendo del sistema...")
            break
        else:
            print("Opción inválida.\n")


menu()