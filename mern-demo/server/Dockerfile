FROM node:20

WORKDIR /app

# Sửa lại thành package*.json ./ (lấy trực tiếp từ folder server)
COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]