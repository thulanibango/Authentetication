const express = require('express');
const path = ('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cookieParser =require('cookie-parser')
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');


const errorHandler = require('./middleware/error')
const connectDB = require('./config/db')


//Route files
const customers = require('./routes/customer');
const users = require('./routes/auth');
//load env variable
dotenv.config({path: './config/config.env'});


//Connect to datatbase
// if (process.env.NODE_ENV === 'development') {
//     app.use(morgan('dev'));
// } 
connectDB()

//Loading environment variables
const app = express();

//body Parser
app.use(express.json())

//cookie parser
app.use(cookieParser())

//Sanistising data to prevent SQL injections
app.use(mongoSanitize())

//set security headers ( To security in headers when make a request )
app.use(helmet());

//prevent cross site scipting atacks
app.use(xss())

//set rate limmiter
const limitter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100
})
app.use(limitter);

//Prevent http param pollution
app.use(hpp())

//enable cors
app.use(cors());

//Set static folder
app.use(express.static(path.join(__dirname, 'public/')));

const PORT = process.env.PORT || 5000;

//Mount routers
app.use('/api/v1/customer', customers);
app.use('/api/v1/auth/', users);

app.use(errorHandler);


//Run server connection 
const server = app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`) );

//Handle promise rejections
process.on('unhandledRejection', (err, promise)=>{
    console.log(`Error: ${err.message}`);
    server.close(()=> process.exit(1))
})