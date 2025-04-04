const Motivation = require("../db/MotivationModel");

// Motivasyon alıntısı getir
exports.getMotivation = async (req, res, next) => {
  try {
    // İsteği yavaşlatmak için 3 saniye beklet
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const motivation = await Motivation.getMotivation();
    res.status(200).json(motivation);
  } catch (err) {
    next(err);
  }
};
