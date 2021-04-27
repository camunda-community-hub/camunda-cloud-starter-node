# Getting Started with Camunda Cloud and Node.js

This project uses the [Zeebe Node Client](https://github.com/camunda-community-hub/zeebe-client-node-js) to connect to Camunda Cloud.

It demonstrates how to:

* Create a ZBClient that connects to a Camunda Cloud cluster
* Deploy a process model to Camunda Cloud
* Create a process instance in Camunda Cloud
* Create a worker that services jobs
* Integrate Camunda Cloud behind a REST front-end

This project does not contain best practices for application structure. If you are looking for a highly opinionated project structure for Node.js, you might consider using the Zeebe NestJS integration and the NestJS framework.

## Prerequisites

* [Node.js](https://nodejs.org)
* [Camunda Cloud account](https://camunda.io)
* [Zeebe Modeler](https://github.com/zeebe-io/zeebe-modeler/releases)

## Setup 

### Clone the project

* Clone this repo.

* Change directory into the cloned repository.

* Install dependencies in the project:

```bash
npm i 
```

### Create Camunda Cloud cluster

* Log in to [https://camunda.io](https://camunda.io).
* Create a new Zeebe 1.x.y cluster.
* When the new cluster appears in the console, create a new set of client credentials. 
* Download the client credentials `.txt` file.

### Start the project

* Run the command:

```bash
npm start
```

* Open [http://localhost:3000](http://localhost:3000) in your browser.

### Configure connection

You have two options here - via the Web UI or via the `.env` file. 

#### Option 1: Via Web UI 

* Open [http://localhost:3000](http://localhost:3000) in your browser.

* Upload the client credentials `.txt` for your cluster. 

#### Option 2: Via .env file

* Create a file `.env` in the root of the project
* Paste the client connection environment variable block 
* Delete the `export` from in front of each line in the file

You will end up something that looks like this:

```bash
ZEEBE_ADDRESS='231bb36a-1588-4f1e-b4f6-e09944d7efd7.zeebe.camunda.io:443'
ZEEBE_CLIENT_ID='Ny-WTmQniq4XluEG0_L9KAl-G8~i_dH1'
ZEEBE_CLIENT_SECRET='9QZWpArT_2C1jU7Kru3Kll~7Hev9jyMsuo5tCk2ko0ZpzNRDb7nbiVqmcUBL'
ZEEBE_AUTHORIZATION_SERVER_URL='https://login.cloud.camunda.io/oauth/token'
```

* Save the file.

## Project structure

This Getting Started Guide project is structured as:

* A simple JavaScript front-end application written in [Svelte](https://svelte.dev/)
* A Node.js Express REST API 
* Camunda Cloud integrations consisting of process models, process model deployment, Zeebe workers, and process instance creation route handlers.

### Front End

The front-end application is in the `client` directory. It uses the [bpmn.io](https://bpmn.io/) BPMN Model Viewer to display the BPMN process models in the browser.

### Node.js REST API 

The server is in the `src/rest/server.ts` file. It has some routes to allow you to configure the application from the front-end, and the Express application is exported to allow Getting Started Scenarios to add route handlers.

### Camunda Cloud integration

The process models are found in the `bpmn` directory.


## Test Connection with Camunda Cloud 

When the application is configured, the [`camundaCloudClusterConnection`](http://localhost:3000/camundaCloudClusterConnection) endpoint will connect to the Zeebe cluster in Camunda Cloud, and return its topology.

It does this by using the `ZBClient.topology()` method in the implementation in `src/server.ts`.

## Scenarios

### Send an Email

The first scenario sends an email using the SendGrid API. You can get a 
