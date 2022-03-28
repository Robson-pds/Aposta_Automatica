const mysql = require('mysql2/promise');

async function connect() {
    if (global.connection && global.connection.state !== 'disconnected')
        return global.connection;

    const mysql = require("mysql2/promise");
    const connection = await mysql.createConnection("mysql://root:luiztools@localhost:3306/crud");
    console.log("Conectou no MySQL!");
    global.connection = connection;
    return connection;
}

async function Exec(sql, values = null) {
    const conn = await connect();
    return await conn.query(sql, values);
}

async function selectCustomers() {
    const [rows] = await Exec('SELECT * FROM clientes;');
    return rows;
}

async function insertCustomer(customer) {
    const sql = 'INSERT INTO clientes(nome,idade,uf) VALUES (?,?,?);';
    const values = [customer.nome, customer.idade, customer.uf];
    return await Exec(sql, values);
}

async function updateCustomer(id, customer) {
    const sql = 'UPDATE clientes SET nome=?, idade=?, uf=? WHERE id=?';
    const values = [customer.nome, customer.idade, customer.uf, id];
    return await Exec(sql, values);
}

async function deleteCustomer(id) {
    const sql = 'DELETE FROM clientes where id=?;';
    return await Exec(sql, [id]);
}

module.exports = {selectCustomers, insertCustomer, updateCustomer, deleteCustomer}