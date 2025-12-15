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

Es necesario crear un archivo `.env` tanto en el directorio del servidor como en el del cliente.

### 🖥️ Server (`/server/.env`)

```env
# Base de Datos y Seguridad
DB_USER=
DB_PASSWORD=
DB_DATABASE=
JWT_SECRET=

# Configuración SMTP (Correos)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=

### 🖥️ Client (/client/.env)


# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=

# API Connection
REACT_APP_API_URL=