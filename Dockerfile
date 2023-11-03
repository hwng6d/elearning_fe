FROM node:16-alpine

WORKDIR /usr/app/elearning-fe

COPY ./package.json ./
RUN rm -rf node_modules
RUN rm -rf package-lock.json
RUN yarn
RUN yarn add next@latest react@latest react-dom@latest eslint-config-next@latest @next/font
COPY ./ ./
RUN yarn build

# CMD ["sh"]
CMD ["yarn", "start"]