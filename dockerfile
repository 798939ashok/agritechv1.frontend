FROM node:22 AS builder
WORKDIR /agri-frontend
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build


FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY --from=builder /agri-frontend/build .
EXPOSE 80

CMD ["nginx","-g","daemon off ;"]