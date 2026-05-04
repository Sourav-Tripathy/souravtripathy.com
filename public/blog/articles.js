const articles = [
    {
        "date": "2026-05-04T03:21:25.000Z",
        "title": "The Engineering Constraints of Distributed LLM Inference Over the Open Internet",
        "subtitle": "An analysis and chain of thought",
        "link": "./the-engineering-constraints-of-distributed-llm-inference-over-the-open-internet.html",
        "originalLink": "https://siliconandsoul.substack.com/p/the-engineering-constraints-of-distributed",
        "platform": "Substack",
        "readTime": "17 min read"
    },
    {
        "date": "2026-03-15T05:23:04.000Z",
        "title": "The Case of the Swallowed Route in FastAPI",
        "subtitle": "How Starlette,Django,Werkzeug,Falcon and sanic match URLs under the hood.",
        "link": "./the-case-of-the-swallowed-route-in-fastapi.html",
        "originalLink": "https://siliconandsoul.substack.com/p/the-case-of-the-swallowed-route-in",
        "platform": "Substack",
        "readTime": "13 min read"
    },
    {
        "date": "2026-01-18T15:02:43.000Z",
        "title": "Continual learning,memory and context problem",
        "subtitle": "An analysis and chain of thoughts",
        "link": "./continual-learningmemory-and-context-problem.html",
        "originalLink": "https://siliconandsoul.substack.com/p/continual-learningmemory-and-context",
        "platform": "Substack",
        "readTime": "12 min read"
    },
    {
        "date": "2025-10-27T04:49:33.000Z",
        "title": "What are Eigenvectors and Eigenvalues?",
        "subtitle": "The geometry of identity lies not in what stays the same, but in what stays true to itself.",
        "link": "./what-are-eigenvectors-and-eigenvalues.html",
        "originalLink": "https://siliconandsoul.substack.com/p/what-are-eigenvectors-and-eigenvalues",
        "platform": "Substack",
        "readTime": "9 min read"
    },
    {
        "date": "2025-09-14T03:46:18.000Z",
        "title": "An Introduction to Knowledge Distillation in Neural Networks",
        "subtitle": "A Hands-On Experiment",
        "link": "./an-introduction-to-knowledge-distillation-in-neural-networks.html",
        "originalLink": "https://siliconandsoul.substack.com/p/an-introduction-to-knowledge-distillation",
        "platform": "Substack",
        "readTime": "6 min read"
    },
    {
        "date": "2025-08-01T15:38:47.000Z",
        "title": "Understanding LoRA and QLoRA for LLM Fine-tuning",
        "subtitle": "The world of Large Language Models (LLMs) is rapidly evolving, and with their immense power comes an equally immense appetite for computational resources.",
        "link": "./understanding-lora-and-qlora-for-llm-fine-tuning.html",
        "originalLink": "https://siliconandsoul.substack.com/p/understanding-lora-and-qlora-for",
        "platform": "Substack",
        "readTime": "8 min read"
    },
    {
        "date": "2025-07-18T20:51:08.000Z",
        "title": "The Seduction of Incompleteness",
        "subtitle": "Finding Beauty in What Refuses to Be Solved",
        "link": "./the-seduction-of-incompleteness.html",
        "originalLink": "https://siliconandsoul.substack.com/p/the-seduction-of-incompleteness",
        "platform": "Substack",
        "readTime": "4 min read"
    },
    {
        "date": "2025-06-28T15:36:10.000Z",
        "title": "In a Subversion of Life",
        "subtitle": "Between Logic and Living",
        "link": "./in-a-subversion-of-life.html",
        "originalLink": "https://siliconandsoul.substack.com/p/in-a-subversion-of-life",
        "platform": "Substack",
        "readTime": "1 min read"
    },
    {
        "date": "2025-05-17T11:58:56.000Z",
        "title": "A Stillness That Holds You",
        "subtitle": "A Love Letter to Columbus (2017)",
        "link": "./a-stillness-that-holds-you.html",
        "originalLink": "https://siliconandsoul.substack.com/p/a-stillness-that-holds-you",
        "platform": "Substack",
        "readTime": "7 min read"
    },
    {
        "date": "2025-04-27T12:56:40.000Z",
        "title": "We Are All Prisms in Sunlight",
        "subtitle": "Notes on Beauty, Uselessness, and the Refusal to Move",
        "link": "./we-are-all-prisms-in-sunlight.html",
        "originalLink": "https://siliconandsoul.substack.com/p/we-are-all-prisms-in-sunlight",
        "platform": "Substack",
        "readTime": "3 min read"
    },
    {
        "date": "2025-03-30T10:12:09.000Z",
        "title": "Of Circuits and Citrus",
        "subtitle": "Coffee,Oranges and the pulse of being",
        "link": "./of-circuits-and-citrus.html",
        "originalLink": "https://siliconandsoul.substack.com/p/of-circuits-and-citrus",
        "platform": "Substack",
        "readTime": "4 min read"
    },
    {
        "date": "2025-03-22T06:35:45.000Z",
        "title": "The Arithmetic of Theoretical Mornings ",
        "subtitle": "Coffee, Universes, and Almosts",
        "link": "./the-arithmetic-of-theoretical-mornings.html",
        "originalLink": "https://siliconandsoul.substack.com/p/the-arithmetic-of-theoretical-mornings",
        "platform": "Substack",
        "readTime": "4 min read"
    },
    {
        "date": "2025-03-12T16:13:05.000Z",
        "title": "The Calculus of Falling",
        "subtitle": "A Descent Beyond Reason",
        "link": "./the-calculus-of-falling.html",
        "originalLink": "https://siliconandsoul.substack.com/p/the-calculus-of-falling",
        "platform": "Substack",
        "readTime": "4 min read"
    },
    {
        "date": "2025-03-11T04:39:39.000Z",
        "title": "The Word Square Experiment",
        "subtitle": "A look into the hood of reasoning in LLMs",
        "link": "./the-word-square-experiment.html",
        "originalLink": "https://siliconandsoul.substack.com/p/the-word-square-experiment",
        "platform": "Substack",
        "readTime": "6 min read"
    },
    {
        "date": "2025-02-16T03:46:38.000Z",
        "title": "A Sugar Rush of Thoughts",
        "subtitle": "There is a constant battle within me… I don’t know what this battle is about, but I feel it every day.",
        "link": "./a-sugar-rush-of-thoughts.html",
        "originalLink": "https://siliconandsoul.substack.com/p/a-sugar-rush-of-thoughts",
        "platform": "Substack",
        "readTime": "2 min read"
    },
    {
        "date": "2025-01-11T14:13:57.000Z",
        "title": "To Be or Not to Be",
        "subtitle": "A Personal Reflection",
        "link": "./to-be-or-not-to-be.html",
        "originalLink": "https://siliconandsoul.substack.com/p/to-be-or-not-to-be",
        "platform": "Substack",
        "readTime": "2 min read"
    },
    {
        "date": "2024-12-04T11:50:42.000Z",
        "title": "Decoding Vectors, Matrices, and Transformations",
        "subtitle": "How simple math powers deep learning",
        "link": "./decoding-vectors-matrices-and-transformations.html",
        "originalLink": "https://siliconandsoul.substack.com/p/decoding-vectors-matrices-and-transformations",
        "platform": "Substack",
        "readTime": "6 min read"
    },
    {
        "date": "2024-11-26T20:04:51.000Z",
        "title": "A Philosophical Exploration of Existence",
        "subtitle": "I sit here, not claiming answers, but unraveling questions.",
        "link": "./a-philosophical-exploration-of-existence.html",
        "originalLink": "https://siliconandsoul.substack.com/p/a-philosophical-exploration-of-existence-5619865884bb",
        "platform": "Substack",
        "readTime": "5 min read"
    },
    {
        "date": "2024-08-31T17:55:53.000Z",
        "title": "The Power of Attention",
        "subtitle": "How AI Models Learn to Focus on What Matters",
        "link": "./the-power-of-attention.html",
        "originalLink": "https://siliconandsoul.substack.com/p/the-power-of-attention",
        "platform": "Substack",
        "readTime": "9 min read"
    },
    {
        "date": "2024-07-28T11:01:27.000Z",
        "title": "Vector Voodoo",
        "subtitle": "How Cosine Similarity Cracks the Text Comparison Code",
        "link": "./vector-voodoo.html",
        "originalLink": "https://siliconandsoul.substack.com/p/vector-voodoo",
        "platform": "Substack",
        "readTime": "4 min read"
    }
];
