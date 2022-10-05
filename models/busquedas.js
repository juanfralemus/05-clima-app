import fs from 'fs'; // las importaciones de Node van al principio, luego las de terceros
import axios from 'axios';


class Busquedas {

    historial = [];
    dbPath = './db/database.json';

    constructor() {
        // leer DB si existe
        this.leerDB();
    }

    get historialCapitalizado() { // método para capitalizar la primera letra de todas las palabras de los lugares en el historial

        return this.historial.map( lugar => { // creo un arreglo con ".map" para hacer mi nuevo historial 

            const lugarWordByWord = lugar.split(" ");

            for (let i = 0; i < lugarWordByWord.length; i++) {
                lugarWordByWord[i] = lugarWordByWord[i][0].toUpperCase() + lugarWordByWord[i].substr(1);
            }
            
            return lugarWordByWord.join(" "); // regreso cada uno de los lugares ya bien capitalizados y se guardan en el arreglo

        })
        
    }

    get paramsMapbox() { // getter que va a regresarme siempre el objeto de los parámetros para Mapbox
        return {
            'limit': 5,
            'language': 'es',
            'access_token': process.env.MAPBOX_KEY // cuando el parámetro tiene un guión bajo se puede colocar sin las comillas
        }
    }

    get paramsOpenWeather() { // getter con los parámetros para OpenWeather
        return {
            appid: process.env.OPENWEATHER_KEY,
            units: 'metric',
            lang: 'es'
        }
    }

    // método para buscar un lugar, regresa un arreglo de lugares con .map
    async ciudad( lugar = '' ) {  

        try {

        // Petición http

        // se crea una instancia de axios
        const instance = axios.create({
            baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
            params: this.paramsMapbox
        });

        // se manda a llamar la instancia de axios y la información del endpoint (API) se almacena en "resp"
        const resp = await instance.get();

        // retornar los lugares que coincidan con el "lugar" que escribió la persona
        return resp.data.features.map( lugar => ({ // resp.data.features es el arreglo de lugares dentro de la data que está almacenada en "resp". Abro paréntesis y adentro de estos abro y cierro llaves para regresar un objeto de forma implícita (no es necesario colocar el return)
            id: lugar.id,
            nombre: lugar.place_name,
            lng: lugar.center[0],
            lat: lugar.center[1]
        }));
            
        } catch (error) {
            return [];
        }
    }

    // método para buscar el clima del lugar seleccionado, retorna un objeto con la información del clima
    async climaLugar( lat, lon ){

        try {
            // instance de axios
            const instanceOpenWeather = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: { 
                    ...this.paramsOpenWeather, // desestructuro todo el getter "paramsOpenWeather" y mandamos las propiedades adicionales que necesitamos ("lat" y "lon")
                    lat, 
                    lon } // colocamos solo "lat" y "lon" porque sus valores son iguales a sus nombres
            });

            // guardo en "resp" el objeto que recibí 
            const resp = await instanceOpenWeather.get();

            // desestructuro los objetos que me interesan de resp.data
            const { weather, main } = resp.data;

            // regreso un objeto con la info del clima que jalo de resp.data
            return {
                desc: weather[0].description.charAt(0).toUpperCase() + weather[0].description.slice(1), // esta es la forma para escribir la primera letra de un string en mayúsculas
                min: main.temp_min + '° C',
                max: main.temp_max + '° C',
                temp: main.temp + '° C'
            }
            
        } catch (error) {
            console.log(error);
        }

    }

    agregarHistorial( lugar = '' ) { // método encargado de hacer la grabación del historial

        // si el lugar ya existe entonces no retornamos nada, es decir, no se agrega el lugar al historial
        if( this.historial.includes( lugar.toLocaleLowerCase() ) ) { 
            return;
        }

        this.historial = this.historial.splice(0,4); // especifico que quiero que salgan solamente los primeros 5 elementos del arreglo del historial

        this.historial.unshift( lugar.toLocaleLowerCase() ); // luego de que en "index.js" se selecciona el lugar, se recibe el nombre del mismo como argumento, se verificó si no estaba repetido y se agrega al arreglo de lugares del historial

        // grabar en DB  
        this.guardarDB();           
    }

    guardarDB() { // método para grabar la información en la base de datos 

        const payload = { // creo un objeto que contiene las propiedades que deseo almacenar, en este caso solo el historial
            historial: this.historial
        }

        fs.writeFileSync( this.dbPath, JSON.stringify( payload ) ); // convierto el historial de un arreglo a string y lo almaceno en el dbPath como un archivo json

    }

    leerDB() { // método para leer la base de datos cuando se inicia la instancia de la clase Busquedas

        // revisamos si existe la base de datos
        if ( !fs.existsSync( this.dbPath ) ) return;

        //const info .... readFileSync .... path .... {encoding:'utf-8'}
        const info = fs.readFileSync( this.dbPath, { encoding: 'utf-8'} ); // leo y guardo en la const info la información de la base de datos, esta info es un String

        const data = JSON.parse( info ); // "JSON.parse" convierte de String a un Array u Object

        return this.historial = data.historial; // regreso al constructor el arreglo de lugares  de la base de datos y lo asigno a la propiedad "historial" de esta clase

    }

}

export { Busquedas };
