# Sistema de Reservaciones

Este proyecto implementa un sistema de reservaciones utilizando un enfoque híbrido que combina principios de la arquitectura hexagonal con elementos de la arquitectura por capas. Esta combinación se elige para proporcionar flexibilidad, facilidad de prueba y mantenimiento, así como una estructura organizativa clara.

## Características Principales

1. **Separación de Preocupaciones:**
   - La arquitectura hexagonal se utiliza para separar la lógica de negocio de las reservaciones de los detalles de implementación, como la interfaz de usuario y la persistencia de datos.

2. **Flexibilidad y Pruebas:**
   - La estructura de puertos y adaptadores facilita las pruebas unitarias y la sustitución de componentes, permitiendo pruebas más robustas y adaptabilidad a cambios futuros.

3. **Organización Estructurada:**
   - El núcleo de la aplicación se organiza en capas lógicas (presentación, lógica de aplicación, persistencia) para mantener una estructura clara y modular, facilitando la comprensión y el mantenimiento.

4. **Escalabilidad:**
   - La separación de las capas y la modularidad permiten escalar diferentes partes del sistema de manera independiente, por ejemplo, escalando la persistencia de datos por separado de la lógica de aplicación.

5. **Adaptabilidad a Cambios:**
   - La arquitectura hexagonal se elige por su enfoque en la flexibilidad, permitiendo adaptarse más fácilmente a cambios en los requisitos o en la tecnología subyacente.

## Configuración y Uso

1. Clona este repositorio: `git clone https://github.com/tuusuario/tuproyecto.git`
2. Instala las dependencias: `npm install` (o el gestor de dependencias correspondiente)
3. Ejecuta la aplicación: `npm start` (o el comando correspondiente)

¡Listo! Tu sistema de reservaciones está ahora en funcionamiento con una arquitectura híbrida que combina lo mejor de la arquitectura hexagonal y por capas.

