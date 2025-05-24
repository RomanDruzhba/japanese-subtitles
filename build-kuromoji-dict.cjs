// scripts/build-kuromoji-dict.cjs
const kuromoji = require("kuromoji");
const path = require("path");

const DIC_SOURCE = "node_modules/kuromoji/dict";
const DIC_TARGET = "public/kuromoji";

const fs = require("fs");
const fse = require("fs-extra");

fse.copy(DIC_SOURCE, DIC_TARGET)
.then(() => {
console.log("✅ Kuromoji dict copied to public/kuromoji");
})
.catch((err) => {
console.error("❌ Failed to copy Kuromoji dict", err);
});