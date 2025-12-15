# 🚀 Intranet Tag Marketing

**Plataforma integral de gestión interna para Tag Marketing.**

Este sistema centraliza la administración operativa de la empresa, combinando un sistema de gamificación para empleados, gestión documental segura y herramientas de productividad automatizadas. Diseñado para optimizar el flujo de trabajo y fomentar la cultura organizacional.

## 📋 Características Principales

* **🏆 Sistema de Puntos Gamificado:** Gestión completa de economía interna con asignación de puntos, catálogo de ítems canjeables e historial transaccional por usuario.
* **👥 Gestión de Usuarios Avanzada:** Administración centralizada de perfiles, roles y permisos con autenticación segura.
* **📂 Repositorio Documental:** Sistema de carga, almacenamiento y visualización de documentos internos corporativos.
* **🛠️ Herramientas y Utilidades:** Acceso rápido a recursos de uso frecuente y generador de códigos QR integrado.
* **🤖 Automatización (Cron Jobs):** Tareas programadas en el servidor para mantenimiento de base de datos y recordatorios automáticos.
* **📧 Sistema de Notificaciones:** Envío automatizado de correos electrónicos transaccionales y alertas mediante SMTP.

## 🛠️ Stack Tecnológico

El proyecto utiliza una arquitectura **MERN** separada en cliente y servidor:

### Frontend (`/client/puntos`)
* **Core:** React.js
* **Estado:** Redux Toolkit
* **Auth:** Firebase Authentication
* **Estilos:** CSS Modules

### Backend (`/server`)
* **Runtime:** Node.js & Express
* **Base de Datos:** MongoDB & Mongoose
* **Auth & Admin:** Firebase Admin SDK
* **Email:** Nodemailer (SMTP)
* **Tareas:** Node-Cron

## ⚙️ Configuración de Variables de Entorno

Para ejecutar el proyecto, es necesario configurar las variables de entorno en ambos directorios (`server` y `client`).

### 1. Backend (`/server/.env`)
Crea un archivo `.env` en la raíz de la carpeta `server` con las siguientes credenciales:

```env
# Base de Datos (MongoDB)
DB_USER=tu_usuario_mongo
DB_PASSWORD=tu_contraseña_mongo
DB_DATABASE=nombre_base_de_datos
JWT_SECRET=tu_secreto_jwt_seguro

# Configuración SMTP (Correos)
SMTP_HOST=smtp.ejemplo.com
SMTP_PORT=465
SMTP_USER=tu_correo@dominio.com
SMTP_PASS=tu_contraseña_smtp