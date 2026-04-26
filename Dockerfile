# Use the lightweight Nginx Alpine image
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our hardened nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy all application files
COPY index.html /usr/share/nginx/html/index.html
COPY styles.css /usr/share/nginx/html/styles.css
COPY app.js /usr/share/nginx/html/app.js
COPY tests.js /usr/share/nginx/html/tests.js
COPY sw.js /usr/share/nginx/html/sw.js
COPY manifest.json /usr/share/nginx/html/manifest.json

# Expose port 8080 (Cloud Run standard)
EXPOSE 8080

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
