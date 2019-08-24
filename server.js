const http=require('http');
const express=require('express');
const mongoose=require('mongoose');
const app=express();
var session=require('express-session')
const port=Number(process.env.PORT || 3001);
const path=require('path');
const bodyParser=require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

var url="mongodb://pavan:pavan786@ds123645.mlab.com:23645/test1";
var sess=null;
mongoose.connect(url,function(err){
	if(err)
		throw err;
	console.log("Connected");
});

app.use(
	session({
		secret:"aaaa",
		saveUninitialized: true,
		resave:true
	})
)

/*
	GET	    Read
	POST	Create
	PUT	    Update
	DELETE	Delete
*/

var userSchema=new mongoose.Schema({
	fname:String,
	email:String,
	password:String
})
var userModel=mongoose.model("userData",userSchema)

//static fie declaration
//app.use(express.static(path.join(__dirname,'client/build')));
app.use(express.static(path.join(__dirname,'client/public/index.html')));

//production mode start
if(process.env.NODE_ENV==='production')
{
	console.log("INSIDE PRODUCTION")
	app.use(express.static('client/build'));
	app.get('/api',(req,res)=>{
		var count;
		mongoose.connect(url,function(err,db){
			if(err) throw err;
			db.collection('collectionTest1').find({_id:"003"}).toArray(function(err,docs){
				if(err) throw err;
				res.json(docs);
			})
		})

	})
	// app.get("/serverLogin",function(req,res){
	// 	if(sess)
	// 	{
	// 		res.send(sess.uname);
	// 	}
	// 	else {
	// 		res.send("");
	// 	}
	// })
	app.post("/inc",function(req,res){
		var count;
		mongoose.connect(url,function(err,db){
			if(err) throw err;
			db.collection('collectionTest1').find({_id:"003"}).toArray(function(err,docs){
				if(err) throw err;
				count=docs[0].count;
				intCount=parseInt(req.body.count)+1
				db.collection('collectionTest1').updateOne({count:count},{$set:{"count":intCount}},function(err,res){
					if(err) throw err;
					console.log("Incremented")
					db.close();
				})
				res.send("Incremented"+" "+JSON.stringify(docs)+" "+count+" "+intCount);
			})
		})
	});
}
//production mode ends

app.post('/serverRegister',function(req,res){
	console.log(req.body)
	mongoose.connect(url,function(err,db){
		if(err)
			throw err;
		db.collection('userData').insertOne(req.body,function(err,res){
			if(err)
				throw err;
			db.close();
		})
		res.send("Inserted");
	})
	/*var data=new userModel(req.body)
	data.save()
	.then(user=>{
		res.send("stored");
	})
	.catch(err=>{
		res.status(400).send("not stored")
	})*/

})
app.get("/countUsers",function(req,res){
    console.log("server Count Users");
	mongoose.connect(url,function(err,db){
		if(err)
			throw err;
		db.collection('userData').find().count()
		.then(function(count){
			console.log("Number of users registered="+count);
			res.send({usersCount:count})
			//res.send(count)
			db.close();
		})
	})
})
app.post('/serverLogin',function(req,res){
    console.log("SERVER LOGIN");
	//console.log(req.body)
	//console.log(req.session.uname)
	//res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	//console.log("sess in login");
	//console.log(sess);

	// if(!sess)
	// {
	// 	res.send("Login to access this page")
	// }
	console.log("BODY");
	console.log(req.body);
	mongoose.connect(url,function(err,db){
		if(err)
			throw err;
		db.collection('users1').find({uname:req.body.uname,password:req.body.password}).toArray(function(er,docs){
			if(err)
				throw err;
				if(docs.length>0)
				{
					sess=req.session;
					sess.uname=req.body.uname;
					console.log(req.session.uname)
					console.log(docs.length)
				}
				
				//else
				// {
				// 	res.send("fail")
				//
				// }
				console.log("isFirstLoggedIn",docs[0].isFirstLoggedIn);
				res.json(docs);
				//res.redirect('/home');
				if(docs[0].isFirstLoggedIn==="false")
				{
					console.log("isFirstLoggedIn --> false");
					db.collection('users1').updateOne({isFirstLoggedIn:"false"},{$set:{"isFirstLoggedIn":"true"}},function(err,res){
						if(err) throw err;
						console.log("set isFirstLoggedIn true");
						db.close();
					})
				}
				db.close();
		})
		
	})
	//res.send("pass")
})
// app.get('/login',function(req,res){
// 	//console.log(sess)
// 	if(sess)
// 		res.send("Logged in")
// 	else
// 		res.send('Login to access this page')
// })

// app.get('/register',function(req,res){
// 	res.send("Access denied. Login to access this page");
// })

app.get('/session',function(req,res){
		console.log("SERVER SESSION");
		if(sess)
		{
			console.log("sess in session");
			console.log(sess);
			res.send(sess.uname);
		}
		else {
			res.send("");
		}
})


//	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
app.get('/serverLogout',function(req,res){
	console.log('logout')
	req.session.destroy();
	sess=null;
	console.log(req.session)
	res.send("pass")
	// req.session.destroy(function(err){
	// 	if(err)
	// 	{
	// 		console.log(err)
	// 		res.send("fail")
	// 	}
	// 	else
	// 	{
	// 		console.log('logout else')
	// 		console.log(req.session)
	// 		res.send("pass")
	// 	}
	// })
})

// app.get('/home',function(req,res){
// 	//res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
// 	console.log("Name: ")
// 	res.send("HOME")
// 	//res.sendFile(__dirname+"/client/public/index.html")
// 	// if(req.session.uname)
// 	// {
// 	// 	console.log(__dirname)
// 	// 	//res.sendFile(__dirname+"/index.html")
// 	// }
// 	// else
// 	// 	res.send("Login to access this page")
// })

app.get("/api",function(req,res){
	var count;
	//console.log(req.body)
	mongoose.connect(url,function(err,db){
		if(err) throw err;
		db.collection('collectionTest1').find({_id:"003"}).toArray(function(err,docs){
			if(err) throw err;
			//count=docs[0].count;
			//console.log(count+1)
			res.json(docs);
			db.close();
		})

	})

});





app.post("/inc",function(req,res){
	var count;
	console.log("Inside inc")
	console.log(req.body)
	//console.log(res.render("App.js"))

	mongoose.connect(url,function(err,db){
		if(err) throw err;
		db.collection('collectionTest1').find({_id:"003"}).toArray(function(err,docs){
			if(err) throw err;
			//res.json(docs);
			count=docs[0].count;
			//console.log(count)
			intCount=parseInt(req.body.count)+1
			db.collection('collectionTest1').updateOne({count:count},{$set:{"count":intCount}},function(err,res){
				if(err) throw err;
				console.log("Incremented")
				db.close();
			})
			res.send("Incremented"+" "+JSON.stringify(docs)+" "+count+" "+intCount);
		})
	})
});

// const server = http.createServer(app);
// server.listen(3001,'192.168.0.103')
//192.168.0.103
app.listen(port,function(){
	console.log("Server started at port "+port)
})
