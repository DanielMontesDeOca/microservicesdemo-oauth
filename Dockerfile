FROM node:6

COPY ./src /var/lib/app
COPY ./scripts/startup.sh ./scripts/startup.test.sh /home/docker/

WORKDIR /var/lib/app

RUN chmod +x /home/docker/*.sh
RUN git clone https://github.com/DanielMontesDeOca/microservicesdemo-core.git /var/lib/core
RUN npm install --silent && npm install -g nodemon

EXPOSE 80

ENTRYPOINT ["/home/docker/startup.sh"]
