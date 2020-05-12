// MongoDB. Веб-приложение "Телефонная книга". Хранение данных с произвольным набором полей. Основные возможности:

// добавление новой записи с произвольным набором полей (например, допустима одна запись с ФИО и телефоном, другая - с ФИО, 
// пояснением, местом работы, почтой и телефоном, третья - с названием и телефоном);
// фильтрация вывода документов по заданному пользователем параметру;
// редактирование и удаление выбранного документа.
// Клиентская часть должна включать в себя элементы для взаимодействия с пользователем (не знающем джейсона и правил для формирования документов!
//  Т.е. предлагать пользователю что-то наподобие "Введите пары ключ:значение через запятую" нельзя). 
// Для реализации серверной части предлагается использовать PHP или NodeJS.

var app = require('express')();
var http = require('http').Server(app);
const jsonParser = require('express').json();
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/";

const db_name = "itehIDZ";
const col_name = "Records";
app.use(require('express').static(__dirname + '/public')); // указание каталога для статических ресурсов, в котором будет расположен подключаемый файл css.

app.post("/insert-record", jsonParser, function (request, response) {
  const mongoClient = new MongoClient(url, { useNewUrlParser: true });  
  console.log(request.body);
    if(!request.body) return response.sendStatus(400);
     
    // response.json(request.body); // отправляем пришедший ответ обратно
    mongoClient.connect(function(err, client){
      
      const db = client.db(db_name);
      const collection = db.collection(col_name);
      let record = request.body;
      collection.insertOne(record, function(err, result){
            
          if(err){ 
              return console.log(err);
          }
          console.log(result.ops);
          client.close();
      });
    });
    response.json({'success':'Запрос прошел успешно!'});
});

app.get("/get-records", function (request, response) {
   const mongoClient = new MongoClient(url, { useNewUrlParser: true });
    mongoClient.connect(function(err, client){     
    const db = client.db(db_name);
    const collection = db.collection(col_name);
    let search_req = request.query;
    console.log("search query: " + search_req);
    collection.find(search_req, {projection:{ _id: 0 }}).toArray(function(err, result){
      if(err){ 
        return console.log(err);
      }
      // console.log(result);
      response.json({'result':result});
      client.close();
    },
    );
  });
});

app.post("/update-records", jsonParser, function (request, response) {
  const mongoClient = new MongoClient(url, { useNewUrlParser: true });  
  console.log(request.body);
    if(!request.body) return response.sendStatus(400);
     
    // response.json(request.body); // отправляем пришедший ответ обратно
    mongoClient.connect(function(err, client){
      
      const db = client.db(db_name);
      const collection = db.collection(col_name);
      let search_by = request.body.find;
      let set = {$set : request.body.set};
      console.log(search_by);
      console.log(set);
      collection.update(search_by, set ,function(err, result){
            
          if(err){ 
              return console.log(err);
          }
          console.log(result.ops);
          client.close();
      });
    });
    response.json({'success':'Запрос прошел успешно!'});
});

app.get("/delete-records", function (request, response) {
  const mongoClient = new MongoClient(url, { useNewUrlParser: true });
   mongoClient.connect(function(err, client){     
   const db = client.db(db_name);
   const collection = db.collection(col_name);
   let search_req = request.query;
  //  console.log("search query: " + search_req);
   collection.deleteOne(search_req, function(err, result){
     if(err){ 
       return console.log(err);
     }
    //  console.log(result);
     
     client.close();
   },
   );
 });
 response.json({'success':'Запрос прошел усспешно!'});
});

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});


http.listen(3000, function() {
  console.log('listening on *:3000');
});