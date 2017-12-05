# NEPP - Node, Express, Postgres, and Passport

NEPP is a scaffolded REST API utilizing Node.js, Express.js, Postgres SQL (Sequelize), and Passport for authentication.

## Setting up database

Make sure you have Postgres installed. The database used in this project is called *nepp*. If you want a different name, replace every instance of *nepp* with your desired name.

Run the following commands

1. Change `username` value in `config/config.json` to your username
  - Optional: Change `database` value if you are using a different name
2. `sequelize init`
3. `createdb nepp`
4. `sequelize db:migrate`
