const fs=require('fs')
const cmd=process.argv[2]

function create(command){
    fs.writeFile("employees.json",'{"name":"Employee1 Name","salary":2000}',"utf-8",(err)=>{
        if(err){console.log(err)}
    })
}

function read(){
    fs.readFile("employees.json","utf-8",(err,data)=>{
        if(err) console.log(err)
        console.log(data)
    })
}

function update(){
    fs.appendFile("employees.json",'{"name":"employee2","salary":3000}',(err)=>{
        if(err) throw err
        console.log("the data is appended")
    })
}

function deleteFile(){
    fs.unlink("employees.json",(err,)=>{
        if(err) console.log(err)
    })
}

switch(cmd)
{
    case "create":
        create()
        break;
    case "read":
        read()
        break;
    case "update":
        update()
        break;
    case "delete":
        deleteFile();
        break;
}