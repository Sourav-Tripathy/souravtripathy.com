const curations = {
    books: {
        fiction: [
            {
                title: "The Stranger",
                author: "Albert Camus",
                authorWiki: "https://en.wikipedia.org/wiki/Albert_Camus",
                link: "https://www.goodreads.com/book/show/49552.The_Stranger"
            },
            {
                title: "Notes from Underground",
                author: "Fyodor Dostoevsky",
                authorWiki: "https://en.wikipedia.org/wiki/Fyodor_Dostoevsky",
                link: "https://www.goodreads.com/book/show/49455.Notes_from_Underground"
            },
            {
                title: "1984",
                author: "George Orwell",
                authorWiki: "https://en.wikipedia.org/wiki/George_Orwell",
                link: "https://www.goodreads.com/book/show/61439040-1984"
            },
            {
                title: "Animal Farm",
                author: "George Orwell",
                authorWiki: "https://en.wikipedia.org/wiki/George_Orwell",
                link: "https://www.goodreads.com/book/show/170448.Animal_Farm"
            },
            {
                title: "Colorless Tsukuru Tazaki and His Years of Pilgrimage",
                author: "Haruki Murakami",
                authorWiki: "https://en.wikipedia.org/wiki/Haruki_Murakami",
                link: "https://www.goodreads.com/book/show/41022133-colorless-tsukuru-tazaki-and-his-years-of-pilgrimage"
            },
            {
                title: "The Picture of Dorian Gray",
                author: "Oscar Wilde",
                authorWiki: "https://en.wikipedia.org/wiki/Oscar_Wilde",
                link: "https://www.goodreads.com/book/show/489732.The_Picture_of_Dorian_Gray"
            },
            {
                title: "Normal People",
                author: "Sally Rooney",
                authorWiki: "https://en.wikipedia.org/wiki/Sally_Rooney",
                link: "https://www.goodreads.com/book/show/41057294-normal-people"
            },
            {
                title: "No Longer Human",
                author: "Osamu Dazai",
                authorWiki: "https://en.wikipedia.org/wiki/Osamu_Dazai",
                link: "https://www.goodreads.com/book/show/194746.No_Longer_Human"
            },
            {
                title: "A Psalm for the Wild-Built",
                author: "Becky Chambers",
                authorWiki: "https://en.wikipedia.org/wiki/Becky_Chambers",
                link: "https://www.goodreads.com/book/show/40864002-a-psalm-for-the-wild-built"
            },
            {
                title: "Small Things Like These",
                author: "Claire Keegan",
                authorWiki: "https://en.wikipedia.org/wiki/Claire_Keegan",
                link: "https://www.goodreads.com/book/show/58662236-small-things-like-these"
            }
        ],
        nonFiction: [
            {
                title: "Surely You're Joking, Mr. Feynman!",
                author: "Richard P. Feynman",
                authorWiki: "https://en.wikipedia.org/wiki/Richard_Feynman",
                link: "https://www.goodreads.com/book/show/35167685-surely-you-re-joking-mr-feynman"
            },
            {
                title: "The Beginning of Infinity",
                author: "David Deutsch",
                authorWiki: "https://en.wikipedia.org/wiki/David_Deutsch",
                link: "https://www.goodreads.com/book/show/10483171-the-beginning-of-infinity"
            },
            {
                title: "Physics and Philosophy",
                author: "Werner Heisenberg",
                authorWiki: "https://en.wikipedia.org/wiki/Werner_Heisenberg",
                link: "https://www.goodreads.com/book/show/111185.Physics_and_Philosophy"
            },
            {
                title: "The Myth of Sisyphus",
                author: "Albert Camus",
                authorWiki: "https://en.wikipedia.org/wiki/Albert_Camus",
                link: "https://www.goodreads.com/book/show/91950.The_Myth_of_Sisyphus"
            },
            {
                title: "Cosmos",
                author: "Carl Sagan",
                authorWiki: "https://en.wikipedia.org/wiki/Carl_Sagan",
                link: "https://www.goodreads.com/book/show/55030.Cosmos"
            },
            {
                title: "Elon Musk: Tesla, SpaceX, and the Quest for a Fantastic Future",
                author: "Ashlee Vance",
                authorWiki: "https://en.wikipedia.org/wiki/Ashlee_Vance",
                link: "https://www.goodreads.com/book/show/25541028-elon-musk"
            },
            {
                title: "The Innovators",
                author: "Walter Isaacson",
                authorWiki: "https://en.wikipedia.org/wiki/Walter_Isaacson",
                link: "https://www.goodreads.com/book/show/21856367-the-innovators"
            },
            {
                title: "In Search of Schrödinger's Cat",
                author: "John Gribbin",
                authorWiki: "https://en.wikipedia.org/wiki/John_Gribbin",
                link: "https://www.goodreads.com/book/show/513367.In_Search_of_Schr_dinger_s_Cat"
            }
        ],
        poetry: [
            {
                title: "Do not go gentle into that good night",
                author: "Dylan Thomas",
                authorWiki: "https://en.wikipedia.org/wiki/Dylan_Thomas",
                link: "https://www.poetryfoundation.org/poems/46569/do-not-go-gentle-into-that-good-night"
            },
            {
                title: "One Hundred Love Sonnets: XVII",
                author: "Pablo Neruda",
                authorWiki: "https://en.wikipedia.org/wiki/Pablo_Neruda",
                link: "https://www.poetryfoundation.org/poems/49236/one-hundred-love-sonnets-xvii"
            },
            {
                title: "So You Want to Be a Writer",
                author: "Charles Bukowski",
                authorWiki: "https://en.wikipedia.org/wiki/Charles_Bukowski",
                link: "https://poets.org/poem/so-you-want-be-writer"
            },
            {
                title: "Ozymandias",
                author: "Percy Bysshe Shelley",
                authorWiki: "https://en.wikipedia.org/wiki/Percy_Bysshe_Shelley",
                link: "https://www.poetryfoundation.org/poems/46565/ozymandias"
            },
            {
                title: "If---",
                author: "Rudyard Kipling",
                authorWiki: "https://en.wikipedia.org/wiki/Rudyard_Kipling",
                link: "https://www.poetryfoundation.org/poems/46473/if---"
            },
            {
                title: "Stopping by Woods on a Snowy Evening",
                author: "Robert Frost",
                authorWiki: "https://en.wikipedia.org/wiki/Robert_Frost",
                link: "https://www.poetryfoundation.org/poems/42891/stopping-by-woods-on-a-snowy-evening"
            },
            {
                title: "Hymn to Intellectual Beauty",
                author: "Percy Bysshe Shelley",
                authorWiki: "https://en.wikipedia.org/wiki/Percy_Bysshe_Shelley",
                link: "https://www.poetryfoundation.org/poems/45123/hymn-to-intellectual-beauty"
            },
            {
                title: "O Captain! My Captain!",
                author: "Walt Whitman",
                authorWiki: "https://en.wikipedia.org/wiki/Walt_Whitman",
                link: "https://www.poetryfoundation.org/poems/45474/o-captain-my-captain"
            }
        ]
    },
    articles: [
        {
            title: "The Bitter Lesson (Richard Sutton)",
            link: "http://www.incompleteideas.net/IncIdeas/BitterLesson.html"
        },
        {
            title: "Is Anything Inherently Difficult? ",
            link: "https://guzey.com/education/is-anything-inherently-difficult/"
        },
        {
            title: "Great Hackers (Paul Graham)",
            link: "https://www.paulgraham.com/gh.html"
        },
        {
            title: "The Impossibility of Intelligence Explosion (François Chollet)",
            link: "https://medium.com/@francois.chollet/the-impossibility-of-intelligence-explosion-5be4a9eda6ec"
        },
        {
            title: "The Unreasonable Effectiveness of Mathematics in the Natural Sciences (Eugene Wigner)",
            link: "https://webhomes.maths.ed.ac.uk/~v1ranick/papers/wigner.pdf"
        },
        {
            title: "Good Writing (Paul Graham)",
            link: "https://www.paulgraham.com/goodwriting.html"
        },
        {
            title: "Machines of Loving Grace (Dario Amodei)",
            link: "https://darioamodei.com/essay/machines-of-loving-grace"
        },
        {
            title: "Why Does Beauty Matter?",
            link: "https://www.theculturist.io/p/why-does-beauty-matter-e7c"
        },
        {
            title: "Even If You Beat Me (Sally Rooney)",
            link: "https://thedublinreview.com/article/even-if-you-beat-me/"
        },
        {
            title: "The Problems with Deliberate Practice",
            link: "https://commoncog.com/the-problems-with-deliberate-practice/"
        },
        {
            title: "How To Understand Things",
            link: "https://nabeelqu.co/understanding"
        },
        {
            title: "Complexity Has To Live Somewhere",
            link: "https://ferd.ca/complexity-has-to-live-somewhere.html"
        },
        {
            title: "Humans Should Learn Maths",
            link: "https://web.archive.org/web/20170702000809/http://scattered-thoughts.net/blog/2014/11/15/humans-should-learn-maths/"
        },
        {
            title: "Tyler Cowen: The Man Who Wants to Know Everything",
            link: "https://archive.is/20250302062059/https://www.economist.com/1843/2025/02/28/tyler-cowen-the-man-who-wants-to-know-everything"
        },
        {
            title: "The Pancake at the Bottom (Scott Aaronson)",
            link: "https://www.scottaaronson.com/writings/pancake.html"
        },
        {
            title: "On the Need for Understanding",
            link: "https://blog.information-superhighway.net/on-the-need-for-understanding"
        }
    ],
    videos: [
        {
            title: "The complete FUN TO IMAGINE with Richard Feynman",
            link: "https://www.youtube.com/watch?v=P1ww1IXRfTA"
        },
        {
            title: "Pragmatism and Truth",
            link: "https://www.youtube.com/watch?v=1W7v4Ey2RHo"
        },
        {
            title: "Anatomy of a Request:Beyond Backend Processing (Hussein Nasser)",
            link: "https://www.youtube.com/watch?v=s0r3Aky9I5g"
        },
        {
            title: "Mission ISRO with Harsha Bhogle (Spotify Podcast)- (You will never regret listening to this)",
            link: "https://open.spotify.com/show/2JXFCMLGVhTBtdz1WYxd4H"
        }
    ]
};
