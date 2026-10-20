<!--
Sync Impact Report
- Version change: sin versión → 1.0.0 (constitución inicial)
- Principios modificados: ninguno; se establecen cinco principios iniciales
- Secciones añadidas: Restricciones adicionales; Flujo de desarrollo
- Secciones eliminadas: ninguna
- Seguimiento: confirmar la fecha original de ratificación
-->
# Herramienta Web Constitution

## Core Principles

### I. Simplicidad ante todo
Ante dos soluciones que cumplen la especificación, el equipo MUST elegir la más simple. El producto es una versión 1: no se MUST construir complejidad anticipada ni abstraer necesidades que la especificación aún no plantea. La complejidad adicional requiere una necesidad escrita en la spec.

### II. Idioma y mercado: español de Perú
Todo texto visible para usuarios MUST estar en español de Perú y toda presentación de precios o montos MUST usar soles (PEN), con formatos adecuados al mercado peruano.

### III. Cero alcance fantasma
El equipo MUST implementar solo funcionalidades escritas en la spec vigente. Las ideas nuevas MUST proponerse para su incorporación a la spec antes de implementarse. Una conversación, supuesto o detalle técnico no escrito en la spec no autoriza funcionalidad de producto.

### IV. Verificable por una persona no técnica
Cada criterio de éxito MUST poder comprobarse usando la aplicación, sin leer código ni usar herramientas de desarrollo. Las specs MUST describir resultados visibles y pasos de verificación comprensibles para una persona no técnica.

### V. Datos del usuario con respeto
El producto MUST pedir únicamente los datos imprescindibles para las funcionalidades descritas en la spec. El código MUST NOT incluir claves, credenciales ni otros secretos; estos MUST gestionarse fuera del código.

## Restricciones adicionales

Los requisitos de producto se definen en la spec vigente. Esta constitución fija reglas de gobernanza y calidad; no autoriza por sí misma funcionalidades, integraciones ni recopilación de datos.

## Flujo de desarrollo

Antes de implementar, revisar que el cambio esté cubierto por la spec vigente. Al revisar el trabajo, comprobar los cinco principios y verificar cada criterio de éxito desde la aplicación siguiendo los pasos descritos en la spec.

## Governance

Esta constitución gobierna las decisiones de producto e ingeniería del proyecto. Para enmendarla, documentar el cambio propuesto, sus motivos y efectos sobre las specs vigentes; revisar su compatibilidad con los cinco principios y actualizar la versión según el alcance. Los cambios que alteren una regla existente incrementan la versión MAJOR; añadir un principio o ampliar materialmente una regla incrementa MINOR; las aclaraciones sin cambio de sentido incrementan PATCH. En cada revisión de cambios, comprobar su conformidad con la constitución y la spec. Resolver cualquier conflicto de alcance actualizando primero la spec mediante el flujo correspondiente.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): fecha original desconocida | **Last Amended**: 2026-10-20
