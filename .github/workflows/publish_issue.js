const matter = require("gray-matter")
const fs = require("fs");

const ALLOWED_MILESTONES = ['post', 'page'];

const issue = JSON.parse(process.argv[2]);
const { data, content } = matter(issue.body);

const milestone = issue.milestone;

if (!milestone) {
  console.warn(`Skip publishing issue ${issue.number} because milestone is missing.`);
  process.exit(0);
}

if (!ALLOWED_MILESTONES.includes(milestone.title)) {
  console.warn(`Skip publishing issue ${issue.number} because milestone ${milestone.title} is not supported. only ${ALLOWED_MILESTONES.join(',')} are allowed.`);
  process.exit(0);
}

// use milestone title as layout
data.layout = milestone.title
data.title = issue.title
data.tags = issue.labels.map(x => x.name)
data.issue = issue.number

let filename = '';
if (data.layout === 'post') {
  // post always use issue number as slug prefix
  data.slug = data.slug ? `${data.issue}-${data.slug}` : `${data.issue}`;

  // if date not set, use issue created_at
  // date will be formatted as YYYY-MM-DD and use as post filename prefix.
  const date = new Date(data.date || issue.created_at); 
  const dateOptions = { timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit" };
  data.date = date.toLocaleString("zh-CN", dateOptions).replace(/\//g, "-");

  filename = `_posts/${data.date}-${data.slug}.md`;
} else {
  // page use issue number as slug not provided.
  // page slug will be used as filename.  <slug>.md
  // to override page link, use permalink in frontmatter.
  data.slug = data.slug || `${data.issue}`;

  filename = `${data.slug}.md`;
}

const filebody = matter.stringify(content, data)
fs.writeFile(filename, filebody, "utf-8", (err) => {
  if (err) throw err

  console.log(`Published to file ${filename}`)
})
