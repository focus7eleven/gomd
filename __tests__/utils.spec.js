const expect = require('chai').expect

describe('passcode validator', () => {
	const regx = /^((?=.*[a-zA-Z])(?=.*[0-9])|(?=.*[0-9])(?=.*[@#$%&\/=?_.,:;\\-])|(?=.*[a-zA-Z])(?=.*[@#$%&\/=?_.,:;\\-])|(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[@#$%&\/=?_.,:;\\-])).{6,32}$/

	it(" contains at least two of 1 Alphabet, 1 Number and 1 Special Character", () => {
		expect(regx.test("aa$aaa"), "aa$aa1aa").to.equal(true)
		expect(regx.test("aa1aaa"), "aa1aaa").to.equal(true)
		expect(regx.test("1@1111"), "1@1111").to.equal(true)
		expect(regx.test("1@1111aaa"), "1@1111aaa").to.equal(true)
		expect(regx.test("aaaaaaa"), "aaaaaaa").to.equal(false)
		expect(regx.test("11111111"), "11111111").to.equal(false)
		expect(regx.test("@@@@@@@@@"), "@@@@@@@@@").to.equal(false)
	})

	it(" contains 6 to 32 characters", () => {
		expect(regx.test("12345a", "12345a")).to.equal(true)
		expect(regx.test("1234a", "1234a")).to.equal(false)

		var test = ""
		for (var i = 31 - 1; i >= 0; i--) test += "a"
		expect(regx.test(test + "1", test + "1")).to.equal(true)
		expect(regx.test(test + "a1", test + "a1")).to.equal(false)
	})
})

describe('idCard validator', () => {
	const regx = /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/

	it(" contains 15 or 18 characters", () => {
		expect(regx.test("123456789012345", "fifteen")).to.equal(true)
		expect(regx.test("123456789012345678", "eighteen")).to.equal(true)
		expect(regx.test("12345678901234567", "seventeen")).to.equal(false)
		expect(regx.test("1234567890123456789", "nineteen")).to.equal(false)
		expect(regx.test("12345678901234", "fourteen")).to.equal(false)
		expect(regx.test("1234567890123456", "sixteen")).to.equal(false)
	})

	it(" can hold an x or X at the end of an 18 bit id card", () => {
		expect(regx.test("12345678901234567x", "eighteen with x")).to.equal(true)
		expect(regx.test("12345678901234567X", "eighteen with X")).to.equal(true)
		expect(regx.test("12345678901234567y", "eighteen with y")).to.equal(false)
	})
})
