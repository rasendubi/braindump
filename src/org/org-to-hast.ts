import u from 'unist-builder';
import h from 'hastscript';
import { OrgNode, OrgData, TableRow, TableCell } from './types';

type Hast = any;

interface OrgToHastOptions {
  imageFilenameExtensions: string[];
}

const defaultOptions: OrgToHastOptions = {
  imageFilenameExtensions: [
    'png',
    'jpeg',
    'jpg',
    'gif',
    'tiff',
    'tif',
    'xbm',
    'xpm',
    'pbm',
    'pgm',
    'ppm',
    'pnm',
    'svg',
  ],
};

export function orgToHast(
  org: OrgData,
  opts: Partial<OrgToHastOptions> = {}
): Hast {
  const options = { ...defaultOptions, ...opts };
  return toHast(org);

  function toHast(node: any): Hast {
    if (Array.isArray(node)) {
      return node.map(toHast).filter((x) => x !== null && x !== undefined);
    }

    const org = node as OrgNode;

    switch (org.type) {
      case 'org-data':
        return h('div', toHast(org.children));
      case 'headline': {
        if (org.commented) return null;

        const intersperse = <T extends unknown>(items: T[], sep: T) =>
          items.flatMap((e) => [sep, e]).slice(1);

        const todo = org.todoKeyword
          ? [
              h(
                'span',
                { className: ['todo-keyword', org.todoKeyword] },
                org.todoKeyword
              ),
              ' ',
            ]
          : null;
        const priority = org.priority
          ? [h('span', { className: 'priority' }, `[${org.priority}]`), ' ']
          : null;
        const tags = org.tags.length
          ? [
              u('text', { value: '\xa0\xa0\xa0' }),
              h(
                'span.tags',
                intersperse(
                  org.tags.map(
                    (x) => h('span.tag', { className: `tag-${x}` }, x) as any
                  ),
                  '\xa0'
                )
              ),
            ]
          : null;
        return [
          h(
            `h${org.level}`,
            [todo, priority, toHast(org.title), tags].filter((x) => x)
          ),
          ...toHast(org.children),
        ];
      }
      case 'section':
        return toHast(org.children);
      case 'plain-list':
        if (org.listType === 'unordered') {
          return h('ul', toHast(org.children));
        } else if (org.listType === 'ordered') {
          return h('ol', toHast(org.children));
        } else {
          return h('dl', toHast(org.children));
        }
      case 'item':
        if (org.tag !== null) {
          return [h('dt', org.tag), h('dd', toHast(org.children))];
        } else {
          return h('li', toHast(org.children));
        }
      case 'quote-block':
        return h('blockquote', toHast(org.children));
      case 'src-block':
        return h(
          'pre',
          h(
            'code',
            {
              className: org.language ? `language-${org.language}` : undefined,
            },
            removeCommonIndent(org.value)
          )
        );
      case 'verse-block':
        return h('p.verse', toHast(org.children));
      case 'center-block':
        return h('div.center', toHast(org.children));
      case 'comment-block':
        return null;
      case 'example-block':
        return h('div.exampe', org.value);
      case 'export-block':
        if (org.backend === 'html') {
          return u('raw', org.value);
        }
        return null;
      case 'special-block':
        return h('div', toHast(org.children));
      case 'keyword':
        return null;
      case 'horizontal-rule':
        return h('hr');
      case 'diary-sexp':
        return null;
      case 'footnote-reference':
      case 'footnote-definition':
        // TODO: serialize footnotes and footnote definitions.
        return null;
      case 'paragraph':
        return h('p', toHast(org.children));
      case 'bold':
        return h('strong', toHast(org.children));
      case 'italic':
        return h('em', toHast(org.children));
      case 'code':
        return h('code', { className: 'inline-code' }, org.value);
      case 'verbatim':
        // org-mode renders verbatim as <code>
        return h('code', { className: 'inline-verbatim' }, org.value);
      case 'strike-through':
        return h('del', toHast(org.children));
      case 'underline':
        return h(
          'span',
          { style: 'text-decoration: underline;' },
          toHast(org.children)
        );
      case 'text':
        return org.value;
      case 'link': {
        const link = org.rawLink;

        const imageRe = new RegExp(
          `\.(${options.imageFilenameExtensions.join('|')})$`
        );
        if (link.match(imageRe)) {
          // TODO: set alt
          return h('img', { src: link });
        }
        return h(
          'a',
          { href: link },
          org.children.length ? toHast(org.children) : org.rawLink
        );
      }
      case 'timestamp':
        return h('span.timestamp', org.rawValue);
      case 'planning':
        return null;
      case 'property-drawer':
        return null;
      case 'drawer':
        return null;
      case 'comment':
        return null;
      case 'fixed-width':
        return h('pre', org.value);
      case 'clock':
        return null;
      case 'latex-environment':
        return h('div.math.math-display', org.value);
      case 'latex-fragment':
        return h('span.math.math-inline', org.value);
      case 'table': {
        // TODO: support column groups
        // see https://orgmode.org/manual/Column-Groups.html

        const table = h('table', []);

        let hasHead = false;
        let group: TableRow[] = [];
        (org.children as TableRow[]).forEach((r) => {
          if (r.rowType === 'rule') {
            // rule finishes the group
            if (!hasHead) {
              table.children.push(
                h(
                  'thead',
                  group.map((row: TableRow) =>
                    h(
                      'tr',
                      row.children.map((cell) => h('th', toHast(cell.children)))
                    )
                  )
                )
              );
              hasHead = true;
            } else {
              table.children.push(h('tbody', toHast(group)));
            }
            group = [];
          }

          group.push(r);
        });

        if (group.length) {
          table.children.push(h('tbody', toHast(group)));
        }

        return table;
      }
      case 'table-row':
        if (org.rowType === 'standard') {
          return h('tr', toHast(org.children));
        } else {
          return null;
        }
      case 'table-cell':
        return h('td', toHast(org.children));
      default:
        return org;
    }
  }
}

const removeCommonIndent = (s: string) => {
  const lines = s.split(/\n/g);
  const minIndent = Math.min(
    ...lines.map((l) => l.match(/\S/)?.index ?? Infinity)
  );
  const indent = minIndent === Infinity ? 0 : minIndent;
  return lines.map((l) => l.substring(indent)).join('\n');
};
