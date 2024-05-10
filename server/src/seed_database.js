const mock_data = require("./seed.json");
const mongoose = require("mongoose");

const seedDatabase = ()=> {
   return mock_data.map(item => {
       return {...item, id: new mongoose.Types.ObjectId()}
   })
}


module.exports = seedDatabase;