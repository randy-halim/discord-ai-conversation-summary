FROM node:19-slim AS base
RUN corepack enable

FROM base as builder

WORKDIR /home/builder
COPY . .
RUN pnpm install --frozen-lockfile

RUN pnpm compile

FROM base as runner

ENV DB_FILE=file:/home/runner/db/database.db

WORKDIR /home/runner
COPY package.json .
COPY pnpm-lock.yaml .
COPY prisma/schema.prisma ./prisma/schema.prisma
COPY --from=builder /home/builder/out ./out

RUN pnpm install --frozen-lockfile
RUN pnpm prisma migrate deploy
RUN pnpm prisma db push

ENTRYPOINT ["node", "."]
