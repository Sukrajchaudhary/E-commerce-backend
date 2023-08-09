const express = require("express");
const server = express();
const mongoose = require("mongoose");
const passport = require("passport");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const cockieParser = require("cookie-parser");
const ExtractJwt = require("passport-jwt").ExtractJwt;
const productRouter = require("./routes/Product");
const categoriesRouter = require("./routes/Category");
const brandRouter = require("./routes/Brands");
const userRouter = require("./routes/User");
const authRouter = require("./routes/Auth");
const cartRouter = require("./routes/Cart");
const orderRouter = require("./routes/Orders");
const cors = require("cors");
const { User } = require("./model/User");
const { isAuth, sanitizer, cookieExtractor } = require("./services/common");

const SECRETKEY = "SECRETKEY";
// jwt options
// cocies extractor

const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = SECRETKEY;
//middleware
server.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);
server.use(express.static("build"));
server.use(cors());
server.use(cockieParser());
server.use(passport.initialize());
server.use(passport.session());
server.use(express.json());
// tp parse req.body
const connectTodb = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/E-commerce-Backend");
    console.log("Database connected Successfully:");
  } catch (error) {
    handleError(error);
  }
};

const PORT = 800;
server.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
  })
);

server.use("/products", isAuth(), productRouter.router);
server.use("/categeory", isAuth(), categoriesRouter.router);
server.use("/brans", isAuth(), brandRouter.router);
server.use("/users", isAuth(), userRouter.router);
server.use("/auth", authRouter.router);
server.use("/cart", isAuth(), cartRouter.router);
server.use("/orders", isAuth(), orderRouter.router);
// passport strategies
// Local strategy for username/password authentication

passport.use(
  "local",
  new LocalStrategy({ usernameField: "email" }, async function (
    email,
    password,
    done
  ) {
    try {
      const user = await User.findOne({ email: email });
      console.log(email, password);
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        "sha256",
        async function (err, hashedPassword) {
          if (err) {
            return done(err);
          }
          if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
            return done(null, false, { message: "Invalid Credentials:" });
          }
          const token = jwt.sign(sanitizer(user), SECRETKEY);

          return done(null, { token });
        }
      );
    } catch (error) {
      return done(error);
    }
  })
);

passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    console.log(jwt_payload.id);
    try {
      const user = await User.findOne({_id:jwt_payload.id});
      if (user) {
        return done(null, sanitizer(user));
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

//this creates session variable req.user when called from authrizedd
passport.serializeUser(function (user, cb) {
  console.log("serialize", user);
  process.nextTick(function () {
    return cb(null, {
      id: user.id,
      role: user.role,
    });
  });
});

passport.deserializeUser(function (user, cb) {
  console.log("deserialize", user);
  process.nextTick(async function () {
    try {
      const foundUser = await User.findById(user.id);
      if (!foundUser) {
        return cb(null, false, { message: "User Not found:" });
      }
      return cb(null, sanitizer(foundUser));
    } catch (error) {
      return cb(error);
    }
  });
});

connectTodb();

server.listen(PORT, () => {
  console.log("Server is running on port 800");
});
