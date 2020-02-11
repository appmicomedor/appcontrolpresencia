# APP Gestión Interna Catering

App para la gestion interna del servicio del comedor.

La aplicación usa https://www.npmjs.com/package/odoo-xmlrpc para acceder a la API de odoo (https://www.odoo.com/documentation/10.0/api_integration.html)


## Instalación

* Clonar este repositorio: `git clone https://github.com/appmicomedor/appcontrolpresencia`
* Ejecutar `cd ../appcontrolpresencia`
* Ejecutar `npm install`.
* Ejecutar `ionic serve` para levantar la aplicación.

### Progressive Web App (PWA)

1. Ejecutar `npm run ionic:build --prod`
2. Colocar el directorio  `www` en su proveedor de hosting

### Android

1. Ejecutar `ionic cordova run android --prod`

### iOS

1. Ejecutar `ionic cordova run ios --prod`

### CAMBIOS
1.0.4 
  Incorporación de grupos de agrupación de comensales.
1.0.3
  Visualización de albaranes de entrega.
  
  
