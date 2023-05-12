const Contact = require("../models/contact");

const getAll = async (req, res, next) => {
  try {
    const result = await Contact.find();

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (contact) {
      return res.status(200).json(contact);
    }

    res.status(404).json({ message: "Not found" });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const contact = await Contact.create(req.body);

    res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await Contact.findByIdAndRemove(req.params.id);

    if (result) {
      return res.status(200).json({ message: "contact deleted" });
    }

    res.status(404).json({ message: "Not found" });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (contact) {
      return res.status(200).json(contact);
    }

    res.status(404).json({ message: "Not found" });
  } catch (error) {
    next(error);
  }
};

const updateStatusContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (contact) {
      return res.status(200).json(contact);
    }

    res.status(404).json({ message: "Not found" });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getAll,
  getById,
  create,
  remove,
  update,
  updateStatusContact,
};
