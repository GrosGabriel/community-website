FROM denoland/deno:alpine-2.4.3

WORKDIR /app

COPY deno.json .

RUN DENO_FUTURE=1 deno install

COPY . .

CMD [ "deno", "run", "--allow-env", "--allow-net", "app-run.js" ] 