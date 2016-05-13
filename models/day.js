var Sequelize = require('sequelize');
var db = require('./_db');

// var Hotel = db.define('hotel', {
//   name: Sequelize.STRING,
//   num_stars: {
//     type: Sequelize.INTEGER,
//     validate: { min: 1, max: 5 }
//   },
//   amenities: Sequelize.STRING
// });

var Day = db.define('day', {
    day: {
        type: Sequelize.INTEGER,
    },

}, {
    classMethods: {
        //takes a day num and for all rows in Day model with day > dayNum, decrements the day num by 1
        updateDays: function(dayNum) {

            return this.findAll({
                    where: {
                        day: { $gt: dayNum }
                    }
                })
                .then(function(results) {
                    
                    var resultMap = results.map(function(dayRow) {
                        return  dayRow.decrementDay();
                    });

                    return Promise.all(resultMap);
                })
                .then(function(updateDayRows){

                    return updateDayRows;

                })
                .catch();


        }
    },

    instanceMethods: {
        decrementDay: function() {
            this.setDataValue('day', this.getDataValue('day') - 1)
            return this.save();
        }
    }
});



module.exports = Day;
