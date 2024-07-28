const User = require("../models/user");

// Custom validation functions
const validateEmail = (email) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

const validateName = (name) => {
  return name && name.length >= 3;
};

const validateMobile = (mobile) => {
  const re = /^[0-9]{10}$/;
  return re.test(mobile);
};

exports.createUser = async (req, res) => {
  const { email, name, mobile } = req.body;

  // Validate user input
  if (!validateEmail(email)) {
    return res.status(400).send({ error: "Invalid email format" });
  }

  if (!validateName(name)) {
    return res
      .status(400)
      .send({ error: "Name must be at least 3 characters long" });
  }

  if (!validateMobile(mobile)) {
    return res.status(400).send({ error: "Mobile number must be 10 digits" });
  }

  const newUser = new User(req.body);
  try {
    await newUser.save();
    const token = await newUser.generateAuthToken();
    res.status(201).send({ newUser, token });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

//Bonus
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send({ error: "Unable to login" });
  }
};

exports.logoutUser = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
};
