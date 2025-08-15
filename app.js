import express from 'express';
const app = express();

import { authRoutes } from './routers/authRoutes.js';
import cookieParser from 'cookie-parser';
import { countryAppRoutes } from './routers/countryAppRoutes.js';
import { profileRouter } from './routers/profileRoutes.js';
import { verifyAuthentication } from './middleware/verifyMiddleware.js';


import { connectDB } from './DB-Connection.js';
connectDB(); /// for connect db to mongodb 

app.set('view engine', 'ejs');  // define temple engine
app.use(express.static("public")); // public folder access from all pages 
app.use(express.urlencoded());
app.use(express.json()); // for receive frontend json data 



app.get('/', (req, res) => {
    res.render("index");
});

app.use(cookieParser());   // This middleWare is use for manege cookies // and we have to use it before those roots which we use 

app.use(verifyAuthentication);

app.use(authRoutes);      // '/register', '/login' routers are control from this route
app.use(countryAppRoutes);
app.use('/profile', profileRouter);


app.use((req, res) => {
    res.render('4O4')
});









const PORT = 3014;
app.listen(PORT, () => {
    console.log(`server : http://localhost:${PORT}/`);
});






////////////// ⭐ steps : in this project ⭐ /////////////////

/*
1s :   create express app 
       routes : '/' home 

s2 :   create routes authRoutes : '/register' , '/login' 
s3 :   create routes controller : 'getRegisterPage' , 'getLoginPage, postLogin' 
s4 :   in postLogin set cookies redirect to login page 
s5 :   create routes authRoutes : '/countryapp' 
s6 :   create routes controller : 'countryappController' 
s7 :   countryappController : check condition based on cookies 
            if cookie == true : send countryApp  else : redirect to login page 

s8 :   create '/login/isUserLogin (get) in routes 
       create route controller isUserLoginResponse
            depending on cookie 
                if cookie == true give res as : {userLoginOrNot: true } else : {userLoginOrNot: false }
            
s9  :   In naveBar include profile section 
            and give a get request to /login/isUserLogin routes
                    receive userLoginOrNot: true / false
                        depending on hide or show the user profile 

s10 :   DB connection : 
        i)   create .env file 
        ii)  npm i dotenv 
        iii) DB-Connection.js : this file connect db in side a fun and export it 
        iv)  receive it in app.js and call this function 
s11 :   create user schema 
        i) we already connect db 
    in model/userSchema file : 
        ii) import mongoose and create user model

s12 :   app.use(express.urlEncoded)  in app.js 

s8 :   create '/register (post) in routes 
       create route controller postRegister
            depending on user model  
                check user email is already exists or not 
                    if not present : insert req.body data in user model by (userModel.create(userData)) 
                    else : send false response to frontend 

s8.1: in app.js add : app.use(express.json()); 
        to accept json data from frontend;

s8.2:   In register page : 
            form submit reload off
            give a post request to '/register'
                send form data as json formate .
                    if backend response.success is true : 
                        redirect to '/login'
                    else : alert : "user exist ..."

S9 :   iN SAME WAY DO FOR LOGIN PAGE 

S00 :  Now hash the user password and store it in DB
            using package : npm i bcrypt
                to hash password we use : await bcrypt.hash(password, 10);  [where 10 is the salt value]  store this hash PW in DB
                to compare user password store in db we use : await bcrypt.compare(userEnteredPW, hashPWInDB); it will automatically compare each of them 
    BUT WE CAN'T USE IT IN OUR PROJECT WE USE : argon2  

S10 :   9 We use argon2 for password hashing : 
            npm i argon2;
                in side register(post) : after chalking user existence 
                    save user enter PW with hash in DB : 
                       hashPW = await argon2.hash(password);

                in side login(post) : after chalking user existence 
                    check user entered PW == DB PW
                       like : const check = await argon2.verify(DBHashedPW, userEnteredPW);
                          if(check): login , else : not

s11: JWT instead of session base token :
        npm i jsonwebtoken 
            inside login (post) : 
                if userEnteredPW == DBPw 
                    create an token using JWT :
                        like : token = jwt.sign({userName, userEmail...}, SecretKey, {expiresIn: "10d"})
                                                        👆 payload where user details give          
                        jwt.sign(Headers, Payload, Signature)    Headers will automatic set

s11.2 : Verify this token : instead of Boolean(req.cookies.isLogin);
        using a middleware called verifyAuthentication from 'middleware/verifyAuth...js'
        we use it in app.js: app.use(verifyAuthentication)
            FOR EVERY ROUTE ACCESS THIS WILL RUN :
                verifyAuthentication(req, res, nest) => { // 3 parameter are use where 
                    const token = req.cookies.accessToken;
                    if token : 
                        decode cookies token like : - 
                        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
                            and set it in req.user   whish is called custom property : 
                }
            And use it for check cookies instead of isLogin == true (in countryApp routes or more )

S12 :  Protect routes : profile (get)
            if req.user : present : then show user using req.user custom obj 
            else : redirect to /login 

S13 :  create Protect routes : 
            using : req.user value : 
                if(req.user){
                    res.render("this page");
                }else{
                    res.redirect('/login);
                }

S14 :  create logout option : 
            add a route '/logout' controller logoutUser : res.clearCookie('accessToken);
            cookies deleted and user logout 




*/









































