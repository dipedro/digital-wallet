# Digital Wallet API

This project is a digital wallet application that consists of an API gateway and two microservices: wallet-ms and extract-ms. The API gateway is responsible for routing requests to the appropriate microservice based on the endpoint, while each microservice handles specific functionalities related to the digital wallet.

## Commit Patterns

Commits needs to be semantics and follow the pattern below: 

- `feat`: Used when introducing a new feature or functionality.
- `fix`: Used when fixing a bug or resolving an issue.
- `docs`: Used for documentation-related changes.
- `style`: Used for code style changes, such as formatting, indentation, or whitespace. 
- `refac`: Used when refactoring code without changing its external behavior.
- `test`: Used for adding or modifying tests.
- `chore`: Used for general maintenance tasks or tooling changes.
- `build`: Used when change build files

## Nomenclature Patterns

| Standard   | Definition             | Example                  |
| ---------- | ---------------------- | -----------------------  |
| Directories| LowerCase + Plural     | dtos, services, entities |
| Files      | Kebab Case + Singular  | transaction.dto.ts       |
| Entities   | Pascal Case + Singular | WalletEntity             |
| Tables     | Snake Case + Plural    | wallets                  |
| Columns    | Snake Case + Singular  | id, walletd              |
| Enum       | Snake Case + Uppercase | FIND_EXTRACT             |

## Configuration

Before running the microservices, make sure to fulfill the .env file in each microservice's directory. The .env file should contain environment-specific configurations such as database connection settings, Kafka broker URLs, and any other necessary configurations. An example .env file template is provided in each microservice's directory as .env.example. Rename this file to .env and fill in the required values before starting the microservices.

## Running the Project

To run the project, make sure you have Docker installed on your machine, then execute the following command in the project root directory:

```bash
docker-compose up
```

This command will build and start all the necessary containers for the API gateway and microservices.

## General Architecture
![General Architecture](./docs/General%20Architecture.png)

## API Gateway

The API gateway is the entry point for all requests to the digital wallet application. It handles routing requests to the wallet-ms and extract-ms microservices based on the endpoint. The API gateway is implemented using NestJS and integrates with Kafka for message passing between microservices.

### Routes

![Endpoints Flow](./docs/Flow%20-%20Endpoints.png)


    GET /wallets/:id: Get wallet info by id
	GET /wallets/:id/extract Get all transactions maked in this wallet
	POST /wallets/:id/transaction Make transaction in this wallet

For more details, you can consult the Swagger Docs after run the project in the follow path:

	localhost:3000/docs

## Auth Service (In progress)
Not implemented yet.

## Wallet Microservice (wallet-ms)

The wallet microservice is responsible for managing the wallet balances of users. It provides endpoints for adding funds, withdrawing funds, making purchases, chargeback and canceling purchases. The wallet microservice is implemented using NestJS and integrates with Kafka for communication with other microservices.

## Extract Microservice (extract-ms)

The extract microservice is responsible for managing the transaction history of users. It provide endpoint for retrieving transaction history. The extract microservice is implemented using NestJS and integrates with Kafka for communication with other microservices.