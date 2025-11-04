Red Route - Entelgy — Prototipo Dashboard Web

Red Route - Entelgy es un prototipo funcional de dashboard web diseñado para la gestión de solicitudes, aprobaciones, repositorios de archivos, monitoreo y reportes administrativos.
El sistema reproduce el flujo de trabajo entre diferentes roles (operadores, revisores y administradores), facilitando la comprensión del proceso interno de operaciones.

Demo en línea

Ver prototipo en GitHub Pages

Descripción general

Este proyecto fue desarrollado dentro del taller de prototipos web interactivos, con el propósito de representar de forma visual e intuitiva los flujos funcionales de una aplicación de control operativo.
Su interfaz responsiva y moderna busca simular un entorno administrativo real, incluyendo módulos de solicitudes, aprobaciones, repositorio de archivos y reportes.

Características principales

Dashboard general: muestra métricas clave como solicitudes activas, pendientes y archivos cargados.

Gestión de solicitudes: permite crear, consultar y registrar solicitudes con campos dinámicos.

Autorizaciones: módulo para aprobar o rechazar solicitudes pendientes.

Repositorio: simula la carga y validación de archivos.

Histórico: presenta el registro completo de solicitudes y su estado.

Monitoreo: panel con indicadores del sistema.

Reportes: opción para exportar la información en formato CSV.

Administración: permite gestionar usuarios, roles y permisos.

Comentarios: secciones activas para registrar observaciones en cada pantalla durante las pruebas de usabilidad.

Flujo funcional

El usuario ingresa al Dashboard para visualizar el resumen general.

Desde allí puede acceder al módulo de Solicitudes y registrar una nueva entrada.

Las solicitudes avanzan al módulo de Autorizaciones, donde se aprueban o rechazan.

Los resultados se actualizan automáticamente en el Histórico.

En el Repositorio, los usuarios cargan archivos que también pueden ser validados.

Los módulos de Monitoreo y Reportes permiten revisar indicadores y exportar datos.

Finalmente, en Administración se gestionan los usuarios y sus permisos.

Tecnologías utilizadas
Categoría	Tecnología
Lenguajes base	HTML5, CSS3, JavaScript
Diseño visual	Paleta oscura con tonos #4AA3FF y #5DD6B4
Almacenamiento local	LocalStorage (para persistencia temporal)
Dependencias	Ninguna (código nativo)
Hosting	GitHub Pages
Formularios externos	Integración con Formspree (opcional)
Estructura del proyecto
Prototipos-web/
├── index.html  
├── css/  
│   └── styles.css  
├── js/  
│   └── main.js  
├── img/  
│   └── recursos gráficos del dashboard  
└── README.md
