// exports.CATEGORIES = {
//   software: [],
//   tech: [],
//   development: [
//     "frontend development",
//     "backend development",
//     "full stack development",
//     "mobile app development",
//   ],
//   "programming languages": ["javascript", "python", "dart"],
//   "frameworks & libraries": [
//     "flutter",
//     "react",
//     "next.js",
//     "node.js",
//     "express",
//     "mongoose",
//     "redux",
//     "framer-motion",
//     "aceternity ui",
//   ],
//   "operating systems": [
//     "linux",
//     "server",
//     "windows",
//     "macos",
//     "android",
//     "ios",
//   ],
//   "artificial intelligence": [],
//   database: ["mongodb"],
//   "cyber security": [],
//   mobile: ["android", "ios"],
//   design: [],
// };

exports.CATEGORIES = [
  {
    parent_category: "software",
  },
  {
    parent_category: "tech",
  },
  {
    parent_category: "development",
    subcategories: [
      "frontend development",
      "backend development",
      "full stack development",
      "mobile application development",
    ],
  },
  {
    parent_category: "programming languages",
    subcategories: ["javascript", "python", "dart"],
  },
  {
    parent_category: "frameworks & libraries",
    subcategories: [
      "flutter",
      "react",
      "next.js",
      "node.js",
      "express",
      "mongoose",
      "redux",
      "framer-motion",
      "aceternity ui",
    ],
  },
  {
    parent_category: "operating systems",
    subcategories: ["linux", "server", "windows", "macos", "android", "IOS"],
  },
  {
    parent_category: "artificial intelligence",
  },
  {
    parent_category: "database",
    subcategories: ["mongodb"],
  },
  {
    parent_category: "Cyber Security",
  },
  {
    parent_category: "mobile",
    subcategories: ["android", "ios"],
  },
  {
    parent_category: "design",
  },
];
