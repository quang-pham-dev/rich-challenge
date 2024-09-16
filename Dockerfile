# multi-stage: base (build)
FROM node:20-alpine

# create directory where the application will be built
WORKDIR /app

# copy over the dependency manifests
COPY package.json yarn.lock ./

# install dependencies
RUN yarn install --frozen-lockfile

# copy over the prisma schema
COPY prisma/schema.prisma ./prisma/

# generate the prisma client based on the schema
RUN yarn prisma generate

# copy over the code base
COPY . .

# create the bundle of the application
RUN yarn build

# multi-stage: production (runtime)
FROM node:20-alpine AS production

# create arguments of build time variables
ARG user=nestjs
ARG group=${user}
ARG uid=1001
ARG gid=$uid

# [temporary] work around to be able to run prisma
RUN apt-get update -y && apt-get install -y openssl

# create directory where the application will be executed from
WORKDIR /app

# add the user and group
RUN groupadd --gid ${gid} ${group}
RUN useradd --uid ${uid} --gid ${gid} -m ${user}

# copy over the bundled code from the build stage
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./
COPY --from=base /app/yarn.lock ./
COPY --from=base /app/dist ./dist
COPY --from=base /app/prisma ./prisma

# change ownership of the workspace directory
RUN chown -R ${uid}:${gid} /app/

# install production dependencies only
RUN yarn install --production --frozen-lockfile

# set user to the created non-privileged user
USER ${user}

# expose the port the app runs on
ENV PORT=8000
EXPOSE ${PORT}

# start the server using the previously built application
CMD [ "node", "dist/main.js" ]
