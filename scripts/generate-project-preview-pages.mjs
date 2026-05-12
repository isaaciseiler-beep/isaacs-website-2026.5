import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import { pickPreviewImage } from "./preview-images.mjs";

const root = process.cwd();
const siteContentPath = path.join(root, "src/lib/siteContent.ts");
const distDir = path.join(root, "dist");
const indexPath = path.join(distDir, "index.html");
const siteUrl = "https://isaacseiler.xyz";

const sourceText = fs.readFileSync(siteContentPath, "utf8");
const sourceFile = ts.createSourceFile(
  siteContentPath,
  sourceText,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TS,
);

const stringConstants = new Map();
const projectImages = new Map();
let projects = [];

const textOf = (node) => node.getText(sourceFile);

const readStringLike = (node) => {
  if (ts.isStringLiteralLike(node)) return node.text;

  if (ts.isNoSubstitutionTemplateLiteral(node)) return node.text;

  if (ts.isTemplateExpression(node)) {
    let value = node.head.text;
    for (const span of node.templateSpans) {
      const expressionText = textOf(span.expression);
      const constantValue = stringConstants.get(expressionText);
      if (!constantValue) return null;
      value += constantValue + span.literal.text;
    }
    return value;
  }

  return null;
};

const readPropertyName = (name) => {
  if (ts.isIdentifier(name) || ts.isStringLiteralLike(name)) return name.text;
  return null;
};

const readObjectStringProperty = (objectNode, propertyName) => {
  const property = objectNode.properties.find(
    (entry) =>
      ts.isPropertyAssignment(entry) &&
      readPropertyName(entry.name) === propertyName,
  );

  if (!property || !ts.isPropertyAssignment(property)) return null;
  return readStringLike(property.initializer);
};

const visitForConstants = (node) => {
  if (
    ts.isVariableDeclaration(node) &&
    ts.isIdentifier(node.name) &&
    node.initializer
  ) {
    const value = readStringLike(node.initializer);
    if (value) stringConstants.set(node.name.text, value);
  }

  ts.forEachChild(node, visitForConstants);
};

const visitForProjectImages = (node) => {
  if (
    ts.isVariableDeclaration(node) &&
    ts.isIdentifier(node.name) &&
    node.name.text === "projectImg" &&
    node.initializer &&
    ts.isObjectLiteralExpression(node.initializer)
  ) {
    for (const entry of node.initializer.properties) {
      if (!ts.isPropertyAssignment(entry)) continue;
      const key = readPropertyName(entry.name);
      const value = readStringLike(entry.initializer);
      if (key && value) projectImages.set(key, value);
    }
  }

  ts.forEachChild(node, visitForProjectImages);
};

const resolveImage = (node) => {
  if (ts.isPropertyAccessExpression(node) && textOf(node.expression) === "projectImg") {
    return projectImages.get(node.name.text) ?? null;
  }

  return readStringLike(node);
};

const visitForProjects = (node) => {
  if (
    ts.isVariableDeclaration(node) &&
    ts.isIdentifier(node.name) &&
    node.name.text === "projectItems" &&
    node.initializer &&
    ts.isArrayLiteralExpression(node.initializer)
  ) {
    projects = node.initializer.elements
      .filter(ts.isObjectLiteralExpression)
      .map((projectNode) => {
        const imageProperty = projectNode.properties.find(
          (entry) =>
            ts.isPropertyAssignment(entry) &&
            readPropertyName(entry.name) === "image",
        );

        return {
          id: readObjectStringProperty(projectNode, "id"),
          title: readObjectStringProperty(projectNode, "title"),
          summary: readObjectStringProperty(projectNode, "summary"),
          image:
            imageProperty && ts.isPropertyAssignment(imageProperty)
              ? resolveImage(imageProperty.initializer)
              : null,
        };
      })
      .filter((project) => project.id && project.title && project.summary && project.image);
  }

  ts.forEachChild(node, visitForProjects);
};

