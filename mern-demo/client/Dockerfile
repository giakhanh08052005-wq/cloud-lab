FROM node:20
WORKDIR /app


COPY package*.json ./


# Câu 54. Cài đặt các package của React Application
RUN npm install

# Câu 55. Sao chép source code React vào Container
COPY . .

# Câu 56. Build React Application trong quá trình xây dựng Docker Image
RUN npm run build

# Câu 57. Kiểm tra/phục vụ thư mục dist bằng Nginx (Multi-stage build)
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]