import colors from 'colors';
import inquirer from 'inquirer';



const preguntas = [
    {
        type: 'list',
        name: 'opción',
        message: '¿Qué desea hacer?',
        choices: [
            {
                value: 1,
                name: `${'1.'.green} Buscar ciudad`
            },
            {
                value: 2,
                name: `${'2.'.green} Historial`
            },
            {
                value: 0,
                name: `${'0.'.green} Salir`
            },
        ]
    }
];

const inquirerMenu = async() => {

    console.clear();
    console.log('================================'.green);
    console.log('     Seleccione una opción'.white);
    console.log('================================\n'.green);

    const { opción } = await inquirer.prompt(preguntas);

    return opción;

}

const pausa = async() => {

    const question = [
        {
            type: 'input',
            name: 'ENTER',
            message: `Presione ${ 'enter'.green } para continuar`
        }
    ];

    console.log('\n');
    await inquirer.prompt(question);

}

const leerInput = async( message ) => {

    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate( value ) {
                if( value.length === 0 ) {
                    return 'Por favor ingrese un valor';
                }
                return true;
            }
        }
    ];

    const { desc } = await inquirer.prompt(question);

    return desc;
}

// Mostramos el listado de los lugares y el usuario selecciona uno. Se regresa el valor del "id" del lugar seleccionado
const listarLugares = async( lugares = []) => { 

    // Creamos el arreglo de choices usando método map
    const choices = lugares.map( ( lugar, i = 0 ) => { // el método "map" es como el "forEach", solo que construimos y nos regresa un arreglo nuevo con la estructura que nosotros le pongamos

        i += 1;

        return {
            value: lugar.id,
            name: `${(i + '.').green} ${lugar.nombre}`
        }
    });

    choices.unshift({ // "unshift" sirve para ingresar una llave al principio del arreglo
            value :'0',
            name: `${'0.'.green} Cancelar`
        }
    )

    // Creamos el menú del inquirer para seleccionar, con el arreglo de choices
    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione lugar:',
            choices
        }
    ]

    // Imprimimos el menú del inquirer, y obtenemos y retornamos el id del lugar seleccionado
    const { id } = await inquirer.prompt(preguntas);
    return id;

}

const confirmar = async( message ) => {

    const question = [
        {
            type: 'confirm',
            name: 'ok',
            message
        }
    ];

    const { ok } = await inquirer.prompt(question);
    return ok;

}


// mostramos el listado de las tareas y el usuario selecciona las que desee. Regresa un arreglo con los "ids" de las marcadas
const mostrarListadoChecklist = async( tareas = []) => { 

    // Creamos el arreglo de choices usando método map
    const choices = tareas.map( ( key, i = 0 ) => { // el método "map" es como el "forEach", solo que construimos y nos regresa un arreglo nuevo con la estructura que nosotros le pongamos

        i += 1;

        return {
            value: key.id,
            name: `${(i + '.').green} ${key.desc}`,
            checked: ( key.completadoEn ) //inquirer me retorna las que están en "true"
                    ? true
                    : false
        }
    });

    // Creamos el menú del inquirer para hacer check, con el arreglo de choices
    const pregunta = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Seleccione',
            choices
        }
    ]

    // Imprimimos el menú del inquirer, y obtenemos y retornamos el arreglo de "ids" de la tareas seleccionadas
    const { ids } = await inquirer.prompt(pregunta); // "ids" es un arreglo
    return ids;

}

export {
    inquirerMenu,
    pausa,
    leerInput,
    listarLugares,
    confirmar,
    mostrarListadoChecklist
}