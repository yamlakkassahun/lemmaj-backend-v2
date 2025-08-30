# Lemmaj

### Runing the project 

# run development

docker-compose --env-file ./env/development.env -f ./docker-compose.dev.yml build

docker-compose --env-file ./env/development.env -f ./docker-compose.dev.yml up --build -d

# run production 

docker-compose --env-file ./env/production.env -f ./docker-compose.prod.yml build

docker-compose --env-file ./env/production.env -f ./docker-compose.prod.yml up --build -d --scale fantasy-api=8 -d

