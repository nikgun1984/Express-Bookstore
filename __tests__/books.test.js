const request = require("supertest");

const app = require("../app");
const db = require("../db");
const Book = require("../models/book");
console.log("I am in HERE");
describe("Book Routes Test", function () {
	let book;
	beforeEach(async function () {
		await db.query("DELETE FROM books");

		book = await Book.create({
			isbn: "978-0-9847828-5-7",
			amazon_url:
				"https://www.amazon.com/Cracking-Coding-Interview-Programming-Questions/dp/0984782850/ref=sr_1_1?crid=1410JQUNDY8PA&dchild=1&keywords=cracking+the+coding+interview&qid=1611592305&sprefix=cracking+%2Caps%2C192&sr=8-1",
			author: "Gayle Laakmann Mcdowell",
			language: "english",
			pages: 687,
			publisher: "CareerCup; 6th edition",
			title: "Cracking the Coding Interview",
			year: 2016,
		});
	});

	afterAll(async () => {
		//close db connection
		await db.end();
	});

	describe("GET /", function () {
		test("return all books", async function () {
			let response = await request(app).get(`/books/`);
			expect(response.statusCode).toEqual(200);
			expect(response.body).toEqual({ books: [book] });
		});
	});

	describe("GET /:isbn", function () {
		test("return one book", async function () {
			let response = await request(app).get(`/books/978-0-9847828-5-7`);
			expect(response.statusCode).toEqual(200);
			expect(response.body).toEqual({ book });
		});
	});

	describe("POST /", function () {
		test("create a book/PASS Test", async function () {
			let response = await request(app).post(`/books/`).send({
				isbn: "IS1234567",
				amazon_url: "https://amazon.com/heal_or_not_heal",
				author: "DAniel Cruz",
				language: "english",
				pages: 432,
				publisher: "Publisher",
				title: "How to heal my Soul",
				year: 2021,
			});
			expect(response.statusCode).toEqual(201);
			expect(response.body).toEqual({
				book: {
					isbn: "IS1234567",
					amazon_url: "https://amazon.com/heal_or_not_heal",
					author: "DAniel Cruz",
					language: "english",
					pages: 432,
					publisher: "Publisher",
					title: "How to heal my Soul",
					year: 2021,
				},
			});
		});
		test("create a book/Fail Test", async function () {
			let response = await request(app).post(`/books/`).send({
				isbn: "IS1234567",
				amazon_url: "https://amazon.com/heal_or_not_heal",
				author: "DAniel Cruz",
				language: "english",
				pages: "432",
				publisher: "Publisher",
				title: "How to heal my Soul",
				year: 2021,
			});
			expect(response.statusCode).toEqual(400);
			expect(response.body.message).toEqual([
				"instance.pages is not of a type(s) number",
			]);
		});
	});

	describe("PUT /:isbn", function () {
		test("update a book/PASS Test", async function () {
			let response = await request(app).put(`/books/978-0-9847828-5-7`).send({
				amazon_url: "https://amazon.com/heal_or_not_heal",
				author: "DAniel Cruz",
				language: "spanish",
				pages: 432,
				publisher: "New Publisher- Edition 2",
				title: "How to heal my Soul",
				year: 2023,
			});
			expect(response.statusCode).toEqual(200);
			expect(response.body).toEqual({
				book: {
					isbn: "978-0-9847828-5-7",
					amazon_url: "https://amazon.com/heal_or_not_heal",
					author: "DAniel Cruz",
					language: "spanish",
					pages: 432,
					publisher: "New Publisher- Edition 2",
					title: "How to heal my Soul",
					year: 2023,
				},
			});
		});
	});

	describe("DELETE /:isbn", function () {
		test("delete a book", async function () {
			let response = await request(app).delete(`/books/978-0-9847828-5-7`);
			expect(response.statusCode).toEqual(200);
			expect(response.body).toEqual({ message: "Book deleted" });
		});
	});
});
