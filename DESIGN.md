---
name: Ferreenergía VE
description: Premium-industrial sobre base negra, con amarillo de marca como energía y el rojo solo para el rayo y alertas.
colors:
  energy-yellow: "#FFC800"
  energy-yellow-hover: "#FFD84A"
  yellow-muted: "#B38C00"
  bolt-red: "#E10600"
  ink-deepest: "#050505"
  ink-base: "#0A0A0A"
  ink-raised: "#111111"
  ink-card: "#181818"
  ink-control: "#222222"
  text-main: "#F3F3F0"
  text-muted: "#A8A8A2"
  line: "rgba(255,255,255,0.10)"
  line-yellow: "rgba(255,200,0,0.35)"
  whatsapp-green: "#25D366"
typography:
  display:
    fontFamily: "Big Shoulders Display Variable, Impact, Arial Narrow, sans-serif"
    fontSize: "clamp(2.5rem, min(5.4vw, 10vh), 4.75rem)"
    fontWeight: 850
    lineHeight: 0.95
    letterSpacing: "0.005em"
  headline:
    fontFamily: "Big Shoulders Display Variable, Impact, Arial Narrow, sans-serif"
    fontSize: "clamp(1.75rem, 3.1vw, 2.5rem)"
    fontWeight: 850
    lineHeight: 1
  title:
    fontFamily: "Big Shoulders Display Variable, Impact, Arial Narrow, sans-serif"
    fontSize: "1.2rem"
    fontWeight: 800
    lineHeight: 1.05
  body:
    fontFamily: "Archivo Variable, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "JetBrains Mono Variable, ui-monospace, Consolas, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    letterSpacing: "0.12em"
rounded:
  sm: "6px"
  md: "10px"
  lg: "14px"
spacing:
  s1: "4px"
  s2: "8px"
  s3: "12px"
  s4: "16px"
  s5: "24px"
  s6: "32px"
  s7: "48px"
  s8: "64px"
components:
  button-primary:
    backgroundColor: "{colors.energy-yellow}"
    textColor: "#000000"
    rounded: "{rounded.md}"
    height: "40px"
    padding: "0 16px"
  button-primary-hover:
    backgroundColor: "{colors.energy-yellow-hover}"
  button-ghost:
    backgroundColor: "rgba(255,255,255,0.03)"
    textColor: "{colors.text-main}"
    rounded: "{rounded.md}"
    height: "40px"
  card-product:
    backgroundColor: "{colors.ink-card}"
    rounded: "{rounded.lg}"
  chip-filter:
    backgroundColor: "{colors.ink-card}"
    textColor: "{colors.text-main}"
    rounded: "{rounded.md}"
    height: "40px"
  chip-filter-active:
    backgroundColor: "{colors.energy-yellow}"
    textColor: "#000000"
---

## Overview

Máquina potente y confiable: base negra, líneas técnicas finas y el amarillo Europower como única energía. Titulares condensados y pesados en mayúsculas, etiquetas tipo ficha técnica en monoespaciada. El 3D del generador en el hero es la pieza memorable; el resto es sobrio y escaneable para quien entra desde el teléfono. El rojo aparece solo en el rayo del logo/emblema y en el badge "Nueva". Logo actual: placeholder circular (falta el original).

## Colors

- **Energía (#FFC800):** CTAs, acentos, números clave, barras y la banda de confianza/CTA. El texto sobre amarillo es siempre negro.
- **Rojo del rayo (#E10600):** únicamente el rayo del generador/logo y alertas pequeñas.
- **Neutros:** escala de negros #050505 → #222 para fondo, sección alterna (#111), tarjetas (#181818) y controles (#222). Texto #F3F3F0 y secundario #A8A8A2.
- **WhatsApp (#25D366):** solo el botón flotante.
- Prohibidos: degradados morados y estética SaaS genérica.

## Typography

Display: Big Shoulders Display (850, mayúsculas). Texto: Archivo (15 px base). Datos, KVA, precios pequeños y etiquetas: JetBrains Mono. Los precios usan el display en amarillo. Tamaños fijados por tokens (`--fs-*` en `src/styles/system.css`); el tope de titular es 4.75 rem.

## Layout

Sitio multipágina. Contenedor de 1120 px; rejilla de productos 1 → 2 → 3 → 4 columnas (560/860/1140 px). Secciones con ritmo alterno negro/#111, banda amarilla para confianza y calculadora, CTA final amarillo. Móvil primero: controles de 44 px, filtros en hoja inferior, medidor de la calculadora fijo al fondo. Espaciado en base 4.

## Elevation & Depth

Plano y tonal: la profundidad sale de capas de negro, bordes de 1 px (`line`/`line-yellow`) y un halo amarillo sutil en hover o medidor. Sombra fuerte solo en menús flotantes y modales.

## Shapes

Radios 6/10/14 px (controles 10, tarjetas 14). Sin píldoras completas en botones. Líneas de circuito, cuadrícula técnica tenue de fondo y etiquetas con borde izquierdo amarillo.

## Components

- **Botón primario:** amarillo, texto negro, 40 px (48 en `lg`, 44 en táctil). **Ghost:** borde blanco 28%, hover amarillo. **Link:** subrayado fino.
- **Tarjeta de producto:** foto 4:3, chip KVA amarillo, combustible arriba a la derecha, badges mono, precio grande, casilla propia "Comparar".
- **Chips de filtro / desplegable propio:** sin controles nativos; activo en amarillo.
- **Modal:** ancho acotado, cabecera y pie fijos, scroll solo en el cuerpo con scrollbar fina amarilla.
- **Medidor de calculadora:** barra segmentada amarilla con rayo rojo que chispea al subir.
- **Teaser/tile:** icono en caja amarilla tenue que se invierte en hover.

## Do's and Don'ts

- Do: amarillo solo donde hay acción o dato clave; texto negro sobre amarillo; precios y KVA en primer plano.
- Do: respetar `prefers-reduced-motion` y mostrar siempre la versión estática del 3D en equipos débiles.
- Don't: inventar cifras, testimonios o precios; las cifras de la barra de confianza son provisionales.
- Don't: usar el rojo como color de acción, ni controles nativos del navegador, ni degradados morados.
