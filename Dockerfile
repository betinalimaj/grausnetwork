FROM nginx:alpine

# Copia todo o conteúdo de public para a pasta onde o Nginx serve arquivos
COPY public /usr/share/nginx/html

# Expõe a porta 80 do container
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]