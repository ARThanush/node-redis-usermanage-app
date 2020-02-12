const express= require('express');
const exphbs= require('express-handlebars');
const path = require('path');
const bodyparser=require('body-parser');
const methodoverride=require('method-override');
const redis =require('redis');

//create radis clint
let client = redis.createClient();
client.on('connect',function(){
    console.log('connected to Redis...')
});

//set port
const port= 3000;

//init app
const app=express();



//view engine
app.engine('handlebars',exphbs({defaultLayout:'main'}));
app.set('view engine','handlebars');


//body parser
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}))


//method Override

app.use(methodoverride('_method'));

app.get('/',function(req,res,next){
    res.render('searchusers');
});

//search processing
app.post('/user/search', function(req,res,next){
    let id = req.body.id;

    client.hgetall(id,function(err,obj){
        if(!obj){
            res.render('searchusers',{
                error:'user does not exit'
            });

        }else{
            obj.id=id;
            res.render('details',{
                user:obj
            });

        }

    });
});

//add user page
app.get('/user/add',function(req,res,next){
    res.render('adduser')
})
//process add user page
app.post('/user/add',function(req,res,next){
    let id = req.body.id;
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email;
    let phone = req.body.phone;


    client.hmset(id,[
        'first_name',first_name,
        'last_name',last_name,
        'email',email,
        'phone',phone
    ],function(err,reply){
        if(err){
            consol.log(err);
        }
        console.log(reply)
        res.redirect('/')
    });
})
//delete user
app.delete('/user/delete/:id',function(req,res,next){
    client.del(req.params.id);
    res.redirect('/');
});

app.listen(port,function(){
    console.log('view port'+port);
})
