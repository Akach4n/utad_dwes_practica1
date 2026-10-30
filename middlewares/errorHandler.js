// Convierte cualquier error que llega por next en una respuesta JSON con su código
export function errorHandler(err, req, res, next) {
	if (err.name === "CastError" || err.name === "ValidationError") {
		return res.status(400).json({ error: err.message });
	}
	if (err.code === 11000) {
		return res.status(409).json({ error: "Duplicated value" });
	}
	console.error(err);
	res.status(500).json({ error: "Server error" });
}
