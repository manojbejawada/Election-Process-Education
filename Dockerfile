# Use the lightweight Nginx Alpine image
FROM nginx:alpine

# Copy the static files to the Nginx html directory
COPY index.html /usr/share/nginx/html/index.html
COPY styles.css /usr/share/nginx/html/styles.css
COPY app.js /usr/share/nginx/html/app.js
COPY tests.js /usr/share/nginx/html/tests.js

# Cloud Run expects the container to listen on the port defined by the PORT environment variable.
# By default, Nginx listens on port 80. We'll change it to 8080.
RUN sed -i 's/listen\(.*\)80;/listen 8080;/g' /etc/nginx/conf.d/default.conf

# Expose port 8080
EXPOSE 8080

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
