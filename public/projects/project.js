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
        description: "A lightweight word-lookup daemon and CLI tool for Linux — similar in spirit to <a href=\"http://artha.sourceforge.net/\" target=\"_blank\">Artha</a>, but aiming further. Type <code>wd &lt;word&gt;</code> for instant definitions, or run it as a daemon with a global hotkey (Ctrl+Alt+W) to look up any selected text system-wide. The stretch goal is fully hotkey-free lookup inside PDF viewers: select a word and the definition pops up automatically, no keypress needed. Offline-first via a local WordNet database with automatic Wiktionary fallback — under 4 MB RAM at idle, zero CPU between lookups. Built in Rust with the help of Gemini 3.1 Pro; a vibecoded project where I directed the architecture and mechanical decisions while the model wrote most of the code.",
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
        description: "CommitGen is an CLI tool that automatically generates conventional git commit messages for your staged changes. It analyzes your git diff, summarizes the changes, and uses local LLMs (via Ollama) or cloud providers (via OpenRouter) to write clean, descriptive commit messages.",
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
