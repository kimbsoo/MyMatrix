const compression = require("compression");
const cors = require("cors");
const { indexRouter } = require("./src/router/indexRouter");
const { userRouter } = require("./src/router/userRouter");

const express = require("express");
const app = express();
const port = 3000;

/* express 미들웨어 설정 */
app.use(express.static("front"));

// cors 설정
app.use(cors());

// body json 파싱
app.use(express.json());

// HTTP 요청 압축
app.use(compression());


// app.get('/users', function(req,res){
//   return res.send('HHHHHHHHello~~~')
// });

// app.post('/users', function(req,res){
//   const name = req.body.name;
//   return res.send(name);
// });


// 라우터 분리
indexRouter(app);
userRouter(app);

app.listen(port, () => {
  console.log(`Express app listening at port: ${port}`);
});
