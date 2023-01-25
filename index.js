//import express inside index.js
const express =require('express')

//import cors in index.js
const cors=require('cors')

//import dataService
const dataService = require('./services/dataService')

//import jsonwebtoken
const jwt = require('jsonwebtoken')

//create server app using express 
const server = express()

//use cors to define origin
server.use(cors({
    origin:'http://localhost:4200'
})
)

//to parse json data
server.use(express.json())

//set up port for server app
server.listen(3000,()=>{
    console.log('server started at 3000');
})
// //get http api request
// server.get('/',(req,res)=>{
//     res.send('GET METHOD')
// })
// server.post('/',(req,res)=>{
//     res.send('POST METHOD')
// })
// server.put('/',(req,res)=>{
//     res.send('PUT METHOD')
// })
// server.delete('/',(req,res)=>{
//     res.send('DELETE METHOD')
// })

//application specific middleware
const appMiddleware = (req,res,next)=>{
    console.log("inside application specific middleware");
    next()
}
server.use(appMiddleware)

//bankapp front end request resolving

//token verify middleware
const jwtMiddleware =(req,res,next)=>{
    console.log("inside router specific middleware");
    //get token from request headers
    const token = req.headers['access-token']
    console.log(token);
  try{
     //verify the token
     const data= jwt.verify(token,'secret123456key')
     console.log(data);

     //currentAcno=fromAcno
     req.fromAcno = data.currentAcno
     console.log('valid token');
     // console.log(data);
     next()
  }
  catch{
console.log('Invalid account');
res.status(401).json({
    message:'Please Login'
})
  }
}

//register api call resolving
server.post('/register', (req,res)=>{
console.log('inside register Api');
console.log(req.body);
dataService.register(req.body.uname,req.body.acno,req.body.pswd)
.then((result)=>{

    res.status(result.statusCode).json(result)
})

})

//login api call resolving

server.post('/login', (req,res)=>{
    console.log(' Inside login Api');
    console.log(req.body);
    dataService.login(req.body.acno,req.body.pswd)
    .then((result)=>{
    
        res.status(result.statusCode).json(result)
    })
    
    })

    //get balance api

    server.get('/getBalance/:acno',jwtMiddleware, (req,res)=>{
        console.log(' Inside getBalance Api');
        console.log(req.params.acno);
        dataService.getBalance(req.params.acno)
        .then((result)=>{
        
            res.status(result.statusCode).json(result)
        })
        
        })

         //deposit api

    server.post('/deposit',jwtMiddleware, (req,res)=>{
        console.log(' Inside deposit Api');
        console.log(req.body);
        dataService.deposit(req.body.acno,req.body.amount)
        .then((result)=>{
        
            res.status(result.statusCode).json(result)
        })
        
        })

          //fund transfer api

    server.post('/fundTransfer',jwtMiddleware, (req,res)=>{
        console.log(' Inside fundtransfer Api');
        console.log(req.body);
        dataService.fundTransfer(req,req.body.toAcno,req.body.pswd,req.body.amount)
        .then((result)=>{
        
            res.status(result.statusCode).json(result)
        })
        
        })

        //getAllTransactions
        server.get('/all-transactions', jwtMiddleware,(req,res)=>{
            console.log('Inside getAllTransactions api');
            dataService.getAllTransactions(req)
            .then((result)=>{
                res.status(result.statusCode).json(result)
            })
        })

        //delete account api
        server.delete('/delete-account/:acno',jwtMiddleware, (req,res)=>{
            console.log(' Inside delete-account Api');
            console.log(req.params.acno);
            dataService.deleteMyAccount(req.params.acno)
            .then((result)=>{
            
                res.status(result.statusCode).json(result)
            })
            
            })

      