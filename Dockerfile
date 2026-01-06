FROM nginx:stable-alpine
#WORKDIR /usr/share/nginx/html
COPY . /usr/share/nginx/html/trains

# Создаем простую конфигурацию
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    \
    location /trains/ { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /trains/index.html; \
    } \
    \
    location / { \
        return 301 /trains/; \
    } \
}' > /etc/nginx/conf.d/default.conf

#COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]