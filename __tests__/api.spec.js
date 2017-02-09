const request = require('request').defaults({
	jar: true
})
const expect = require('chai').expect
const config = require('../src/config').default
export const subjectList = () => new Promise((resolve, reject) => {

	request({
		url: config.api.subject.subjectList.get,
		method: "get",
    headers:{
      'from':'nodejs',
      'token':'eyJ0eXBlIjoiSldUIiwiYWxnIjoiSFM1MTIifQ.eyJpc3MiOiJYdWVIdWlMZSBKV1QgQnVpbGRlciIsInVzZXIiOiJ7XCJ1c2VySWRcIjpcIjc0NDYyNDQyNzAzNTY5NDk2NVwiLFwidXNlckNvZGVcIjpcImNhb2xhb3NoaVwiLFwibmlja05hbWVcIjpudWxsLFwicmVhbE5hbWVcIjpcIuabueiAgeW4iFwiLFwiaGVhZFVybFwiOm51bGwsXCJzaWduXCI6bnVsbCxcInBob25lTnVtXCI6bnVsbCxcImVtYWlsXCI6bnVsbCxcInBhc3N3b3JkXCI6XCI5Yzg3OWM2OTk5MjE0MTA4ZDljYjdlZGY4YTVjOWFlZFwiLFwic2FsdFwiOlwiM2RmMjg4YjhhMzllMDIxMzRhYTU4NWJiMGY0NzQ1NTdcIixcInVzZXJTdHlsZVwiOlwiNVwiLFwiYXZhaWxhYmxlXCI6XCIxXCIsXCJsb2NrZWRcIjpcIjBcIixcImFjdGl2ZVwiOm51bGwsXCJjb25maXJtUGFzc3dvcmRcIjpudWxsLFwidmFsaWRhdGVDb2RlXCI6bnVsbCxcInNjaG9vbElkXCI6XCIyMDgzOTcxMzI1OTg3NDMwNDBcIixcIm9wZW5JZFwiOm51bGwsXCJ1c2VyU3R5bGVOYW1lXCI6bnVsbH0ifQ.rVBWnwa0FKzUQ3xCCTj6wcW9V-rFOd-FTEB6rai89vUuU6CGlvwFYfmToMVeef9y6yFbC-ae7XthjYVMU71EYw'
    },
	}, (e, r, b) => {
		resolve(b)
	})
})

describe('api spce', () => {

	it(" subject list", () => {
    return subjectList().then(body => {
      console.log("haha",body)
    })
	})
})
