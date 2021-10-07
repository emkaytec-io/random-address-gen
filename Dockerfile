FROM 120015694021.dkr.ecr.us-east-1.amazonaws.com/lambda-base:latest@sha256:385d27d0390b93a534d09b3babc205525073ba40d3db7d22803185146899b691

COPY app.js package.json ${LAMBDA_TASK_ROOT}/

RUN npm install

CMD [ "app.handler" ]