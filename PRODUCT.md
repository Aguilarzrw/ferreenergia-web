# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Vite + JavaScript vanilla, sitio 100% estático multipágina (inicio, catálogo, calculadora, servicios, sedes) desplegado en GitHub Pages (`base: /ferreenergia-web/`). Three.js (hero 3D, carga diferida), GSAP + ScrollTrigger, Lenis. Catálogo desde `src/data/productos.json`, calculadora desde `src/data/equipos.json`. Sin backend: los pedidos salen por WhatsApp (`wa.me`).

## Users

Prioridad confirmada: **fincas y agro** (productores de los llanos, Guárico y Aragua) que necesitan respaldo eléctrico y maquinaria. También atiende, según el encargo original, hogares y comercios con apagones en Aragua y los llanos. Entran casi todos desde el teléfono, con datos lentos. Quieren saber qué planta necesitan, cuánto cuesta y escribir por WhatsApp.

## Product Purpose

Propuesta de sitio web para **Inversiones Ferre Energía (Ferreenergía VE)**, vendedor de generadores eléctricos y maquinaria agrícola con sedes en San Jacinto (Aragua, principal) y Camaguán (Guárico, nueva). El sitio presenta el catálogo y convierte la visita en una conversación de WhatsApp con equipo y potencia ya definidos. Éxito: el visitante identifica la planta correcta (calculadora o catálogo) y pide cotización.

## Positioning

Confirmado por el cliente: distribuidor de **Europower** (también vende AGG y otros generadores), con **instalación y soporte propios**, **stock y entrega rápida** a aragua y los llanos, y **cobertura en los llanos** con la nueva sede de Camaguán.

## Operating Context

La venta se cierra por WhatsApp (0424-354-6663 y 0424-306-9546; internacional 584243546663 y 584243069546) e Instagram (@ferrenergia2020). Precios en USD. La comunicación del negocio en redes es fuerte e industrial, con precios grandes. Servicios: venta, instalación, servicio técnico, entregas y despachos, asesoría.

## Capabilities and Constraints

- Calculadora de potencia: suma vatios de equipos, considera el mayor arranque de motor, factor de potencia 0.8 y 25% de margen; recomienda un producto del catálogo.
- Catálogo con filtros, buscador, ficha de producto, comparador de hasta 3 plantas y botón "Pedir por WhatsApp" con mensaje prellenado.
- Rendimiento: 3D con carga diferida y versión estática en equipos débiles; respeta `prefers-reduced-motion`.
- Meta de calidad: Lighthouse móvil Performance ≥ 80 y Accesibilidad ≥ 95 (no medida todavía).
- Indexación bloqueada (`noindex`) mientras sea propuesta.
- **Pendiente de confirmar con el cliente:** cifras de la barra de confianza (+8 años, +350 equipos, 12 meses de garantía), horarios de sedes, precios y especificaciones de los productos marcados `ejemplo`, combustible de las AGG, qué número de WhatsApp atiende cada sede, textos de garantía/pago/envío del FAQ.

## Brand Commitments

Nombre: Inversiones Ferre Energía / Ferreenergía VE. Logo circular con generador al centro y rayo rojo (el logo actual del sitio es un placeholder; falta el original). Colores de marca: amarillo (~#FFC800), negro, rojo del rayo (~#E10600) y blanco. Estilo premium-industrial, no de volante. Español venezolano, directo y vendedor, sin exagerar. Crédito en el pie: "Diseño y desarrollo: aguidev".

## Evidence on Hand

Fotos reales tomadas del Instagram público del cliente, en `public/img/productos/` (DG15000SE, EM3800, generador dual 12.000 W, generadores de 3.500 W, flyer AGG) y `public/img/trabajos/` (despacho, inauguración de Camaguán, showroom). Precios y modelos reales vistos en sus publicaciones: Europower DG15000SE $3.150, EM3800 $400, AGG 66/75/83/110/150 KVA entre $12.200 y $22.500. **No hay** testimonios, cifras de ventas, años de operación ni horarios confirmados: las cifras de la barra de confianza son inventadas y no deben tratarse como evidencia.

## Product Principles

1. La decisión de compra se cierra en WhatsApp: cada pantalla lleva a un mensaje con el equipo correcto.
2. Primero el teléfono con datos lentos: el texto y los CTAs aparecen al instante, lo pesado llega después.
3. Mostrar la planta real y su precio antes que adornos; no inventar cifras ni pruebas.
4. Los llanos y el agro son prioridad: la web debe sentirse cercana a la finca, no a un catálogo de ferretería urbana.

## Accessibility & Inclusion

Objetivo AA: contraste, foco visible, navegación con teclado en filtros, desplegables, modales y calculadora, objetivos táctiles ≥ 44 px en móvil, `prefers-reduced-motion`.