visitForConstants(sourceFile);
visitForProjectImages(sourceFile);
visitForProjects(sourceFile);

if (projects.length === 0) {
  throw new Error("No project preview pages were generated because no projects were found.");
}

const baseHtml = fs.readFileSync(indexPath, "utf8");

const escapeHtml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const replaceMeta = (html, selector, value) => {
  const escapedValue = escapeHtml(value);
  const expression = new RegExp(
    `(<meta\\s+${selector}\\s+content=")[^"]*(" ?/?>)`,
  );
  return html.replace(expression, `$1${escapedValue}$2`);
};

const replaceLink = (html, rel, value) => {
  const escapedValue = escapeHtml(value);
  return html.replace(
    new RegExp(`(<link\\s+rel="${rel}"\\s+href=")[^"]*(" ?/?>)`),
    `$1${escapedValue}$2`,
  );
};

const absoluteUrl = (url) => new URL(url, siteUrl).toString();

const imageTypeFor = (url) => {
  const extension = new URL(url, siteUrl).pathname.split(".").pop()?.toLowerCase();

  if (extension === "jpg" || extension === "jpeg") return "image/jpeg";
  if (extension === "gif") return "image/gif";
  if (extension === "webp") return "image/webp";
  return "image/png";
};

const applyPreviewImage = (html, image) => {
  let nextHtml = html;
  nextHtml = replaceMeta(nextHtml, 'property="og:image"', image.url);
  nextHtml = replaceMeta(nextHtml, 'property="og:image:secure_url"', image.url);
  nextHtml = replaceMeta(nextHtml, 'property="og:image:type"', image.type);
  nextHtml = replaceMeta(nextHtml, 'property="og:image:width"', String(image.width));
  nextHtml = replaceMeta(nextHtml, 'property="og:image:height"', String(image.height));
  nextHtml = replaceMeta(nextHtml, 'property="og:image:alt"', image.alt);
  nextHtml = replaceMeta(nextHtml, 'name="twitter:image"', image.url);
  return nextHtml;
};

const selectedPreviewImage = pickPreviewImage();
const homepageHtml = applyPreviewImage(baseHtml, selectedPreviewImage);
fs.writeFileSync(indexPath, homepageHtml);

for (const project of projects) {
  const url = `${siteUrl}/projects/${project.id}`;
  const title = `${project.title} | Isaac Seiler`;
  const imageUrl = absoluteUrl(project.image);

  let html = homepageHtml;
  html = html.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`);
  html = replaceLink(html, "canonical", url);
  html = replaceMeta(html, 'name="description"', project.summary);
  html = replaceMeta(html, 'property="og:title"', title);
  html = replaceMeta(html, 'property="og:description"', project.summary);
  html = replaceMeta(html, 'property="og:type"', "article");
  html = replaceMeta(html, 'property="og:url"', url);
  html = replaceMeta(html, 'property="og:image"', imageUrl);
  html = replaceMeta(html, 'property="og:image:secure_url"', imageUrl);
  html = replaceMeta(html, 'property="og:image:type"', imageTypeFor(project.image));
  html = replaceMeta(html, 'property="og:image:width"', "1200");
  html = replaceMeta(html, 'property="og:image:height"', "630");
  html = replaceMeta(html, 'property="og:image:alt"', `${project.title} preview image`);
  html = replaceMeta(html, 'name="twitter:title"', title);
  html = replaceMeta(html, 'name="twitter:description"', project.summary);
  html = replaceMeta(html, 'name="twitter:image"', imageUrl);

  const projectDir = path.join(distDir, "projects", project.id);
  fs.mkdirSync(projectDir, { recursive: true });
  fs.writeFileSync(path.join(projectDir, "index.html"), html);
}

console.log(`Generated ${projects.length} project preview pages.`);
console.log(`Selected homepage preview image: ${selectedPreviewImage.url}`);
