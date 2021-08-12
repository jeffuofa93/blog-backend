const supertest = require("supertest");
const mongoose = require("mongoose");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);

const Blog = require("../models/blog");

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

test("notes are returned as json", async () => {
  console.log("entered test");
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("id property is converted from _id", async () => {
  const blogs = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);

  blogs.body.forEach((blog) => {
    expect(blog.id).toBeDefined();
  });
});

test("a valid blog can be added ", async () => {
  const newBlog = {
    title: "async/await simplifies making async calls",
    author: "Jeffrey F. Wiederkehr",
    url: "http://testingisfun.com",
    likes: 10,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
  const titles = blogsAtEnd.map((blog) => blog.title);
  expect(titles).toContain("async/await simplifies making async calls");
});

test("a blog added without likes defaults to 0", async () => {
  const newBlog = {
    title: "0 likes works",
    author: "Jeffrey F. Wiederkehr",
    url: "http://testingisfun.com",
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  const addedBlog = blogsAtEnd[blogsAtEnd.length - 1];
  expect(addedBlog.likes).toBe(0);
});

test("blog added without title and url return code 400", async () => {
  const newBlog = {
    author: "Jeffrey F. Wiederkehr",
    likes: 12,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(400)
    .expect("Content-Type", /application\/json/);
});

afterAll(() => {
  mongoose.connection.close();
});
