const matter = require("gray-matter")
const fs = require("fs");

const ISSUE_TYPES = [
  {
    milestone: '文章',
    layout: 'post',
    folder: '_posts'
  },
  {
    milestone: '页面',
    layout: 'page',
    folder: '.'
  },
  {
    milestone: '精选',
    layout: 'page',
    folder: 'picks'
  }
];

const issue = JSON.parse(process.argv[2]);
const { data, content } = matter(issue.body);

const milestone = issue.milestone;

if (!milestone) {
  console.warn(`Skip publishing issue ${issue.number} because milestone is missing.`);
  process.exit(0);
}

const issueType = ISSUE_TYPES.find(type => type.milestone === milestone.title);
if (!issueType) {
  console.warn(`Skip publishing issue ${issue.number} because milestone ${milestone.title} is not supported. only ${ISSUE_TYPES.map(type => type.milestone).join(',')} are allowed.`);
  process.exit(0);
}

// use mapped milestone as layout
data.layout = issueType.layout

data.title = issue.title
data.tags = issue.labels.map(x => x.name)
data.issue = issue.number

// set date for all types, format: YYYY-MM-DD
const date = new Date(data.date || issue.created_at); 
const dateOptions = { timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit" };
data.date = date.toLocaleString("zh-CN", dateOptions).replace(/\//g, "-");

let filename = '';
if (data.layout === 'post') {
  // post always use issue number as slug prefix
  data.slug = data.slug ? `${data.issue}-${data.slug}` : `${data.issue}`;
  filename = `${issueType.folder}/${data.date}-${data.slug}.md`;
} else {
  // page use issue number as slug not provided.
  // page slug will be used as filename.  <slug>.md
  // to override page link, use permalink in frontmatter.
  data.slug = data.slug || `${data.issue}`;
  filename = `${issueType.folder}/${data.slug}.md`;
}

const filebody = matter.stringify(content, data)
fs.writeFile(filename, filebody, "utf-8", (err) => {
  if (err) throw err

  console.log(`Published to file ${filename}`)
})
