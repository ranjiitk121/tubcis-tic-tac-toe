const mongoose = require('mongoose');

mongoose
  .connect(
    'mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: true,
    }
  )
  .then((result) => {
    app.listen(PORT, () => {
      console.log('Wr are running on poRt : ' + PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
mongoose.connect('', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
