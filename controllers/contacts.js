const contacts = require("../models/contacts");

const getAll = async (req, res, next) => {
  try {
    const result = await contacts.listContacts();

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const contact = await contacts.getContactById(req.params.id);

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
    const contact = await contacts.addContact(req.body);

    res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await contacts.removeContact(req.params.id);

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
    const contact = await contacts.updateContact(req.params.id, req.body);

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
    update
};
