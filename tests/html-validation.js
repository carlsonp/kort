'use strict'

const tap = require('tap')
const validator = require('html-validator')
//var options = {
  //format: 'text'
//}
////test via HTML validator
//var js = this.evaluate(function() {
	//return document;
//});
//options.data = js.all[0].outerHTML; //get all HTML
//validator(options, (error, data) => {
	//if (error) {
	  //console.error(error);
	  //casper.test.error("HTML validator login page failed: " + error);
	//} else {
	  //casper.test.pass("HTML validator login page passed.");
	//}
//});
//res = validator(options);
//console.log(res);



tap.test('Check login page HTML', function (test) {
	const options = {
	  url: 'http://127.0.0.2:3000',
	  format: 'text'
	}
	console.log(options)
  validator(options, function (error, data) {
    if (error) {
      tap.fail("Error in html")
    }
    var errors = 0
    data.messages.forEach(function (msg) {
      if (msg.type === 'error') {
        errors++
      }
    })

    tap.equal(errors, 0, 'html is valid')

    test.done()
  })
})
