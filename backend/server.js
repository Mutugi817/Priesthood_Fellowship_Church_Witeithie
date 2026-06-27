import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';

// App initialization
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use('trust proxy', true);
app.use(cors());
app.use(helmet())

// Logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.get('/', function(req, res) {
    res.send('Church API');
    res.end();
})

app.listen(PORT, function() {
    console.log(`Server started at http://localhost:${PORT}`);
})