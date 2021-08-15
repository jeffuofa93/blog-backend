const Blog = require("../models/blog");
const User = require("../models/user");

const initialBlogs = [
  {
    id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Eduardo G. Herra",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 4,
  },
  {
    id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
  },
];

const initialUsers = [
  {
    blogs: [],
    username: "laylaWorm",
    name: "Layla Wirtjes",
    password: "juicebox1",
  },
  {
    blogs: [],
    username: "jefuofa93",
    name: "Jeff Wiederkehr",
    password: "steelers1",
  },
];

const nonExistingId = async () => {
  const blog = new Blog({
    title: "willremovesoon",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  });
  await blog.save();
  await blog.remove();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  initialUsers,
  usersInDb,
};
