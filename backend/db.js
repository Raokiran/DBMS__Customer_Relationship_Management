const mysql=require('mysql2/promise')

async function CreateConnection(){
return await mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'kiran',
    database:'crm2'
});
}

module.exports=CreateConnection