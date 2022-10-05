import * as dotenv from 'dotenv'
dotenv.config()
import colors from 'colors';
import { leerInput,
        inquirerMenu,
        pausa,
        confirmar,
        listarLugares } from './helpers/inquirer.js';
import { Busquedas } from './models/busquedas.js';

const main = async() => {

    const busquedas = new Busquedas();
 
    console.clear();
    let opt;

     do {

        opt = await inquirerMenu(); 
        
        switch ( opt ) {

            case 1:
                
                // Mostrar el mensaje
                const termino = await leerInput('Ciudad: ');
                
                // Buscar los lugares
                const lugares = await busquedas.ciudad( termino ); // envío el término que se ingresó por parte del usuario y se regresa un arreglo con la información que me interesa de los 5 lugares. Este se guarda en "lugares"
                
                // Selecciona el lugar
                const id = await listarLugares( lugares ); // se envían los lugares de forma bonita con el inquirer, el usuario selecciona uno y se regresa el "id" del lugar seleccionado. Este se guarda en "id"

                const lugarSel = lugares.find( l => l.id === id ); // el método "find" me regresa el primer elemento que cumple la condición especificada. "l" es la key

                if ( lugarSel ){ // por si se presionó cancelar y no se seleccionó ningún lugar. IMPORTANTE: Otra forma de hacerlo pudo haber sido colocando "if ( id === '0' ) continue;". El "continue" hace que siga la siguiente iteración del ciclo de una vez

                    // Guardar en DB
                    busquedas.agregarHistorial( lugarSel.nombre ); // luego de seleccionar el lugar, se agrega al historial enviando como argumento el nombre del lugar
                    
                    // Clima
                    const clima = await busquedas.climaLugar( lugarSel.lat, lugarSel.lng ); // se envían la latitud y longitud del lugar seleccionado y se regresa un objeto con la informacion del clima en este lugar, que se almacena en "clima"

                    // Mostrar resultados
                    console.clear();
                    console.log( '\nInformación de la ciudad\n'.green );
                    console.log( 'Ciudad:', lugarSel.nombre.green );
                    console.log( 'Lat:', lugarSel.lat );
                    console.log( 'Lng:', lugarSel.lng );
                    console.log( 'Temperatura:', clima.temp );
                    console.log( 'Mínima:', clima.min );
                    console.log( 'Máxima:', clima.max );
                    console.log( 'Cómo está el clima:', clima.desc.green ); 
                    // console.log( '-> Los datos de la temperatura están indicados en °C' ); 

                }
                
            break;
            
            case 2:
                
                console.log('');
                busquedas.historialCapitalizado.forEach( ( lugar, i ) => {
                    const idx = `${ i + 1 }.`.green;
                    console.log( `${ idx } ${ lugar }` );
                })

            break;

            case 0:
                
            let ok = await confirmar('\n¿Está seguro que desea salir?');

            if ( !ok ) {
                opt = 'No ejecutar pausa';
            }

            break;
        }

        if ( ![ 0,'No ejecutar pausa'].includes(opt) ) await pausa(); //  "if ( ![ 0,'No ejecutar pausa'].includes(opt) )" es como decir "if ( opt !== 0, "No ejecutar pausa" )", solo que este último no es válido. Otra formas se pueden encontrar en https://stackoverflow.com/questions/6115801/how-do-i-test-if-a-variable-does-not-equal-either-of-two-values

        
     } while (opt !== 0);    
}

main();