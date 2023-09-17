require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { check, validationResult } = require('express-validator');
const OpenAIApi = require('openai');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
}));

const PORT = 3001;


const openai = new OpenAIApi({
    apikey: ''
});


app.listen(PORT, () => {
    console.log(`Server running on port : ${PORT}`);
});

app.get('/api/test', (req, res) => {
    res.json({ message: "API fonctionne !" });
});

app.post('/api/generate', 
    [check('userData').not().isEmpty().withMessage('userData est nécessaire')],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const userData = req.body;
        try {
            const gptResponse = await openai.complete({
                prompt: `Créer un site web avec les spécifications suivantes : ${userData.specifications}`,
                max_tokens: 200,
                temperature: 0.7
            });

            if (gptResponse && gptResponse.choices && gptResponse.choices.length > 0) {
                const codeGenerated = gptResponse.choices[0].text;
                res.json({ message: 'Code généré avec succès!', code: codeGenerated });
            } else {
                res.status(500).json({ error: "Erreur lors de la génération du code" });
            }
        } catch (error) {
            console.error("Erreur lors de l'appel à OpenAI:", error);
            res.status(500).json({ error: "Erreur lors de la génération du code" });
        }
    }
);

app.get('/api/templates', (req, res) => {
    const templates = [
        { id: 1, name: 'Modèle 1', code: '<div>Code pour Modèle 1</div>' },
        { id: 2, name: 'Modèle 2', code: '<div>Code pour Modèle 2</div>' },
    ];
    res.json(templates);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Une erreur est survenue!' });
});
