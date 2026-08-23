const projects = [
    {
        category: "WebGL / Vanilla JS Game",
        title: "The Inference Chronicles",
        url: "https://inference-chronicles.pages.dev/",
        description: "A vibe-coded, retro-cyberpunk D&D-style web game where you play an amnesiac AI engineer trying to escape a simulation of a Transformer model. Navigate through the model's pipeline (Embedding, Attention, MLP, etc.) by answering demons/gatekeepers' questions on Transformer architecture and inference engineering. V1 is live; currently working on V2.",
        footerHtml: '<a href="https://inference-chronicles.pages.dev/" target="_blank">Play V1</a> &nbsp;•&nbsp; <a href="https://github.com/Sourav-Tripathy/inference-chronicles" target="_blank">GitHub</a>',
        highlightColor: "var(--highlight)"
    },
    {
        category: "Linux CLI / Daemon (Rust)",
        title: "wd",
        url: "https://github.com/Sourav-Tripathy/wd",
        description: "A lightweight, offline-first word lookup tool and background daemon for Linux. It features instant CLI queries, system-wide hotkey support (Ctrl+Alt+W), and automated popups upon selecting text in PDF viewers. Most of the code is written with the help of AI models. A working release version is now available on GitHub.",
        footerHtml: 'View on <a href="https://github.com/Sourav-Tripathy/wd" target="_blank">GitHub</a>',
        highlightColor: "var(--highlight)"
    },
    {
        category: "LLM Inference ",
        title: "talk",
        url: "https://talk.souravtripathy.com",
        description: "A 500M parameter Qwen2.5 model natively hosted on an old GTX 1650 Ti GPU via vLLM and FastAPI. Built to keep old hardware busy. Goes offline when the laptop does.This is to study different inference methods(Currently uses VLLM)",
        footerHtml: '<a href="https://talk.souravtripathy.com" target="_blank">Try it out</a> &nbsp;•&nbsp; <a href="https://github.com/Sourav-Tripathy/talk-souravtripathy" target="_blank">GitHub</a>',
        highlightColor: "var(--highlight)"
    },
    {
        category: "Browser Extension",
        title: "ISS Distance Tracker",
        url: "https://chromewebstore.google.com/detail/iss-distance-tracker/hcleaonfidpimalcjakemloadmejpiff",
        description: "A web extension that tells you how far is the ISS from you. It notifies you when the ISS is passing over you or is within 800km from you.",
        footerHtml: 'Available on <a href="https://chromewebstore.google.com/detail/iss-distance-tracker/hcleaonfidpimalcjakemloadmejpiff" target="_blank">Chrome Web Store</a>',
        highlightColor: "var(--highlight)"
    },
    {
        category: "Knowledge Management",
        title: "Cognitia",
        url: "https://cognitia.club",
        description: "A knowledge garden for internet readings where one can share and track all reading with other people inside it.",
        footerHtml: '(Currently in dev version) — <a href="https://cognitia.club" target="_blank">cognitia.club</a>',
        highlightColor: "var(--highlight)"
    },
    {
        category: "PyPI Package(CLI tool)",
        title: "commitgen",
        url: "https://pypi.org/project/commitgen-ai/",
        description: "A CLI tool that automatically generates conventional git commit messages and changelogs. Supports local LLMs (Ollama) and cloud APIs (Gemini, OpenRouter) with customizable TOML configurations.",
        footerHtml: 'Available on <a href="https://pypi.org/project/commitgen-ai/" target="_blank">PyPI</a>',
        highlightColor: "var(--highlight)"
    },
    {
        category: "Experiments on LLMs",
        title: "Alignment Study",
        url: "https://github.com/Sourav-Tripathy/Alignment-Study",
        description: "A curiosity-driven culmination of experiments investigating the behavioral priors, decision-theoretic leanings, and alignment stability of modern LLMs when subjected to contextual variations, adversarial interactions, and logical paradoxes.",
        footerHtml: 'View on <a href="https://github.com/Sourav-Tripathy/Alignment-Study" target="_blank">GitHub</a>',
        highlightColor: "var(--highlight)"
    }
];
