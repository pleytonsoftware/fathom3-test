# FATHOM3-TEST by Pablo Leyton


# Docker Installation and Usage Guide

This guide provides step-by-step instructions for installing and running a Docker container using Docker Compose.

## Prerequisites
- Docker Engine installed on your machine
- Docker Compose installed on your machine

## Installation
1. Clone the repository.
2. Open a terminal window and navigate to the root project directory of the cloned repository.
3. Run the following command to build the Docker image: `docker-compose build`

## Usage
1. Navigate to the root directory of the cloned repository.
2. Run the following command to start the Docker container: `docker-compose up`


This command will start the container and output the container logs to the terminal window. If the container is already running, this command will attach to it and output the container logs.

To stop the container, press `Ctrl+C` in the terminal window where you ran the `docker-compose up` command.
To remove the containers, run the following command: `docker-compose down`.

## Configuration
If you need to modify the configuration of the Docker container, you can do so by editing the `docker-compose.yml` file. This file contains all the configuration options for the Docker container, including the ports that the container listens on, the environment variables that are passed to the container, and more.

## Postman
If you want to use postman to check endpoints, you can import `postman_collection.json` file and use it after `docker-compse up` is up and running.

## License
This project is licensed under the [MIT License](LICENSE).
