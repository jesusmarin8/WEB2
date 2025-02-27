const express = require('express');
const fs = require('fs');
const Ajv = require('ajv');

const app = express();
app.use(express.json());

const ajv = new Ajv();

// Cargar esquemas
const schema1 = JSON.parse(fs.readFileSync('schemas/schema1.json', 'utf8'));
const schema2 = JSON.parse(fs.readFileSync('schemas/schema2.json', 'utf8'));

const validateSchema1 = ajv.compile(schema1);
const validateSchema2 = ajv.compile(schema2);

function validateJSON(validateFn, req, res) {
    const valid = validateFn(req.body);
    if (!valid) {
        return res.status(400).json({ error: "JSON inválido", details: validateFn.errors });
    }
    res.status(200).json({ message: "JSON válido" });
}

app.post('/validar1', (req, res) => validateJSON(validateSchema1, req, res));
app.post('/validar2', (req, res) => validateJSON(validateSchema2, req, res));

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
