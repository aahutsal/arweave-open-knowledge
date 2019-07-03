module.exports = {
  "globals": {
		'ts-jest': {
			tsConfig: './tsconfig.json',
		},
		stringifyContentPathRegex: true,
  },
  "roots": [
    "<rootDir>/src"
  ],
  "transform": {
    ".(ts|tsx)": "ts-jest"
  },
  "testRegex": "\\.(test|spec)\\.(ts|tsx|js)$",
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js"
  ],
  "moduleNameMapper": {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/test/fileMock.js",
    "\\.(css|less)$": "<rootDir>/test/styleMock.js"
  },
  "setupFiles": [
    "./test/setup.ts"
  ]
}
