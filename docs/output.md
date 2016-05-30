# Output

Given this raw input:

```js
{
  "entityMap": {
    "0": {
      "type": "LINK",
      "mutability": "MUTABLE",
      "data": {
        "url": "http://icelab.com.au"
      }
    },
    "1": {
      "type": "image",
      "mutability": "IMMUTABLE",
      "data": {
        "src": "http://placekitten.com/300/100"
      }
    },
    "2": {
      "type": "LINK",
      "mutability": "MUTABLE",
      "data": {
        "url": "https://facebook.github.io/draft-js/"
      }
    },
    "3": {
      "type": "image",
      "mutability": "IMMUTABLE",
      "data": {
        "src": "http://www.sample-videos.com/video/mp4/720/big_buck_bunny_720p_1mb.mp4"
      }
    }
  },
  "blocks": [
    {
      "key": "a34sd",
      "text": "Hello, there. This is an export from Draft.js",
      "type": "unstyled",
      "depth": 0,
      "inlineStyleRanges": [
        {
          "offset": 0,
          "length": 5,
          "style": "BOLD"
        },
        {
          "offset": 37,
          "length": 8,
          "style": "ITALIC"
        }
      ],
      "entityRanges": [
        {
          "offset": 0,
          "length": 5,
          "key": 0
        }
      ]
    },
    {
      "key": "55vrh",
      "text": "🍺",
      "type": "atomic",
      "depth": 0,
      "inlineStyleRanges": [],
      "entityRanges": [
        {
          "offset": 0,
          "length": 1,
          "key": 1
        }
      ]
    },
    {
      "key": "dodnk",
      "text": "You can have content in lists.",
      "type": "unordered-list-item",
      "depth": 0,
      "inlineStyleRanges": [
        {
          "offset": 13,
          "length": 7,
          "style": "BOLD"
        }
      ],
      "entityRanges": [
        {
          "offset": 24,
          "length": 5,
          "key": 2
        }
      ]
    },
    {
      "key": "1h6g8",
      "text": "",
      "type": "unstyled",
      "depth": 0,
      "inlineStyleRanges": [],
      "entityRanges": []
    },
    {
      "key": "9m6lk",
      "text": "🍺",
      "type": "atomic",
      "depth": 0,
      "inlineStyleRanges": [],
      "entityRanges": [
        {
          "offset": 0,
          "length": 1,
          "key": 3
        }
      ]
    },
    {
      "key": "cp3a7",
      "text": "",
      "type": "unstyled",
      "depth": 0,
      "inlineStyleRanges": [],
      "entityRanges": []
    }
  ]
}
```

The exporter would produce this output:

```js
[
  [
    "block",
    [
      "unstyled",
      "a34sd",
      [
        [
          "entity",
          [
            "LINK",
            "1",
            "MUTABLE",
            {
              "url": "http://icelab.com.au"
            },
            [
              [
                "inline",
                [
                  [
                    "BOLD"
                  ],
                  "Hello"
                ]
              ]
            ]
          ]
        ],
        [
          "inline",
          [
            [],
            ", there. This is an export from "
          ]
        ],
        [
          "inline",
          [
            [
              "ITALIC"
            ],
            "Draft.js"
          ]
        ]
      ]
    ]
  ],
  [
    "block",
    [
      "atomic",
      "55vrh",
      [
        [
          "entity",
          [
            "image",
            "2",
            "IMMUTABLE",
            {
              "src": "http://placekitten.com/300/100"
            },
            [
              [
                "inline",
                [
                  [],
                  "🍺"
                ]
              ]
            ]
          ]
        ]
      ]
    ]
  ],
  [
    "block",
    [
      "unordered-list-item",
      "dodnk",
      [
        [
          "inline",
          [
            [],
            "You can have "
          ]
        ],
        [
          "inline",
          [
            [
              "BOLD"
            ],
            "content"
          ]
        ],
        [
          "inline",
          [
            [],
            " in "
          ]
        ],
        [
          "entity",
          [
            "LINK",
            "1150",
            "MUTABLE",
            {
              "url": "https://facebook.github.io/draft-js/"
            },
            [
              [
                "inline",
                [
                  [],
                  "lists"
                ]
              ]
            ]
          ]
        ],
        [
          "inline",
          [
            [],
            "."
          ]
        ]
      ]
    ]
  ],
  [
    "block",
    [
      "unstyled",
      "1h6g8",
      [
        [
          "inline",
          [
            [],
            ""
          ]
        ]
      ]
    ]
  ],
  [
    "block",
    [
      "atomic",
      "9m6lk",
      [
        [
          "entity",
          [
            "image",
            "865",
            "IMMUTABLE",
            {
              "src": "http://www.sample-videos.com/video/mp4/720/big_buck_bunny_720p_1mb.mp4"
            },
            [
              [
                "inline",
                [
                  [],
                  "🍺"
                ]
              ]
            ]
          ]
        ]
      ]
    ]
  ],
  [
    "block",
    [
      "unstyled",
      "cp3a7",
      [
        [
          "inline",
          [
            [],
            ""
          ]
        ]
      ]
    ]
  ]
]
```
