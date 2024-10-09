# Utiliza una imagen base de Node.js para el backend
FROM node:latest AS backend

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app/backend

# Copia los archivos de tu proyecto al contenedor
COPY backend/package*.json ./
COPY backend ./

# Instala las dependencias de tu proyecto
RUN npm install

# Compila tu proyecto
# Este paso puede ser innecesario si no tienes un script de compilación en el backend
# Si no tienes, simplemente comenta o elimina esta línea.
RUN npm run build

# Expone el puerto en el que se ejecutará tu aplicación
EXPOSE 4000

# Comando para ejecutar tu aplicación cuando se inicie el contenedor
CMD ["npm", "start"]

# Utiliza una imagen base de Node.js para el frontend
FROM node:latest AS frontend

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app/frontend

# Copia los archivos de tu proyecto al contenedor
COPY frontend/package*.json ./
COPY frontend ./

# Instala las dependencias de tu proyecto
RUN npm install

# Compila tu proyecto
RUN npm run build

# Crea una imagen final que combine tanto el frontend como el backend
FROM node:latest AS final

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos compilados del backend y frontend a la imagen final
COPY --from=backend /app/backend ./
COPY --from=frontend /app/frontend/build ./frontend

# Expone los puertos en los que se ejecutarán las aplicaciones
EXPOSE 4000 3000

# Comando para ejecutar las aplicaciones cuando se inicie el contenedor
CMD ["npm", "start"]
