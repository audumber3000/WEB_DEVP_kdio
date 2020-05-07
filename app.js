var express               = require("express"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    User                  = require("./models/user"),
	
    LocalStrategy         = require("passport-local"),
	methodOverride  = require("method-override"),
    passportLocalMongoose = require("passport-local-mongoose");

var flash = require("connect-flash");



    
mongoose.connect("mongodb+srv://audumber:Ramdas3000@cluster0-bj3vd.mongodb.net/test?retryWrites=true&w=majority");


var app = express();
app.use(methodOverride("_method"));//using method-override + what to look for in url *the parentheses as above*

app.use(flash())
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true})); //required for forms that post data via request
app.use(require("express-session")({ //require inline exp session
    secret: "be rich forever", //used to encode and decode data during session (it's encrypted)
    resave: false,          // required
    saveUninitialized: false   //required
}));

app.use(express.static("public"));
// code to set up passport to work in our app -> THESE TWO METHODS/LINES ARE REQUIRED EVERY TIME
app.use(passport.initialize());
app.use(passport.session());

//plugins from passportlocalmongoose in user.js file
passport.use(new LocalStrategy(User.authenticate())); //creating new local strategy with user authenticate from passport-local-mongoose
passport.serializeUser(User.serializeUser()); //responsible for encoding it, serializing data and putting it back into session
passport.deserializeUser(User.deserializeUser()); //responsible for reading session, taking data from session that is encoded and unencoding it

//=======================================================================================================
//ROUTES
//=======================================================================================================


app.get("/", function(req, res){
    res.render("home");
});

app.get("/secret", isLoggedIn, function(req, res){
    res.render("secret");
});

//=======================================================================================================
// AUTHENTICATION ROUTES
//=======================================================================================================

//show sign up form
app.get("/register", function(req, res){
    res.render("register",{error:req.flash("error_msg")});
});

//handling user sign up
app.post("/register", function(req, res){
    req.body.username;
    req.body.password;
	req.body.MilkID; 
	req.body.Name;
	
	//req.body.Milkqt;
	var snf = "null";
	var deg = "null";
	var pro = "null";
	var today = new Date();
    var date = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
	
	var Milkqt="nulll"
	
	console.log(Milkqt)
    User.register(new User({username: req.body.username  , name:req.body.Name , Milkid: req.body.MilkID , Milkqt:Milkqt , deg:deg,snf:snf , pro:pro , Date:dateTime }), req.body.password, function (err, user){ //create new user object (only username is passed b/c password is not saved to database). we pass password as 2nd argument to User.register -> takes new user -> hash password (encrypts, store in database) -> it will return a new user that has everything inside of it (object)
        if(err) {
            console.log(err);
			req.flash("error_msg","User with given username is already register!");
            res.redirect("/register");
        } 
		
		passport.authenticate("local")(req, res, function(){ //logs the user in and takes care of everything in session and runs serializeuser method
			req.flash("success_msg","Congratulations! you have successfully Signed Up")
            res.redirect("/login");
        });
    });
	
	
});

// LOGIN ROUTES

//render login form
app.get("/login", function(req, res){
    res.render("login" ,{success:req.flash("success_msg"),error:req.flash("error_msg")});
});

//login logic
app.post("/login", passport.authenticate("local",{ //used inside app.post as (middleware - code that runs before final callback)
        successRedirect: "/clint",
        failureRedirect: "/login",
	
    }), function(err,req, res){
	
	
});

app.get("/logout", function(req, res){
    // res.send("TESTING");
    req.logout(); //logs them out via passport
    res.redirect("/");
});






//-----------------------------------------------------------------------------------dailymilk

app.get("/clint", isLoggedIn, function(req,res){
	
	console.log(req.user.username);
	res.render("confirm",{success:"Congratulations! you have successfully Logged In", error:req.flash("error_msg")} );
});


app.post("/dailymilk",function(req,res){
	var Milkid1 = req.body.MilkID1
	var veryid = req.user.Milkid
	var usernaam = req.user.username
	
	if(usernaam==="kdfarms"){
		res.redirect("/update")
		
	}
	if(Milkid1===veryid){
    User.find({Milkid:Milkid1} , function(err,users){
		if(err){
			console.log("ohh!! no somting went wrong.")
			res.render("confirm",{error:"OOPS!! You entered Incorrect MilkID"});
		}else{
			console.log("everything went fine")
			res.render("clint",{users:users , success:"Congratulations! you have your report."});
			console.log(users);
		}
	
	})
}
	else{
		console.log("id wronge");
		req.flash("error_msg","OOh!! It seems like you forgot your MilkID :(")
		res.redirect("/clint");
	}
});

//------------------------------------------------------------------update

app.get("/update",isLoggedIn,function(req,res){
	res.render("adminpanel")
});

app.post("/update",isLoggedIn,function(req,res){
	var milkid2 = req.body.milkid2
	var deg = req.body.deg;
	var snf = req.body.snf;
	var pro = req.body.pro;
	var Milkqt=req.body.Milkqt;
	
	
	var today = new Date();
    var date = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
	
	
	var data ={deg:deg , snf:snf , pro:pro , Date:dateTime , Milkqt:Milkqt};
	
	
	
	var cond = {Milkid:milkid2}
   
User.updateMany( cond ,{deg:deg , snf:snf , pro:pro , Milkqt:Milkqt, Date:dateTime }, function(err,users){
	if(err){
		console.log("smthing went wrong!!!")
	}
	
	res.redirect("/update")
});
	



});
//---------------------------------------------------------------------list in detail for adminpanel

app.get("/list" ,isLoggedIn, function(req,res){
	
	
		User.find({} , function(err,users){
		if(err){
			console.log("ohh!! no somting went wrong.")
		}else{
			console.log("everything went fine")
			res.render("list",{users:users});
			
		}
	});
});
	
	
	
//-------------------------------------------------------------------------------------------


function isLoggedIn(req, res, next) { //next is the next thing that needs to be called.
    if (req.isAuthenticated()){
        return next();
    }
	req.flash("error_msg","OOPS!! Entered crediantials are Incorrect!")
    res.redirect("/login");
}


//---------------------------------------------------------------------------------------------aboutus
app.get("/aboutus",function(req,res){
	res.render("about")
})

//---------------------------------------------------------------------------------------------terms and condition
app.get("/terms",function(req,res){
	res.render("terms");
})

//------------------------------------------------------------------------------------------------livestock
app.get("/livestock",function(req,res){
	res.render("livestock")
})

app.get("/livestock/sell",function(req,res){ 
	res.render("sell")
})
app.get("/story",function(req,res){
	res.render("story");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server started...")
});
		   
		   
		   
		   