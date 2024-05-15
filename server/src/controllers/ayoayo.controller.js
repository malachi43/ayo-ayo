const AyoAyo = require("../services/ayoayo.service");
const game = AyoAyo
class AyoAyoController {
    async gameAyoAyo(req, res) {
        res.status(200).json({ ayoayo: game });
    }
}

module.exports = new AyoAyoController();