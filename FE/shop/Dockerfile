# ==========================================
# Giai do?n 1: Build ?ng d?ng React v?i Vite
# ==========================================
FROM node:20-alpine AS build

WORKDIR /app

# Sao chép file d?nh nghia dependencies
COPY package*.json ./

# Cài d?t dependencies
RUN npm ci

# Sao chép toàn b? mã ngu?n Frontend
COPY . .

# Argument cho API URL (m?c d?nh tr? d?n http://localhost:8080)
ARG VITE_API_BASE_URL=http://localhost:8080
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Build d? án ra thu m?c dist
RUN npm run build

# ==========================================
# Giai do?n 2: Kh?i ch?y Nginx ph?c v? SPA
# ==========================================
FROM nginx:alpine

# Xóa c?u hình m?c d?nh c?a Nginx
RUN rm -rf /etc/nginx/conf.d/default.conf

# Sao chép c?u hình Nginx tùy ch?nh
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Sao chép các file build t? giai do?n 1 vào thu m?c g?c c?a Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# M? c?ng 80
EXPOSE 80

# Ch?y Nginx ? ch? d? foreground
CMD ["nginx", "-g", "daemon off;"]
